'use client';

import { useEffect, useState, useMemo } from 'react';
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

  // Filter clinics based on search query
  const searchFilteredClinics = useMemo(() => {
    if (!searchQuery?.trim()) return clinics;

    const query = searchQuery.toLowerCase();

    return clinics.filter((clinic) => {
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
  }, [searchQuery, clinics, services]);

  // Apply price and rating filters
  const filteredClinics = useMemo(() => {
    let result = [...searchFilteredClinics];

    // Exam fee filters
    if (activeFilters?.exam?.length) {
      result = result.filter((clinic) => {
        if (clinic.exam_fee == null) return false;
        return activeFilters.exam.some((f) => {
          const [min, max] = toRange(f);
          return clinic.exam_fee >= min && clinic.exam_fee <= max;
        });
      });
    }

    // Vaccine fee filters (core vaccine only)
    if (activeFilters?.vaccine?.length) {
      result = result.filter((clinic) => {
        if (clinic.da2pp_vaccine == null) return false;

        const vaccinePrice = clinic.da2pp_vaccine;

        return activeFilters.vaccine.some((f) => {
          const [min, max] = toRange(f);
          return vaccinePrice >= min && vaccinePrice <= max;
        });
      });
    }

    // Rating filters
    if (activeFilters?.rating?.length) {
      result = result.filter((clinic) => {
        const rating = typeof clinic.rating === 'number' ? clinic.rating : 0;
        return activeFilters.rating.some((f) => {
          const [min, max] = toRange(f);
          return rating >= min && rating <= max;
        });
      });
    }

    // City filters (new)
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

  // Sort clinics
  const sortedClinics = useMemo(() => {
    const sorted = [...filteredClinics];

    switch (sortOption) {
      case 'clinic-asc':
        sorted.sort((a, b) => {
          // First sort by data completeness (more complete data first)
          const scoreA = getDataCompletenessScore(a);
          const scoreB = getDataCompletenessScore(b);
          if (scoreB !== scoreA) return scoreB - scoreA;
          // Then sort alphabetically
          return (a.clinic_name || '').localeCompare(b.clinic_name || '');
        });
        break;
      case 'clinic-desc':
        sorted.sort((a, b) => {
          // First sort by data completeness (more complete data first)
          const scoreA = getDataCompletenessScore(a);
          const scoreB = getDataCompletenessScore(b);
          if (scoreB !== scoreA) return scoreB - scoreA;
          // Then sort alphabetically descending
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
        // Placeholder (needs user location)
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
        // Default sort: data completeness first, then alphabetically
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

  // Update totals
  useEffect(() => {
    onTotalResults(sortedClinics.length);
    onTotalPages(Math.ceil(sortedClinics.length / CLINICS_PER_PAGE));
  }, [sortedClinics, onTotalResults, onTotalPages]);

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
    <div className="w-full">
      <div className="w-full">
        <table className="w-full table-fixed">
          <thead className="border-b border-gray-200">
            <tr>
              <th
                scope="col"
                className="text-table-header w-56 px-3 py-[14px] pl-4 text-left text-xs"
              >
                Name
              </th>
              <th
                scope="col"
                className="text-table-header hidden w-24 px-3 py-[14px] text-left text-xs sm:table-cell"
              >
                City
              </th>
              <th
                scope="col"
                className="text-table-header hidden w-18 px-3 py-[14px] text-center text-xs sm:table-cell"
              >
                Exam
              </th>
              <th
                scope="col"
                className="text-table-header hidden w-18 px-3 py-[14px] text-center text-xs sm:table-cell"
              >
                Core Vaccine
              </th>
              <th
                scope="col"
                className="text-table-header hidden w-18 px-3 py-[14px] text-center text-xs sm:table-cell"
              >
                Spay
              </th>
              <th
                scope="col"
                className="text-table-header hidden w-18 px-3 py-[14px] text-center text-xs sm:table-cell"
              >
                Neuter
              </th>
              <th
                scope="col"
                className="text-table-header hidden w-20 px-3 py-[14px] text-center text-xs sm:table-cell"
              >
                Rating
              </th>
              <th
                scope="col"
                className="text-table-header hidden w-16 px-3 py-[14px] text-center text-xs sm:table-cell"
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
                    <span>
                      {Number.isFinite(clinic.spay)
                        ? `$${clinic.spay.toFixed(0)}`
                        : '—'}
                    </span>

                    <span className="font-semibold">Neuter:</span>
                    <span>
                      {Number.isFinite(clinic.neuter)
                        ? `$${clinic.neuter.toFixed(0)}`
                        : '—'}
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
                  {Number.isFinite(clinic.spay)
                    ? `$${clinic.spay.toFixed(0)}`
                    : '—'}
                </td>
                <td className="hidden w-18 text-center font-sans text-xs font-medium whitespace-nowrap sm:table-cell">
                  {Number.isFinite(clinic.neuter)
                    ? `$${clinic.neuter.toFixed(0)}`
                    : '—'}
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
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
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
