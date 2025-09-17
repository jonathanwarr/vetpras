'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/is-admin';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('❌ Error loading session:', error.message);
      } else {
        setSession(data.session);
        setReady(true);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (!session) {
      console.log('❌ No session, redirecting to login');
      router.replace('/admin/login');
      return;
    }

    const user = session.user;
    console.log('👤 Logged in as:', user?.email);

    const isAdminUser = isAdmin(user);

    console.log('🛡 isAdmin:', isAdminUser);

    if (!isAdminUser) {
      console.log('🚫 Not admin, redirecting to /');
      router.replace('/');
    }
  }, [ready, session, router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-20">
        <p className="text-sm text-gray-500">Loading admin dashboard...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-20">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-center text-xl font-semibold">Vetpras Admin Dashboard</h1>
        <div className="space-y-4">
          <a
            href="/admin/bill-submissions"
            className="block w-full rounded-md bg-indigo-600 px-4 py-2 text-center font-medium text-white hover:bg-indigo-500"
          >
            🧾 View Bill Submissions
          </a>
          <a
            href="/admin/feedback-submissions"
            className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-500"
          >
            💬 View Feedback Submissions
          </a>
        </div>
      </div>
    </main>
  );
}
