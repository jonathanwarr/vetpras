'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SessionHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const search = window.location.search;

    // Combine both search and hash in case Supabase redirects with either
    const fullParams = new URLSearchParams(search || hash.substring(1));

    const access_token = fullParams.get('access_token');
    const refresh_token = fullParams.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          console.error('❌ setSession error:', error.message);
        } else {
          console.log('✅ Session saved to Supabase');
          router.replace('/admin/dashboard');
        }
      });
    }
  }, [router]);

  return null;
}
