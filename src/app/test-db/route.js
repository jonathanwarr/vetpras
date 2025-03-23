import { supabase } from '@/lib/supabase-client'

export async function GET() {
  const { data, error } = await supabase
    .from('clinics')
    .select('*')
    .limit(1)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  })
}
