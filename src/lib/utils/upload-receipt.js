// src/lib/utils/upload-receipt.js

import { supabase } from '@/lib/supabase'; // adjust if you renamed this

/**
 * Uploads a receipt or screenshot to Supabase storage and returns its public URL.
 * @param {File} file - The image file selected by the user.
 * @param {string} [folder='uploads'] - Optional folder path inside the bucket.
 * @returns {string|null} The public URL of the uploaded image, or null on error.
 */
export async function uploadReceiptImage(file, folder = 'uploads') {
  if (!file) return null;

  // Create a unique filename to avoid conflicts
  const timestamp = Date.now();
  const filePath = `${folder}/${timestamp}_${file.name}`;

  // Upload the file to Supabase Storage (bucket: receipts)
  const { error } = await supabase.storage.from('receipts').upload(filePath, file);

  if (error) {
    console.error('Upload failed:', error.message);
    return null;
  }

  // Get the public URL
  const { data } = supabase.storage.from('receipts').getPublicUrl(filePath);

  return data?.publicUrl || null;
}
