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
    const fetchData = async () => {
      setLoading(true);
      const [{ data: clinicData }, { data: serviceData }] = await Promise.all([
        supabase.from('clinics').select('*'),
        supabase
          .from('services')
          .select('service, service_code, parent_code, sort_order')
          .order('sort_order', { ascending: true }),
      ]);
      setClinics(clinicData || []);
      setServices(serviceData || []);
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
    const matched = services.filter((s) => s.service.toLowerCase().includes(query));
    const parentCodes = matched.filter((s) => s.parent_code === null).map((s) => s.service_code);
    const childCodes = services
      .filter((s) => parentCodes.includes(s.parent_code))
      .map((s) => s.service_code);
    return [...new Set([...matched.map((s) => s.service_code), ...childCodes])];
  })();

  const filteredClinics = searchQuery
    ? clinics.filter((clinic) => {
        const codes = Array.isArray(clinic.service_codes)
          ? clinic.service_codes
          : (clinic.service_codes || '').split(',').map((c) => c.trim());
        return matchingServiceCodes.some((code) => codes.includes(code));
      })
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
      <div className="hidden overflow-x-auto sm:block">
        <table className="divide-table-header-bg w-full table-fixed divide-y">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('clinic_name')}
                className="text-table-header text-heading-2 w-68 cursor-pointer px-3 py-[14px] text-left select-none first:pl-4 sm:w-76 sm:first:pl-0"
              >
                Name{' '}
                <span className="ml-1 inline-block text-sm">{renderSortIcon('clinic_name')}</span>
              </th>
              <th
                onClick={() => handleSort('city')}
                className="text-table-header text-heading-2 w-32 cursor-pointer px-3 py-[14px] text-left select-none"
              >
                City <span className="ml-1 inline-block text-sm">{renderSortIcon('city')}</span>
              </th>
              <th className="text-table-header text-heading-2 w-32 px-3 py-[14px] text-left">
                Phone
              </th>
              <th
                onClick={() => handleSort('exam_fee')}
                className="text-table-header text-heading-2 w-20 cursor-pointer px-3 py-[14px] text-center select-none"
              >
                Exam Fee{' '}
                <span className="ml-1 inline-block text-sm">{renderSortIcon('exam_fee')}</span>
              </th>
              <th
                onClick={() => handleSort('rating')}
                className="text-table-header text-heading-2 w-20 cursor-pointer px-3 py-[14px] text-center select-none"
              >
                Rating <span className="ml-1 inline-block text-sm">{renderSortIcon('rating')}</span>
              </th>
              <th className="text-table-header text-heading-2 w-20 px-3 py-[14px] text-center">
                Website
              </th>
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
    </div>
  );
}
