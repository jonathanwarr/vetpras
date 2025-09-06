'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/is-admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const session = useSession();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // 🚀 If user is already logged in and admin, send them to the dashboard
  useEffect(() => {
    const user = session?.user;
    const isAdminUser = isAdmin(user);

    if (session && isAdminUser) {
      router.push('/admin/dashboard');
    }
  }, [session, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitted(false);

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-20">
      <div className="w-full max-w-md rounded-xl border border-gray-200 p-6 shadow-lg">
        <h1 className="mb-4 text-center text-xl font-semibold">Vetpras Admin Login</h1>

        {submitted ? (
          <p className="text-sm text-green-700">
            A login link has been sent to <strong>{email}</strong>. Please check your email.
          </p>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
            >
              Send Magic Link
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
