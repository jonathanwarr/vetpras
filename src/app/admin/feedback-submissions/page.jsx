'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FeedbackSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all feedback_submissions from Supabase
  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('[Supabase] Feedback fetch error:', error);
      } else {
        setSubmissions(data);
        console.log('🔎 Loaded feedback submissions:', data);
      }

      setLoading(false);
    };

    fetchFeedback();
  }, []);

  // Update status when changed in dropdown
  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('feedback_submissions')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      return;
    }

    // Optimistically update UI
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  if (loading) return <div className="p-4 text-sm text-gray-600">Loading feedback...</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-h2 font-playfair text-heading-1 mb-6">Admin: Feedback Submissions</h1>

      {submissions.length === 0 ? (
        <p className="text-sm text-gray-500">No submissions found.</p>
      ) : (
        <div className="space-y-6">
          {submissions.map((item) => (
            <div key={item.id} className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-indigo-700">{item.category}</span>
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {item.email && (
                <p className="mb-1 text-xs text-gray-600">
                  <strong>Email:</strong> {item.email}
                </p>
              )}

              {item.message && (
                <p className="mb-2 text-sm text-gray-800">
                  <strong>Message:</strong> {item.message}
                </p>
              )}

              {item.context_data && (
                <div className="mt-2 rounded border bg-gray-50 p-2 text-xs whitespace-pre-wrap text-gray-700">
                  <strong>Context Data:</strong>
                  <pre className="mt-1 overflow-x-auto text-[11px]">
                    {JSON.stringify(item.context_data, null, 2)}
                  </pre>
                </div>
              )}

              <p className="mt-2 text-xs text-gray-400">
                Submitted: {new Date(item.submitted_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
