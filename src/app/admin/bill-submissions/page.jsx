'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch submissions, clinics, and services on load
  useEffect(() => {
    const fetchAll = async () => {
      const [submissionsRes, clinicsRes, servicesRes] = await Promise.all([
        supabase.from('bill_submissions_pending').select('*'),
        supabase.from('clinics').select('clinic_id, clinic_name'),
        supabase.from('services').select('service_code, service'),
      ]);

      if (submissionsRes.error) {
        console.error('[Admin] Failed to load submissions:', submissionsRes.error);
      } else {
        setSubmissions(submissionsRes.data);
      }

      if (clinicsRes.error) {
        console.error('[Admin] Failed to load clinics:', clinicsRes.error);
      } else {
        setClinics(clinicsRes.data);
      }

      if (servicesRes.error) {
        console.error('[Admin] Failed to load services:', servicesRes.error);
      } else {
        setServices(servicesRes.data);
      }

      setLoading(false);
    };

    fetchAll();
  }, []);

  // ✅ Move record into bill_submissions, then remove from pending
  const handleApprove = async (submission) => {
    const { error: insertError } = await supabase.from('bill_submissions').insert([
      {
        clinic_id: submission.clinic_id,
        service_code: submission.service_code,
        price: submission.price,
        image_url: submission.image_url,
        notes: submission.notes,
        submitted_at: submission.submitted_at,
        status: 'approved',
        approved_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error('[Admin] Approval insert error:', insertError);
      return;
    }

    const { error: deleteError } = await supabase
      .from('bill_submissions_pending')
      .delete()
      .eq('id', submission.id);

    if (deleteError) {
      console.error('[Admin] Approval delete error:', deleteError);
      return;
    }

    setSubmissions((prev) => prev.filter((s) => s.id !== submission.id));
  };

  // ❌ Remove record from pending
  const handleReject = async (id) => {
    const { error } = await supabase.from('bill_submissions_pending').delete().eq('id', id);

    if (error) {
      console.error('[Admin] Rejection error:', error);
      return;
    }

    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  // 🧠 Lookup helper: clinic name from ID
  const getClinicName = (id) =>
    clinics.find((c) => c.clinic_id === id)?.clinic_name || `Clinic ${id}`;

  // 🧠 Lookup helper: service name from code
  const getServiceName = (code) =>
    services.find((s) => s.service_code === code)?.service || `Service ${code}`;

  if (loading) return <p className="p-4 text-sm">Loading submissions...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-xl font-semibold">Admin: Review Submissions</h1>

      {submissions.length === 0 ? (
        <p className="text-sm text-gray-500">No pending submissions.</p>
      ) : (
        <ul className="space-y-6">
          {submissions.map((s) => (
            <li key={s.id} className="rounded border p-4 shadow-sm">
              <p>
                <strong>Clinic:</strong> {getClinicName(s.clinic_id)}
              </p>
              <p>
                <strong>Service:</strong> {getServiceName(s.service_code)}
              </p>
              <p>
                <strong>Price:</strong> ${s.price}
              </p>
              <p>
                <strong>Notes:</strong> {s.notes || '—'}
              </p>
              <p>
                <strong>Submitted At:</strong> {new Date(s.submitted_at).toLocaleString()}
              </p>
              <div className="mt-3">
                <a
                  href={`https://nerlrwamwlhnkacxredz.supabase.co/storage/v1/object/public/receipts/${s.image_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Receipt Image
                </a>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleApprove(s)}
                  className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(s.id)}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
