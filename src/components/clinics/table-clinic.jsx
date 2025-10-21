'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';

const CLINICS_PER_PAGE = 15;

// Normalize any filter item into [min, max]
function toRange(item) {
  if (!item) return [-Infinity, Infinity];
  if (Array.isArray(item)) return [Number(item[0]), Number(item[1])];
  if (Array.isArray(item.range)) return [Number(item.range[0]), Number(item.range[1])];
  if (typeof item.min !== 'undefined' || typeof item.max !== 'undefined') {
    return [Number(item.min ?? -Infinity), Number(item.max ?? Infinity)];
  }
  return [-Infinity, Infinity];
}

export default function TableClinic({
  onSelectClinic,
  searchQuery,
  searchType,
  sortOption,
  activeFilters,
  currentPage,
  setCurrentPage,
  onTotalPages,
  onTotalResults,
  clinics = [],
  services = [],
}) {
  const [loading, setLoading] = useState(false);

  // Track if this is the first render
  const isFirstRender = useRef(true);
  const previousSortOption = useRef(sortOption);

  // Log sort changes (for debugging - remove in production)
  useEffect(() => {
    if (!isFirstRender.current && previousSortOption.current !== sortOption) {
      console.log(
        'TableClinic: Sort actually changed from',
        previousSortOption.current,
        'to',
        sortOption
      );
      previousSortOption.current = sortOption;
    }
    isFirstRender.current = false;
  }, [sortOption]);

  // Filter clinics based on search query
  const searchFilteredClinics = useMemo(() => {
    if (!searchQuery?.trim()) return clinics;

    const query = searchQuery.toLowerCase();

    // When a specific type is selected from dropdown, use exact matching
    // Otherwise, use partial matching for free-text search
    const isExactMatch = searchType && searchType !== 'text';

    return clinics.filter((clinic) => {
      // Exact matching when user selected from dropdown
      if (isExactMatch) {
        if (searchType === 'clinic' && clinic.clinic_name?.toLowerCase() === query) return true;
        if (searchType === 'city' && clinic.city?.toLowerCase() === query) return true;
        if (searchType === 'address' && clinic.street_address?.toLowerCase() === query) return true;
        if (searchType === 'province' && clinic.province?.toLowerCase() === query) return true;

        // Services - exact match
        if ((searchType === 'service' || searchType === 'category') && Array.isArray(clinic.service_code)) {
          const clinicServices = services.filter((s) => clinic.service_code.includes(s.service_code));
          if (clinicServices.some((s) => s.service?.toLowerCase() === query)) return true;

          const categories = services.filter(
            (s) => s.service_code.endsWith('.00') && s.service?.toLowerCase() === query
          );
          for (const category of categories) {
            const categoryPrefix = category.service_code.split('.')[0] + '.';
            if (clinic.service_code.some((code) => code.startsWith(categoryPrefix))) return true;
          }
        }
        return false;
      }

      // Partial matching for free-text search
      if (clinic.clinic_name?.toLowerCase().includes(query)) return true; // Name
      if (clinic.city?.toLowerCase().includes(query)) return true; // City
      if (clinic.street_address?.toLowerCase().includes(query)) return true; // Address
      if (clinic.province?.toLowerCase().includes(query)) return true; // Province

      // Services
      if (Array.isArray(clinic.service_code)) {
        const clinicServices = services.filter((s) => clinic.service_code.includes(s.service_code));
        if (clinicServices.some((s) => s.service?.toLowerCase().includes(query))) return true;

        const categories = services.filter(
          (s) => s.service_code.endsWith('.00') && s.service?.toLowerCase().includes(query)
        );
        for (const category of categories) {
          const categoryPrefix = category.service_code.split('.')[0] + '.';
          if (clinic.service_code.some((code) => code.startsWith(categoryPrefix))) return true;
        }
      }
      return false;
    });
  }, [searchQuery, searchType, clinics, services]);

  // Apply price and rating filters
  const filteredClinics = useMemo(() => {
    let result = [...searchFilteredClinics];

    // Exam fee filter - now using min/max range
    if (activeFilters?.exam && typeof activeFilters.exam === 'object' && activeFilters.exam.min !== undefined) {
      result = result.filter((clinic) => {
        if (clinic.exam_fee == null) return false;
        return clinic.exam_fee >= activeFilters.exam.min && clinic.exam_fee <= activeFilters.exam.max;
      });
    }

    // Vaccine fee filter - now using min/max range
    if (activeFilters?.vaccine && typeof activeFilters.vaccine === 'object' && activeFilters.vaccine.min !== undefined) {
      result = result.filter((clinic) => {
        if (clinic.da2pp_vaccine == null) return false;
        return clinic.da2pp_vaccine >= activeFilters.vaccine.min && clinic.da2pp_vaccine <= activeFilters.vaccine.max;
      });
    }

    // Spay filter - now using min/max range
    if (activeFilters?.spay && typeof activeFilters.spay === 'object' && activeFilters.spay.min !== undefined) {
      result = result.filter((clinic) => {
        if (clinic.spay == null) return false;
        return clinic.spay >= activeFilters.spay.min && clinic.spay <= activeFilters.spay.max;
      });
    }

    // Neuter filter - now using min/max range
    if (activeFilters?.neuter && typeof activeFilters.neuter === 'object' && activeFilters.neuter.min !== undefined) {
      result = result.filter((clinic) => {
        if (clinic.neuter == null) return false;
        return clinic.neuter >= activeFilters.neuter.min && clinic.neuter <= activeFilters.neuter.max;
      });
    }

    // Rating filter - now using min/max range
    if (activeFilters?.rating && typeof activeFilters.rating === 'object' && activeFilters.rating.min !== undefined) {
      result = result.filter((clinic) => {
        const rating = typeof clinic.rating === 'number' ? clinic.rating : 0;
        return rating >= activeFilters.rating.min && rating <= activeFilters.rating.max;
      });
    }

    // City filters
    if (activeFilters?.city?.length) {
      const allowedCities = new Set(
        activeFilters.city
          .map((c) => (typeof c === 'string' ? c : c?.value))
          .filter(Boolean)
          .map((s) => String(s).toLowerCase())
      );
      result = result.filter(
        (clinic) => clinic.city && allowedCities.has(String(clinic.city).toLowerCase())
      );
    }

    return result;
  }, [searchFilteredClinics, activeFilters]);

  // Calculate data completeness score for a clinic
  const getDataCompletenessScore = (clinic) => {
    let score = 0;
    if (Number.isFinite(clinic.exam_fee)) score++;
    if (Number.isFinite(clinic.da2pp_vaccine)) score++;
    if (Number.isFinite(clinic.spay)) score++;
    if (Number.isFinite(clinic.neuter)) score++;
    return score;
  };

  // Sort clinics - ONLY when sortOption or filteredClinics actually change
  const sortedClinics = useMemo(() => {
    const sorted = [...filteredClinics];

    // Skip sorting if we have no clinics
    if (sorted.length === 0) return sorted;

    switch (sortOption) {
      case 'clinic-asc':
        sorted.sort((a, b) => {
          const scoreA = getDataCompletenessScore(a);
          const scoreB = getDataCompletenessScore(b);
          if (scoreB !== scoreA) return scoreB - scoreA;
          return (a.clinic_name || '').localeCompare(b.clinic_name || '');
        });
        break;
      case 'clinic-desc':
        sorted.sort((a, b) => {
          const scoreA = getDataCompletenessScore(a);
          const scoreB = getDataCompletenessScore(b);
          if (scoreB !== scoreA) return scoreB - scoreA;
          return (b.clinic_name || '').localeCompare(a.clinic_name || '');
        });
        break;
      case 'city-asc':
        sorted.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
        break;
      case 'city-desc':
        sorted.sort((a, b) => (b.city || '').localeCompare(a.city || ''));
        break;
      case 'nearest':
        // For now, fallback to city sort when no location
        // TODO: Implement actual distance calculation when location is available
        sorted.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
        break;
      case 'exam-low':
        sorted.sort((a, b) => (a.exam_fee ?? 999999) - (b.exam_fee ?? 999999));
        break;
      case 'vaccine-low':
        sorted.sort((a, b) => (a.da2pp_vaccine ?? 999999) - (b.da2pp_vaccine ?? 999999));
        break;
      case 'rating-high':
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        sorted.sort((a, b) => {
          const scoreA = getDataCompletenessScore(a);
          const scoreB = getDataCompletenessScore(b);
          if (scoreB !== scoreA) return scoreB - scoreA;
          return (a.clinic_name || '').localeCompare(b.clinic_name || '');
        });
        break;
    }

    return sorted;
  }, [filteredClinics, sortOption]);

  // Update totals - with debouncing to prevent multiple updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onTotalResults(sortedClinics.length);
      onTotalPages(Math.ceil(sortedClinics.length / CLINICS_PER_PAGE));
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [sortedClinics.length]); // Only depend on length, not the full array

  // Pagination
  const startIdx = (currentPage - 1) * CLINICS_PER_PAGE;
  const paginatedClinics = sortedClinics.slice(startIdx, startIdx + CLINICS_PER_PAGE);

  if (loading) return <div className="text-body-sm text-body-medium p-4">Loading clinics...</div>;

  if (paginatedClinics.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No clinics found matching your search criteria.</p>
        <p className="mt-2 text-sm text-gray-400">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full shadow-lg rounded-lg overflow-hidden bg-white">
      <table className="w-full table-fixed">
        <thead className="bg-gradient-to-br from-blue-500 to-blue-600">
          <tr>
            <th
              scope="col"
              className="w-56 px-3 py-[14px] pl-4 text-left text-sm font-bold text-white"
            >
              Name
            </th>
            <th
              scope="col"
              className="hidden w-24 px-3 py-[14px] text-left text-sm font-bold text-white sm:table-cell"
            >
              City
            </th>
            <th
              scope="col"
              className="hidden w-18 px-3 py-[14px] text-center text-sm font-bold text-white sm:table-cell"
            >
              Exam
            </th>
            <th
              scope="col"
              className="hidden w-18 px-3 py-[14px] text-center text-sm font-bold text-white sm:table-cell"
            >
              Core Vaccine
            </th>
            <th
              scope="col"
              className="hidden w-18 px-3 py-[14px] text-center text-sm font-bold text-white sm:table-cell"
            >
              Spay
            </th>
            <th
              scope="col"
              className="hidden w-18 px-3 py-[14px] text-center text-sm font-bold text-white sm:table-cell"
            >
              Neuter
            </th>
            <th
              scope="col"
              className="hidden w-20 px-3 py-[14px] text-center text-sm font-bold text-white sm:table-cell"
            >
              Rating
            </th>
            <th
              scope="col"
              className="hidden w-16 px-3 py-[14px] text-center text-sm font-bold text-white sm:table-cell"
            >
              Website
            </th>
          </tr>
        </thead>

          <tbody>
            {paginatedClinics.map((clinic) => (
              <tr
                key={clinic.clinic_id}
                className="group cursor-pointer text-slate-800 transition-colors odd:bg-gray-50 even:bg-white hover:bg-slate-200 active:bg-slate-200"
              >
                {/* Name + mobile stacked labels */}
                <td
                  onClick={() => onSelectClinic(clinic)}
                  className="w-56 py-4 pr-3 pl-4 text-left font-sans text-xs font-medium sm:w-auto"
                  style={{ wordBreak: 'break-word' }}
                >
                  <span className="font-semibold sm:hidden">Name: </span>
                  <span className="group-hover:text-blue-500 group-active:text-blue-500">
                    {clinic.clinic_name}
                  </span>

                  {/* Mobile stacked details */}
                  <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-slate-800 sm:hidden">
                    <span className="font-semibold">City:</span>
                    <span className="truncate">{clinic.city || '—'}</span>

                    <span className="font-semibold">Exam:</span>
                    <span>
                      {Number.isFinite(clinic.exam_fee) ? `$${clinic.exam_fee.toFixed(0)}` : '—'}
                    </span>

                    <span className="font-semibold">Core Vaccine:</span>
                    <span>
                      {Number.isFinite(clinic.da2pp_vaccine)
                        ? `$${clinic.da2pp_vaccine.toFixed(0)}`
                        : '—'}
                    </span>

                    <span className="font-semibold">Spay:</span>
                    <span>{Number.isFinite(clinic.spay) ? `$${clinic.spay.toFixed(0)}` : '—'}</span>

                    <span className="font-semibold">Neuter:</span>
                    <span>
                      {Number.isFinite(clinic.neuter) ? `$${clinic.neuter.toFixed(0)}` : '—'}
                    </span>

                    <span className="font-semibold">Rating:</span>
                    <span>
                      {Number.isFinite(clinic.rating)
                        ? `${clinic.rating.toFixed(1)} (${clinic.total_reviews || 0})`
                        : '—'}
                    </span>

                    <span className="font-semibold">Website:</span>
                    <span>
                      {clinic.website ? (
                        <a
                          href={clinic.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit
                          <ArrowTopRightOnSquareIcon
                            className="ml-1 h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </a>
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>
                </td>

                {/* Desktop-only cells */}
                <td className="hidden w-24 text-left font-sans text-xs font-medium whitespace-nowrap sm:table-cell">
                  {clinic.city || '—'}
                </td>
                <td className="hidden w-18 text-center font-sans text-xs font-medium whitespace-nowrap sm:table-cell">
                  {Number.isFinite(clinic.exam_fee) ? `$${clinic.exam_fee.toFixed(0)}` : '—'}
                </td>
                <td className="hidden w-18 text-center font-sans text-xs font-medium whitespace-nowrap sm:table-cell">
                  {Number.isFinite(clinic.da2pp_vaccine)
                    ? `$${clinic.da2pp_vaccine.toFixed(0)}`
                    : '—'}
                </td>
                <td className="hidden w-18 text-center font-sans text-xs font-medium whitespace-nowrap sm:table-cell">
                  {Number.isFinite(clinic.spay) ? `$${clinic.spay.toFixed(0)}` : '—'}
                </td>
                <td className="hidden w-18 text-center font-sans text-xs font-medium whitespace-nowrap sm:table-cell">
                  {Number.isFinite(clinic.neuter) ? `$${clinic.neuter.toFixed(0)}` : '—'}
                </td>
                <td className="hidden w-20 text-center font-sans text-xs font-medium whitespace-nowrap sm:table-cell">
                  {Number.isFinite(clinic.rating)
                    ? `${clinic.rating.toFixed(1)} (${clinic.total_reviews || 0})`
                    : '—'}
                </td>
                <td className="hidden w-16 text-center font-sans text-xs font-medium whitespace-nowrap sm:table-cell">
                  {clinic.website ? (
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-blue-500 hover:text-blue-600" aria-hidden="true" />
                      <span className="sr-only">Visit website</span>
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
