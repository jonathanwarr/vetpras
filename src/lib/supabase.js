import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Export a ready client (most of your code likely imports { supabase })
export const supabase = createClient(url ?? '', anon ?? '')

// Also export a getter that throws with a clear message if envs are missing
export function getSupabase() {
  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return supabase
}

export default supabase
