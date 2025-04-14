'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import UploadReceipt from './upload-receipt'; // Reuse this for image proof

// Category options – should match your workflow exactly
const CATEGORY_OPTIONS = [
  'Add Service to Clinic',
  'Add Service to Vetpras',
  'Add Clinic to Vetpras',
  'Update Clinic Details in Vetpras',
  'Vetpras Application Feedback',
];

export default function FormFeedback() {
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Dynamically update a specific field inside formData
  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    let imagePath = null;

    // Upload optional image (if file was added)
    if (file) {
      const filename = `${Date.now()}_${file.name}`;
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
        status: 'submission-complete',
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
      {/* 1. Category Dropdown */}
      <div>
        <label className="text-sm font-medium">Feedback Type</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* 2. Dynamic Fields */}
      {category === 'Add Service to Clinic' && (
        <>
          <input
            type="text"
            placeholder="Clinic Name"
            className="input"
            onChange={(e) => updateField('clinic_name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Select Service"
            className="input"
            onChange={(e) => updateField('service_name', e.target.value)}
          />
          <UploadReceipt file={file} setFile={setFile} />
        </>
      )}

      {category === 'Add Service to Vetpras' && (
        <>
          <input
            type="text"
            placeholder="New Service Name"
            className="input"
            onChange={(e) => updateField('new_service', e.target.value)}
          />
          <UploadReceipt file={file} setFile={setFile} />
        </>
      )}

      {category === 'Add Clinic to Vetpras' && (
        <>
          <input
            type="text"
            placeholder="Clinic Name"
            className="input"
            onChange={(e) => updateField('clinic_name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Clinic Website (optional)"
            className="input"
            onChange={(e) => updateField('website', e.target.value)}
          />
        </>
      )}

      {category === 'Update Clinic Details in Vetpras' && (
        <>
          <input
            type="text"
            placeholder="Clinic Name"
            className="input"
            onChange={(e) => updateField('clinic_name', e.target.value)}
          />
          <textarea
            placeholder="Describe what to update (address, phone, etc)"
            className="input"
            onChange={(e) => updateField('update_notes', e.target.value)}
          />
        </>
      )}

      {category === 'Vetpras Application Feedback' && (
        <>
          <select className="input" onChange={(e) => updateField('feedback_type', e.target.value)}>
            <option value="">Select Feedback Type</option>
            <option>Bug</option>
            <option>Suggestion</option>
          </select>
          <textarea
            placeholder="Describe your feedback"
            className="input"
            onChange={(e) => updateField('feedback_details', e.target.value)}
          />
          <UploadReceipt file={file} setFile={setFile} />
        </>
      )}

      {/* Optional top-level message */}
      <textarea
        placeholder="Additional comments (optional)"
        className="input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Errors or success */}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {submitted && <div className="text-sm text-green-600">Thanks! We got your submission.</div>}

      <button
        type="submit"
        disabled={submitting || !category}
        className="rounded bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
