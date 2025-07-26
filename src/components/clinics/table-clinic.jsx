'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';

const CLINICS_PER_PAGE = 15;

export default function TableClinic({
  onSelectClinic,
  searchQuery,
  currentPage,
  setCurrentPage,
  onTotalPages,
  onTotalResults,
}) {
  const [clinics, setClinics] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('clinic_name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [{ data: clinicData, error: clinicError }, { data: serviceData, error: serviceError }] =
        await Promise.all([
          supabase.from('vet_clinics').select('*'),
          supabase
            .from('vet_services')
            .select('service, service_code, parent_code, sort_order')
            .order('sort_order', { ascending: true }),
        ]);

      if (clinicError) console.error('[Supabase] Error loading clinics:', clinicError);
      if (serviceError) console.error('[Supabase] Error loading services:', serviceError);

      setClinics(clinicData || []);
      setServices(serviceData || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const matchingServiceCodes = (() => {
    if (!searchQuery?.trim()) return [];

    const query = searchQuery.toLowerCase();
    const matched = services.filter((s) => s.service.toLowerCase().includes(query));

    const directCodes = matched.map((s) => s.service_code);
    const parentCodes = matched
      .filter((s) => /\.00$/.test(s.service_code))
      .map((s) => s.service_code);

    const childCodes = services.flatMap((s) => {
      const parentPrefix = s.service_code.split('.')[0] + '.';
      return parentCodes.some(
        (p) => s.service_code.startsWith(parentPrefix) && s.service_code !== p
      )
        ? [s.service_code]
        : [];
    });

    return [...new Set([...directCodes, ...childCodes])];
  })();

  const filteredClinics = searchQuery
    ? clinics.filter(
        (clinic) =>
          Array.isArray(clinic.service_code) &&
          matchingServiceCodes.some((code) => clinic.service_code.includes(code))
      )
    : clinics;

  const sortedClinics = [...filteredClinics].sort((a, b) => {
    const aVal = a[sortField] || 0;
    const bVal = b[sortField] || 0;
    return sortDirection === 'asc'
      ? aVal.toString().localeCompare(bVal.toString(), undefined, { numeric: true })
      : bVal.toString().localeCompare(aVal.toString(), undefined, { numeric: true });
  });

  useEffect(() => {
    onTotalResults(filteredClinics.length);
  }, [filteredClinics]);

  const totalPages = Math.ceil(filteredClinics.length / CLINICS_PER_PAGE);

  useEffect(() => {
    onTotalPages(totalPages);
  }, [filteredClinics]);

  const startIdx = (currentPage - 1) * CLINICS_PER_PAGE;
  const paginatedClinics = sortedClinics.slice(startIdx, startIdx + CLINICS_PER_PAGE);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  if (loading) return <div className="text-body-sm text-body-medium p-4">Loading clinics...</div>;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="divide-table-header-bg w-full table-fixed divide-y">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('clinic_name')}
                className="text-table-header w-56 cursor-pointer px-3 py-[14px] text-left text-xs select-none first:pl-4 sm:first:pl-0"
              >
                Name{' '}
                <span className="ml-1 inline-block text-xs">{renderSortIcon('clinic_name')}</span>
              </th>
              <th
                onClick={() => handleSort('city')}
                className="text-table-header w-24 cursor-pointer px-3 py-[14px] text-left text-xs select-none"
              >
                City <span className="ml-1 inline-block text-xs">{renderSortIcon('city')}</span>
              </th>
              <th
                onClick={() => handleSort('exam_fee')}
                className="text-table-header w-18 cursor-pointer px-3 py-[14px] text-center text-xs select-none"
              >
                Exam <span className="ml-1 inline-block text-xs">{renderSortIcon('exam_fee')}</span>
              </th>
              <th
                onClick={() => handleSort('rabies_vaccine')}
                className="text-table-header w-18 cursor-pointer px-3 py-[14px] text-center text-xs select-none"
              >
                Rabies{' '}
                <span className="ml-1 inline-block text-xs">
                  {renderSortIcon('rabies_vaccine')}
                </span>
              </th>
              <th
                onClick={() => handleSort('da2pp_vaccine')}
                className="text-table-header w-18 cursor-pointer px-3 py-[14px] text-center text-xs select-none"
              >
                DA2PP{' '}
                <span className="ml-1 inline-block text-xs">{renderSortIcon('da2pp_vaccine')}</span>
              </th>
              <th
                onClick={() => handleSort('rating')}
                className="text-table-header w-20 cursor-pointer px-3 py-[14px] text-center text-xs select-none"
              >
                Rating <span className="ml-1 inline-block text-xs">{renderSortIcon('rating')}</span>
              </th>
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
