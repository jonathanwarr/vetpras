'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleMagicLinkRedirect = async () => {
      const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });

      if (error) {
        console.error('Supabase callback error:', error.message);
        return;
      }

      // ✅ Redirect after session is saved
      router.push('/admin/dashboard');
    };

    handleMagicLinkRedirect();
  }, [router]);

  return (
    <main className="flex h-screen items-center justify-center bg-white">
      <p className="text-sm text-gray-600">Finalizing login...</p>
    </main>
  );
}
