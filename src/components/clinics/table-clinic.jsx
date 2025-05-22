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
      const [{ data: clinicData }, { data: serviceData }] = await Promise.all([
        supabase.from('vet_clinics').select('*'),
        supabase
          .from('vet_services')
          .select('service, service_code, parent_code, sort_order')
          .order('sort_order', { ascending: true }),
      ]);
      setClinics(clinicData || []);
      setServices(serviceData || []);
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, setCurrentPage]);

  const matchingServiceCodes = (() => {
    if (!searchQuery?.trim()) return [];

    const query = searchQuery.toLowerCase();
    const matchedServices = services.filter((s) => s.service.toLowerCase().includes(query));

    const directMatchCodes = matchedServices.map((s) => s.service_code);
    const categoryMatches = matchedServices.filter((s) => s.service_code.endsWith('.00'));

    const childCodes = categoryMatches.flatMap((category) => {
      const baseCode = `${category.service_code.split('.')[0]}.`;
      return services
        .filter(
          (s) => s.service_code.startsWith(baseCode) && s.service_code !== category.service_code
        )
        .map((s) => s.service_code);
    });

    return [...new Set([...directMatchCodes, ...childCodes])];
  })();

  const filteredClinics = searchQuery
    ? clinics.filter((clinic) => {
        if (!clinic.service_code) return false;

        let codes = [];
        try {
          if (typeof clinic.service_code === 'string') {
            if (clinic.service_code.startsWith('{') || clinic.service_code.startsWith('[')) {
              const parsed = JSON.parse(clinic.service_code);
              codes = Array.isArray(parsed) ? parsed : [parsed];
            } else {
              codes = clinic.service_code.split(',').map((c) => c.trim());
            }
          } else if (Array.isArray(clinic.service_code)) {
            codes = clinic.service_code;
          }
        } catch {
          codes = clinic.service_code.split(',').map((c) => c.trim());
        }

        return matchingServiceCodes.some((code) => codes.includes(code));
      })
    : clinics;

  const sortedClinics = [...filteredClinics].sort((a, b) => {
    const aVal = a[sortField] || '';
    const bVal = b[sortField] || '';
    return sortDirection === 'asc'
      ? aVal.toString().localeCompare(bVal.toString(), undefined, { numeric: true })
      : bVal.toString().localeCompare(aVal.toString(), undefined, { numeric: true });
  });

  useEffect(() => {
    onTotalResults(filteredClinics.length);
    onTotalPages(Math.ceil(filteredClinics.length / CLINICS_PER_PAGE));
  }, [filteredClinics, onTotalResults, onTotalPages]);

  const paginatedClinics = sortedClinics.slice(
    (currentPage - 1) * CLINICS_PER_PAGE,
    currentPage * CLINICS_PER_PAGE
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcon = (field) =>
    sortField === field ? (sortDirection === 'asc' ? '▲' : '▼') : '⇅';

  if (loading) {
    return <div className="text-body-sm text-body-medium p-4">Loading clinics...</div>;
  }

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="divide-table-header-bg w-full table-fixed divide-y">
          <thead>
            <tr>
              {[
                { label: 'Name', field: 'clinic_name', w: 'w-68 sm:w-76' },
                { label: 'City', field: 'city', w: 'w-32' },
                { label: 'Phone', field: null, w: 'w-32' },
                { label: 'Exam Fee', field: 'exam_fee', w: 'w-20', align: 'center' },
                { label: 'Rating', field: 'rating', w: 'w-20', align: 'center' },
                { label: 'Website', field: null, w: 'w-20', align: 'center' },
              ].map(({ label, field, w, align = 'left' }) => (
                <th
                  key={label}
                  onClick={field ? () => handleSort(field) : null}
                  className={`text-table-header text-heading-2 ${w} px-3 py-[14px] select-none text-${align} ${
                    field ? 'cursor-pointer' : ''
                  } ${label === 'Name' ? 'first:pl-4 sm:first:pl-0' : ''}`}
                >
                  {label}
                  {field && (
                    <span className="ml-1 inline-block text-sm">{renderSortIcon(field)}</span>
                  )}
                </th>
              ))}
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
                  className="w-48 py-4 pr-3 pl-4 text-left font-sans text-xs font-medium whitespace-nowrap hover:text-blue-600 sm:w-56 sm:pl-0"
                >
                  {clinic.clinic_name}
                </td>
                <td className="w-32 text-left font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.city || '—'}
                </td>
                <td className="w-32 text-left font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.phone_number || '—'}
                </td>
                <td className="w-28 text-center font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.exam_fee ? `$${clinic.exam_fee.toFixed(2)}` : '—'}
                </td>
                <td className="w-32 text-center font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.rating
                    ? `${clinic.rating.toFixed(1)} (${clinic.total_reviews || 0})`
                    : '—'}
                </td>
                <td className="w-20 text-center font-sans text-xs font-medium whitespace-nowrap">
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

      {/* Mobile Card View */}
      <div className="block space-y-4 sm:hidden">
        {paginatedClinics.map((clinic) => (
          <div
            key={clinic.clinic_id}
            onClick={() => onSelectClinic(clinic)}
            className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:bg-blue-50"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-semibold text-gray-900">{clinic.clinic_name}</h3>
              {clinic.website && (
                <a
                  href={clinic.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
            <div className="mt-2 space-y-1 text-xs text-gray-600">
              <p>{clinic.city || '—'}</p>
              <p>{clinic.phone_number || '—'}</p>
              <div className="flex justify-between pt-2">
                <span>
                  <strong>Exam Fee:</strong>{' '}
                  {clinic.exam_fee ? `$${clinic.exam_fee.toFixed(2)}` : '—'}
                </span>
                <span>
                  <strong>Rating:</strong>{' '}
                  {clinic.rating
                    ? `${clinic.rating.toFixed(1)} (${clinic.total_reviews || 0})`
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
