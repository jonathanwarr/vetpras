'use client';

import { useEffect, useState, useMemo } from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';

const CLINICS_PER_PAGE = 15;

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
      // Search by clinic name
      if (clinic.clinic_name?.toLowerCase().includes(query)) return true;

      // Search by city
      if (clinic.city?.toLowerCase().includes(query)) return true;

      // Search by address
      if (clinic.street_address?.toLowerCase().includes(query)) return true;

      // Search by province
      if (clinic.province?.toLowerCase().includes(query)) return true;

      // Search by services
      if (Array.isArray(clinic.service_code)) {
        const clinicServices = services.filter((s) => clinic.service_code.includes(s.service_code));

        const hasMatchingService = clinicServices.some((s) =>
          s.service?.toLowerCase().includes(query)
        );

        if (hasMatchingService) return true;

        // Check for category matches
        const categories = services.filter(
          (s) => s.service_code.endsWith('.00') && s.service?.toLowerCase().includes(query)
        );

        for (const category of categories) {
          const categoryPrefix = category.service_code.split('.')[0] + '.';
          const hasServiceInCategory = clinic.service_code.some((code) =>
            code.startsWith(categoryPrefix)
          );
          if (hasServiceInCategory) return true;
        }
      }

      return false;
    });
  }, [searchQuery, clinics, services]);

  // Apply price and rating filters
  const filteredClinics = useMemo(() => {
    let result = [...searchFilteredClinics];

    // Apply exam fee filters
    if (activeFilters.exam && activeFilters.exam.length > 0) {
      result = result.filter((clinic) => {
        if (!clinic.exam_fee) return false;
        return activeFilters.exam.some((filter) => {
          const [min, max] = filter.range;
          return clinic.exam_fee >= min && clinic.exam_fee <= max;
        });
      });
    }

    // Apply vaccine fee filters (using average of rabies and da2pp)
    if (activeFilters.vaccine && activeFilters.vaccine.length > 0) {
      result = result.filter((clinic) => {
        if (!clinic.rabies_vaccine && !clinic.da2pp_vaccine) return false;

        // Calculate average vaccine cost
        let vaccineCount = 0;
        let vaccineTotal = 0;
        if (clinic.rabies_vaccine) {
          vaccineTotal += clinic.rabies_vaccine;
          vaccineCount++;
        }
        if (clinic.da2pp_vaccine) {
          vaccineTotal += clinic.da2pp_vaccine;
          vaccineCount++;
        }
        const avgVaccine = vaccineCount > 0 ? vaccineTotal / vaccineCount : 0;

        return activeFilters.vaccine.some((filter) => {
          const [min, max] = filter.range;
          return avgVaccine >= min && avgVaccine <= max;
        });
      });
    }

    // Apply rating filters
    if (activeFilters.rating && activeFilters.rating.length > 0) {
      result = result.filter((clinic) => {
        const rating = clinic.rating || 0;
        return activeFilters.rating.some((filter) => {
          const [min, max] = filter.range;
          return rating >= min && rating <= max;
        });
      });
    }

    return result;
  }, [searchFilteredClinics, activeFilters]);

  // Sort clinics
  const sortedClinics = useMemo(() => {
    const sorted = [...filteredClinics];

    switch (sortOption) {
      case 'clinic-asc':
        sorted.sort((a, b) => (a.clinic_name || '').localeCompare(b.clinic_name || ''));
        break;
      case 'clinic-desc':
        sorted.sort((a, b) => (b.clinic_name || '').localeCompare(a.clinic_name || ''));
        break;
      case 'city-asc':
        sorted.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
        break;
      case 'city-desc':
        sorted.sort((a, b) => (b.city || '').localeCompare(a.city || ''));
        break;
      case 'nearest':
        // This would require user location - for now, sort by city
        sorted.sort((a, b) => (a.city || '').localeCompare(b.city || ''));
        break;
      case 'exam-low':
        sorted.sort((a, b) => (a.exam_fee || 999999) - (b.exam_fee || 999999));
        break;
      case 'vaccine-low':
        sorted.sort((a, b) => {
          const aVaccine = ((a.rabies_vaccine || 0) + (a.da2pp_vaccine || 0)) / 2 || 999999;
          const bVaccine = ((b.rabies_vaccine || 0) + (b.da2pp_vaccine || 0)) / 2 || 999999;
          return aVaccine - bVaccine;
        });
        break;
      case 'rating-high':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    return sorted;
  }, [filteredClinics, sortOption]);

  // Update total results
  useEffect(() => {
    onTotalResults(sortedClinics.length);
    const totalPages = Math.ceil(sortedClinics.length / CLINICS_PER_PAGE);
    onTotalPages(totalPages);
  }, [sortedClinics, onTotalResults, onTotalPages]);

  // Paginate results
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
      <div className="overflow-x-auto">
        <table className="divide-table-header-bg w-full table-fixed divide-y">
          <thead>
            <tr>
              <th className="text-table-header w-56 px-3 py-[14px] text-left text-xs first:pl-4 sm:first:pl-0">
                Name
              </th>
              <th className="text-table-header w-24 px-3 py-[14px] text-left text-xs">City</th>
              <th className="text-table-header w-18 px-3 py-[14px] text-center text-xs">Exam</th>
              <th className="text-table-header w-18 px-3 py-[14px] text-center text-xs">Rabies</th>
              <th className="text-table-header w-18 px-3 py-[14px] text-center text-xs">DA2PP</th>
              <th className="text-table-header w-20 px-3 py-[14px] text-center text-xs">Rating</th>
              <th className="text-table-header w-16 px-3 py-[14px] text-center text-xs">Website</th>
            </tr>
          </thead>
          <tbody className="divide-table-header-bg divide-y">
            {paginatedClinics.map((clinic) => (
              <tr
                key={clinic.clinic_id}
                className="cursor-pointer even:bg-gray-50 hover:bg-blue-50"
              >
                <td
                  onClick={() => onSelectClinic(clinic)}
                  className="w-56 py-4 pr-3 pl-4 text-left font-sans text-xs font-medium hover:text-blue-600 sm:pl-0"
                  style={{ wordBreak: 'break-word' }}
                >
                  {clinic.clinic_name}
                </td>
                <td className="w-24 text-left font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.city || '—'}
                </td>
                <td className="w-18 text-center font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.exam_fee ? `$${clinic.exam_fee.toFixed(0)}` : '—'}
                </td>
                <td className="w-18 text-center font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.rabies_vaccine ? `$${clinic.rabies_vaccine.toFixed(0)}` : '—'}
                </td>
                <td className="w-18 text-center font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.da2pp_vaccine ? `$${clinic.da2pp_vaccine.toFixed(0)}` : '—'}
                </td>
                <td className="w-20 text-center font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.rating
                    ? `${clinic.rating.toFixed(1)} (${clinic.total_reviews || 0})`
                    : '—'}
                </td>
                <td className="w-16 text-center font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.website ? (
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline"
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
