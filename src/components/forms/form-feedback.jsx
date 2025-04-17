'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import UploadReceipt from './upload-image';
import ButtonPrimary from '@/components/ui/button-primary';

export default function FormFeedback() {
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    let imagePath = null;

    if (file) {
      // 🧼 Clean the filename to remove unsafe characters
      const sanitizedFilename = file.name.replace(/[^\w.-]/g, '_');
      const filename = `${Date.now()}_${sanitizedFilename}`;
      const { data, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filename, file);
      if (uploadError) {
        setError('File upload failed');
        setSubmitting(false);
        return;
      }
      imagePath = data.path;
    }

    const { error: insertError } = await supabase.from('feedback_submissions').insert([
      {
        category,
        message,
        context_data: { ...formData, image_url: imagePath },
        submitted_at: new Date().toISOString(),
        status: 'pending',
      },
    ]);

    if (insertError) {
      setError('Something went wrong.');
      setSubmitting(false);
    } else {
      setSubmitted(true);
      setCategory('');
      setFormData({});
      setFile(null);
      setMessage('');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Feedback Type */}
      <div>
        <label className="text-sm font-medium text-gray-900">Feedback Type</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          <option value="Bug or Technical Issue">Bug or Technical Issue</option>
          <option value="Feature Request">Feature Request</option>
          <option value="Other Feedback">Other Feedback</option>
        </select>
      </div>

      {/* 2. Feedback Textarea */}
      <div>
        <label className="text-sm font-medium text-gray-900">
          Tell us what you’re experiencing
        </label>
        <textarea
          placeholder="Describe your issue or feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 block w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800"
          rows={6}
          maxLength={500}
        />
      </div>

      {/* 3. Attach Image */}
      <UploadReceipt file={file} setFile={setFile} />

      {/* 5. Error or Success Message */}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {submitted && <p className="text-sm text-green-600">Thanks! We got your submission.</p>}

      {/* 6. Submit */}
      <ButtonPrimary type="submit" disabled={submitting || !category}>
        {submitting ? 'Submitting...' : 'Submit'}
      </ButtonPrimary>
    </form>
  );
}
