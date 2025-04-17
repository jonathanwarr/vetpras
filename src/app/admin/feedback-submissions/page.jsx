'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Pagination from '@/components/clinics/pagination';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminFeedbackSubmissions() {
  const [feedback, setFeedback] = useState([]);
  const [markedReviewed, setMarkedReviewed] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // 🔄 Fetch feedback from Supabase
  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('[🔥 Supabase Error]', error.message);
    } else {
      setFeedback(data || []);
    }
  };

  useEffect(() => {
    fetchFeedback();
    const stored = localStorage.getItem('feedbackReviewed');
    setMarkedReviewed(stored ? JSON.parse(stored) : []);
  }, []);

  const handleMarkReviewed = (id) => {
    const updated = [...markedReviewed, id];
    setMarkedReviewed(updated);
    localStorage.setItem('feedbackReviewed', JSON.stringify(updated));
  };

  const totalPages = Math.ceil(feedback.length / perPage);
  const currentPageData = feedback.slice((page - 1) * perPage, page * perPage);

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  return (
    <ContainerConstrained className="pt-[200px]">
      <h1 className="text-h2 font-playfair text-heading-1 mb-4">Feedback Submissions</h1>

      {currentPageData.length === 0 ? (
        <p className="text-sm text-gray-500">No feedback submissions found.</p>
      ) : (
        <div className="space-y-6">
          {currentPageData.map((item) => {
            const isReviewed = markedReviewed.includes(item.id);

            return (
              <div
                key={item.id}
                className="rounded-md border border-gray-200 bg-white p-4 shadow-sm"
              >
                {/* ✅ Status badge */}
                {isReviewed && (
                  <div className="mb-2 rounded bg-green-50 px-2 py-1 text-xs text-green-700">
                    ✅ Reviewed
                  </div>
                )}

                {/* 🧠 Category and Date */}
                <div className="mb-1 flex flex-wrap items-start justify-between">
                  <p className="text-xs font-medium text-gray-700">
                    <strong>Category:</strong>{' '}
                    <span className="text-gray-600">{item.category}</span>
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(item.submitted_at)}</p>
                </div>

                {/* 💬 Message */}
                <p className="mb-2 text-xs text-gray-700">
                  <strong>Message:</strong> {item.message || '—'}
                </p>

                {/* 📎 Attached Image */}
                {item.context_data?.image_url ? (
                  <p className="mb-2 text-xs">
                    <a
                      href={`https://nerlrwamwlhnkacxredz.supabase.co/storage/v1/object/public/receipts/${item.context_data.image_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Attached Image
                    </a>
                  </p>
                ) : (
                  <p className="text-xs text-gray-400">No image uploaded</p>
                )}

                {/* ✅ Mark as Reviewed Button (local only) */}
                {!isReviewed && (
                  <button
                    onClick={() => handleMarkReviewed(item.id)}
                    className="mt-2 inline-block rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                  >
                    Mark as Reviewed
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
