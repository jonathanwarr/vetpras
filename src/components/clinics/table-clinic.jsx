'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const CLINICS_PER_PAGE = 14;

export default function TableClinic({ onSelectClinic, searchQuery }) {
  const [clinics, setClinics] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  // 🔍 Enhanced: Match query and collect both direct and child service codes
  const matchingServiceCodes = (() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    // Services that match the text directly (name contains the query)
    const matchedServices = services.filter((s) => s.service.toLowerCase().includes(query));

    // Include sub-services if a parent category is matched
    const parentCodes = matchedServices
      .filter((s) => s.parent_code === null)
      .map((s) => s.service_code);

    const childCodes = services
      .filter((s) => parentCodes.includes(s.parent_code))
      .map((s) => s.service_code);

    // Final result: direct matches + children of matched categories
    const allCodes = new Set([...matchedServices.map((s) => s.service_code), ...childCodes]);

    return Array.from(allCodes); // keep full code like 1.0, 2.1, etc
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

  const totalPages = Math.ceil(filteredClinics.length / CLINICS_PER_PAGE);
  const startIdx = (currentPage - 1) * CLINICS_PER_PAGE;
  const paginatedClinics = filteredClinics.slice(startIdx, startIdx + CLINICS_PER_PAGE);

  if (loading) {
    return <div className="text-body-sm text-body-medium p-4">Loading clinics...</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="divide-table-header-bg w-full table-auto divide-y">
        <thead>
          <tr>
            {['Name', 'Address', 'Phone', 'Website', 'Rating'].map((label) => (
              <th
                key={label}
                className="text-table-header text-heading-2 px-3 py-[14px] text-left first:pl-4 last:pr-4 sm:first:pl-0"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-table-header-bg divide-y">
          {paginatedClinics.map((clinic) => (
            <tr key={clinic.clinic_id}>
              <td
                onClick={() => onSelectClinic(clinic)}
                className="text-table-cell cursor-pointer py-4 pr-3 pl-4 text-xs font-medium whitespace-nowrap hover:underline sm:pl-0"
              >
                {clinic.clinic_name}
              </td>
              <td className="text-table-cell px-3 py-4 text-xs whitespace-nowrap">
                {clinic.street_address}
              </td>
              <td className="text-table-cell px-3 py-4 text-xs whitespace-nowrap">
                {clinic.phone_number}
              </td>
              <td className="text-table-cell max-w-[200px] truncate px-3 py-4 text-xs">
                {clinic.website ? (
                  <a
                    href={clinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {clinic.website}
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td className="text-table-cell px-3 py-4 text-xs whitespace-nowrap">
                {clinic.rating ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredClinics.length === 0 && (
        <div className="text-body-sm text-body-medium mt-6 text-center">
          No clinics found for that service.
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-table-row-even hover:bg-table-row-odd text-body-sm rounded px-3 py-1"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`text-body-sm rounded px-3 py-1 ${
                currentPage === i + 1
                  ? 'bg-button-primary-bg text-button-primary-text'
                  : 'bg-table-row-even hover:bg-table-row-odd'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-table-row-even hover:bg-table-row-odd text-body-sm rounded px-3 py-1"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
