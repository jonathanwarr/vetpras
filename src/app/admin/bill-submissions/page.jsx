'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Pagination from '@/components/clinics/pagination';

export default function AdminBillSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [services, setServices] = useState([]);
  const [markedIds, setMarkedIds] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // 🔄 Fetch all required data
  const fetchSubmissions = async () => {
    const [
      { data: pendingData, error: pendingError },
      { data: clinicData, error: clinicError },
      { data: serviceData, error: serviceError },
    ] = await Promise.all([
      supabase
        .from('bill_submissions_pending')
        .select('*')
        .order('submitted_at', { ascending: false }),
      supabase.from('clinics').select('clinic_id, clinic_name'),
      supabase.from('services').select('service_code, service'),
    ]);

    if (!pendingError) setSubmissions(pendingData || []);
    else console.error('[🔥 ERROR] Fetching bills:', pendingError);

    if (!clinicError) setClinics(clinicData || []);
    else console.error('[🔥 ERROR] Fetching clinics:', clinicError);

    if (!serviceError) setServices(serviceData || []);
    else console.error('[🔥 ERROR] Fetching services:', serviceError);
  };

  // 🌱 On load: fetch data and restore marked IDs from localStorage
  useEffect(() => {
    fetchSubmissions();
    const saved = localStorage.getItem('markedAdded');
    setMarkedIds(saved ? JSON.parse(saved) : []);
  }, []);

  const getClinicName = (id) => {
    const match = clinics.find((c) => c.clinic_id === id);
    return match ? match.clinic_name : id;
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  // ✅ Update local state + localStorage only
  const handleMarkAsAdded = (id) => {
    const updated = [...markedIds, id];
    setMarkedIds(updated);
    localStorage.setItem('markedAdded', JSON.stringify(updated));
  };

  // 🔢 Pagination logic
  const totalPages = Math.ceil(submissions.length / perPage);
  const currentPageData = submissions.slice((page - 1) * perPage, page * perPage);

  return (
    <ContainerConstrained className="pt-[200px]">
      <h1 className="text-h2 font-playfair text-heading-1 mb-4">Pending Bill Submissions</h1>

      {currentPageData.length === 0 ? (
        <p className="text-sm text-gray-500">No pending submissions found.</p>
      ) : (
        <div className="space-y-6">
          {currentPageData.map((sub) => {
            const isMarked = markedIds.includes(sub.id);

            return (
              <div
                key={sub.id}
                className="rounded-md border border-gray-200 bg-white p-4 shadow-sm"
              >
                {/* ✅ Local-only marked indicator */}
                {isMarked && (
                  <div className="mb-2 rounded bg-green-50 px-2 py-1 text-xs text-green-700">
                    ✅ Marked as Added
                  </div>
                )}

                {/* Header: Clinic + Date */}
                <div className="mb-1 flex flex-wrap items-start justify-between">
                  <p className="text-xs font-medium text-gray-700">
                    <strong>Clinic:</strong>{' '}
                    <span className="text-gray-600">{getClinicName(sub.clinic_id)}</span>
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(sub.submitted_at)}</p>
                </div>

                <p className="mb-1 text-xs text-gray-700">
                  <strong>Price:</strong> ${sub.price}
                </p>

                <p className="mb-1 text-xs text-gray-700">
                  <strong>Notes:</strong> {sub.notes || '—'}
                </p>

                <p className="mb-1 text-xs text-gray-700">
                  <strong>Date of Service:</strong>{' '}
                  {sub.date_of_service ? formatDate(sub.date_of_service) : '—'}
                </p>

                <div className="mb-2 text-xs text-gray-700">
                  <strong>Services:</strong>{' '}
                  {Array.isArray(sub.service_codes) && sub.service_codes.length > 0 ? (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {sub.service_codes.map((code) => {
                        const label =
                          services.find((s) => s.service_code === code)?.service || code;
                        return (
                          <span
                            key={code}
                            className="inline-block rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800"
                          >
                            {label}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">—</span>
                  )}
                </div>

                {/* 🔗 View Receipt */}
                {sub.image_url ? (
                  <div className="mb-2">
                    <a
                      href={`https://nerlrwamwlhnkacxredz.supabase.co/storage/v1/object/public/receipts/${sub.image_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 underline"
                    >
                      View Receipt
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">No receipt uploaded</p>
                )}

                {/* ✅ Local button (only if not already marked) */}
                {!isMarked && (
                  <button
                    onClick={() => handleMarkAsAdded(sub.id)}
                    className="mt-2 inline-block rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                  >
                    Mark as Added
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </ContainerConstrained>
  );
}
