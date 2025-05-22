'use client';

import { useState, useEffect } from 'react';
import ContainerConstrained from '@/components/layout/container-constrained';
import UploadReceipt from '@/components/forms/upload-image';
import ButtonPrimary from '@/components/ui/button-primary';
import FormError from '@/components/forms/form-error';
import ModalSuccess from '@/components/ui/modal-success';
import SubmissionNotes from '@/components/forms/submission-notes';
import DisclaimerBill from '@/components/forms/disclaimer-bill';
import { supabase } from '@/lib/supabase';

export default function CTASection() {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    if (success) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const missing = [];
    if (!file) missing.push('Receipt');

    if (missing.length > 0) {
      setMissingFields(missing);
      setError('Please attach a receipt before submitting.');
      return;
    }

    setLoading(true);
    setMissingFields([]);

    // Clean the filename
    const sanitizedFilename = file.name.replace(/[^\w.-]/g, '_');
    const filename = `${Date.now()}_${sanitizedFilename}`;

    const { data: fileData, error: fileError } = await supabase.storage
      .from('receipts')
      .upload(filename, file);

    console.log('[📂 Upload Response]', { fileData, fileError });

    if (fileError || !fileData?.path || typeof fileData.path !== 'string') {
      console.error('[🚫 BAD IMAGE PATH] Possibly unsupported file type or encoding.', fileData);
      setError(
        'Something went wrong with the uploaded image. Try a JPG or PDF if this keeps happening.'
      );
      setLoading(false);
      return;
    }

    const payload = {
      clinic_id: null, // Will be null for simplified submissions
      service_codes: [], // Will be empty for simplified submissions
      price: null, // Will be null for simplified submissions
      image_url: fileData.path,
      notes: notes || 'Simplified submission from CTA section',
      submitted_at: new Date().toISOString(),
      date_of_service: null, // Will be null for simplified submissions
      status: 'pending',
    };

    console.log('[📦 DEBUG] Insert Payload:', payload);

    const {
      data: insertData,
      error: insertError,
      status,
      statusText,
    } = await supabase.from('bill_submissions_pending').insert([payload]);

    if (insertError) {
      console.error('[🧾 Supabase Error]', insertError.message || insertError);
      console.error('[📉 Status]', status, statusText);
      console.error('[🧾 Full Insert Error]', insertError);
      setError('Submission failed. Please try again.');
    } else {
      console.log('[✅ DEBUG] Submission inserted successfully:', insertData);

      // Fire Google Analytics event - Bill Submitted
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'submit_bill', {
          event_category: 'engagement',
          event_label: 'Bill Submission - CTA',
          value: 1,
        });
      }

      // Fire Hotjar custom event - Bill Submitted
      if (typeof window.hj === 'function') {
        window.hj('event', 'bill_submitted_cta');
      }

      setSuccess(true);
      setFile(null);
      setNotes('');
    }

    setLoading(false);
  };

  return (
    <section className="bg-blue-50 py-20 sm:py-28">
      <ContainerConstrained className="text-left">
        <h2 className="mb-6 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-balance">
          Help Make Pet Care Accessible
        </h2>
        <div className="mb-6 space-y-5">
          <p className="text-sans text-md font-light text-slate-900">
            Pet care accessibility comes down to three simple questions: Is there a clinic nearby?
            Do they offer the service my pet needs? Can I afford it?
            <br />
            <br />
            While we can help you find nearby clinics and their services, understanding costs
            requires community support. By sharing your veterinary bills, you help fellow pet owners
            answer that critical third question and make informed decisions about their pet's care.
          </p>
          <div className="flex flex-col gap-4 text-xs font-bold text-red-500">
            Please review your receipt before submitting and cover any sensitive information.
          </div>
        </div>

        <div className="max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <SubmissionNotes value={notes} onChange={setNotes} />
            <UploadReceipt file={file} setFile={setFile} />
            {error && missingFields.length > 0 && (
              <FormError
                message="Please complete the following before submitting:"
                missingFields={missingFields}
              />
            )}

            <ButtonPrimary type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Bill'}
            </ButtonPrimary>
          </form>
        </div>

        <ModalSuccess
          isOpen={success}
          onClose={() => setSuccess(false)}
          title="Thank you!"
          message="Your submission was received and will be reviewed shortly."
        />
      </ContainerConstrained>
    </section>
  );
}
