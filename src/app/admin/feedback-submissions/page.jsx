'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ContainerConstrained from '@/components/layout/container-constrained';
import Pagination from '@/components/clinics/pagination';
import { logger } from '@/lib/utils/logger';

export default function AdminFeedbackSubmissions() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  const [feedback, setFeedback] = useState([]);
  const [markedReviewed, setMarkedReviewed] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // 🔐 Load session manually and check admin
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const currentSession = data?.session;
      setSession(currentSession);
      setReady(true);

      if (!currentSession) {
        logger.log('❌ No session, redirecting to login');
        router.replace('/admin/login');
        return;
      }

      const user = currentSession.user;
      logger.log('👤 Logged in as:', user?.email);
      const isAdmin =
        user?.email === 'jonathan.e.g.warr@gmail.com' || user?.email === 'negamiri@gmail.com';

      logger.log('🛡 isAdmin:', isAdmin);
      if (!isAdmin) {
        logger.log('🚫 Not admin, redirecting to /');
        router.replace('/');
      }
    };

    checkSession();
  }, [router]);

  // 🔄 Fetch feedback once session is ready
  useEffect(() => {
    if (!ready || !session) return;

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

    fetchFeedback();
    const stored = localStorage.getItem('feedbackReviewed');
    setMarkedReviewed(stored ? JSON.parse(stored) : []);
  }, [ready, session]);

  const handleMarkReviewed = (id) => {
    const updated = [...markedReviewed, id];
    setMarkedReviewed(updated);
    localStorage.setItem('feedbackReviewed', JSON.stringify(updated));
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();
  const totalPages = Math.ceil(feedback.length / perPage);
  const currentPageData = feedback.slice((page - 1) * perPage, page * perPage);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-20">
        <p className="text-sm text-gray-500">Loading page...</p>
      </main>
    );
  }

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
                {isReviewed && (
                  <div className="mb-2 rounded bg-green-50 px-2 py-1 text-xs text-green-700">
                    ✅ Reviewed
                  </div>
                )}

                <div className="mb-1 flex flex-wrap items-start justify-between">
                  <p className="text-xs font-medium text-gray-700">
                    <strong>Category:</strong>{' '}
                    <span className="text-gray-600">{item.category}</span>
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(item.submitted_at)}</p>
                </div>

                <p className="mb-2 text-xs text-gray-700">
                  <strong>Message:</strong> {item.message || '—'}
                </p>

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
