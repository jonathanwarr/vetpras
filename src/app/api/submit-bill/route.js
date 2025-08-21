export const runtime = 'nodejs';

import { createClient } from '@supabase/supabase-js';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return json(
      { error: { message: 'Server configuration error: missing Supabase env vars' } },
      500
    );
  }

  const supabase = createClient(url, serviceKey);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: { message: 'Invalid JSON body' } }, 400);
  }

  const image_url = typeof body?.image_url === 'string' ? body.image_url.trim() : '';
  if (image_url.length < 5) {
    return json({ error: { message: 'image_url is required' } }, 400);
  }

  const notes = String(body?.notes ?? '')
    .trim()
    .slice(0, 800)
    .replace(/<[^>]*>/g, '');
  const submission_date = new Date(
    body?.submission_date && !Number.isNaN(new Date(body.submission_date))
      ? body.submission_date
      : Date.now()
  ).toISOString();

  const payload = { image_url, notes, submission_date };

  const { error } = await supabase.from('pending_bills').insert([payload]);
  if (error) {
    return json(
      {
        error: {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        },
      },
      400
    );
  }

  return json({ ok: true }, 200);
}
