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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [{ data: clinicData, error: clinicError }, { data: serviceData, error: serviceError }] =
        await Promise.all([
          supabase.from('clinics').select('*'),
          supabase
            .from('services')
            .select('service, service_code, parent_code, sort_order')
            .order('sort_order', { ascending: true }),
        ]);

      if (clinicError) console.error('[Supabase] Clinic fetch error:', clinicError);
      else setClinics(clinicData);

      if (serviceError) console.error('[Supabase] Service fetch error:', serviceError);
      else setServices(serviceData);

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const matchingServiceCodes = (() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const matchedServices = services.filter((s) => s.service.toLowerCase().includes(query));

    const parentCodes = matchedServices
      .filter((s) => s.parent_code === null)
      .map((s) => s.service_code);

    const childCodes = services
      .filter((s) => parentCodes.includes(s.parent_code))
      .map((s) => s.service_code);

    const allCodes = new Set([...matchedServices.map((s) => s.service_code), ...childCodes]);
    return Array.from(allCodes);
  })();

  const filteredClinics = searchQuery
    ? clinics.filter((clinic) => {
        const codes = clinic.service_codes;
        if (!codes) return false;

        const clinicCodes = Array.isArray(codes)
          ? codes
          : typeof codes === 'string'
            ? codes.split(',').map((c) => c.trim())
            : [];

        return matchingServiceCodes.some((code) => clinicCodes.includes(code));
      })
    : clinics;

  useEffect(() => {
    onTotalResults(filteredClinics.length);
  }, [filteredClinics.length, onTotalResults]);

  const totalPages = Math.ceil(filteredClinics.length / CLINICS_PER_PAGE);
  useEffect(() => {
    onTotalPages(totalPages);
  }, [filteredClinics.length, onTotalPages]);

  const startIdx = (currentPage - 1) * CLINICS_PER_PAGE;
  const paginatedClinics = filteredClinics.slice(startIdx, startIdx + CLINICS_PER_PAGE);

  if (loading) {
    return <div className="text-body-sm text-body-medium p-4">Loading clinics...</div>;
  }

  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="divide-table-header-bg w-full table-auto divide-y">
          <thead>
            <tr>
              {['Name', 'Address', 'Phone', 'Website', 'Rating'].map((label) => (
                <th
                  key={label}
                  className={`text-table-header text-heading-2 px-3 py-[14px] ${
                    label === 'Website' || label === 'Rating' ? 'text-center' : 'text-left'
                  } first:pl-4 last:pr-4 sm:first:pl-0`}
                >
                  {label}
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
                  className="text-table-cell cursor-pointer py-4 pr-3 pl-4 font-sans text-xs font-medium whitespace-nowrap hover:text-blue-600 sm:pl-0"
                >
                  {clinic.clinic_name}
                </td>
                <td className="text-table-cell py-4 pr-3 pl-4 font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.street_address}
                </td>
                <td className="text-table-cell py-4 pr-3 pl-4 font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.phone_number}
                </td>
                <td className="text-table-cell text-center font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.website ? (
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center text-blue-600 hover:underline"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">Visit website</span>
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="text-table-cell text-center font-sans text-xs font-medium whitespace-nowrap">
                  {clinic.rating ? clinic.rating.toFixed(1) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 sm:hidden">
        {paginatedClinics.map((clinic) => (
          <div
            key={clinic.clinic_id}
            className="hover:cursor-poin rounded-lg border border-slate-200 bg-white p-4 shadow-xs"
            onClick={() => onSelectClinic(clinic)}
          >
            <p className="mb-2 font-sans text-sm font-semibold text-slate-900">
              {clinic.clinic_name}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-900">
              <span>Rating: {clinic.rating ? clinic.rating.toFixed(1) : '—'}</span>
              {clinic.website ? (
                <a
                  href={clinic.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <ArrowTopRightOnSquareIcon className="h-6 w-6" aria-hidden="true" />
                </a>
              ) : (
                <span>—</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredClinics.length === 0 && (
        <div className="text-table-cell py-4 pr-3 pl-4 font-sans text-xs font-medium whitespace-nowrap">
          No clinics found for that service.
        </div>
      )}
    </div>
  );
}
