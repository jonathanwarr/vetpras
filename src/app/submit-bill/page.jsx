'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { submitBill } from '@/content/submit-bill';
import InputClinic from '@/components/forms/input-clinic';
import SelectService from '@/components/forms/select-service';
import InputPrice from '@/components/forms/input-price';
import UploadReceipt from '@/components/forms/upload-image';
import SubmissionNotes from '@/components/forms/submission-notes';
import ButtonPrimary from '@/components/ui/button-primary';
import FormError from '@/components/forms/form-error';
import ModalSuccess from '@/components/ui/modal-success';
import ServiceNavigation from '@/components/sections/service-navigation';
import ContainerNarrow from '@/components/layout/container-narrow';
import InputDate from '@/components/forms/input-date';

export default function SubmitBillPage() {
  const [clinicId, setClinicId] = useState('');
  const [serviceCodes, setServiceCodes] = useState([]);
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [dateOfService, setDateOfService] = useState('');

  const [services, setServices] = useState([]);
  const [clinics, setClinics] = useState([]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  useEffect(() => {
    if (success) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [success]);

  useEffect(() => {
    const fetchClinics = async () => {
      const { data } = await supabase.from('clinics').select('clinic_id, clinic_name');
      setClinics(data || []);
    };
    fetchClinics();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('id, service, service_code, parent_code')
        .order('sort_order');
      setServices(data || []);
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const missing = [];
    if (!clinicId) missing.push('Clinic Name');
    if (!serviceCodes.length) missing.push('At least one Service');
    if (!price.trim()) missing.push('Price');
    if (!file) missing.push('Receipt');
    if (!dateOfService) missing.push('Date of Service');

    if (missing.length > 0) {
      setMissingFields(missing);
      setError('Please fill out all required fields.');
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

    // 📦 Build payload separately
    const payload = {
      clinic_id: clinicId,
      service_codes: serviceCodes,
      price: parseFloat(price),
      image_url: fileData.path, // safe because we checked it exists
      notes,
      submitted_at: new Date().toISOString(),
      date_of_service: dateOfService,
      status: 'pending',
    };

    // 🧠 Log payload for confirmation
    console.log('[📦 DEBUG] Insert Payload:', payload);

    if (!fileData?.path || typeof fileData.path !== 'string') {
      console.error('[🚫 BAD IMAGE PATH] Possibly unsupported file type or encoding.', fileData);
      setError('Unsupported image format. Try a JPG or PDF instead.');
      setLoading(false);
      return;
    }

    // 📤 Insert into Supabase
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
      setSuccess(true);
      setClinicId('');
      setServiceCodes([]);
      setPrice('');
      setNotes('');
      setFile(null);
      setDateOfService('');
    }

    setLoading(false);
  };

  return (
    <section className="px-6 py-24 sm:px-10 md:px-16">
      <ContainerNarrow className="mt-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-widest uppercase">
          Submit a Bill
        </p>
        <p className={submitBill.introClass}>{submitBill.intro}</p>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <ServiceNavigation
              services={services}
              onSelect={(code) => {
                if (!serviceCodes.includes(code)) {
                  setServiceCodes((prev) => [...prev, code]);
                }
              }}
            />{' '}
          </div>

          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputClinic value={clinicId} onChange={setClinicId} clinics={clinics} />
              <SelectService values={serviceCodes} onChange={setServiceCodes} services={services} />
              <InputPrice value={price} onChange={setPrice} />
              <InputDate value={dateOfService} onChange={setDateOfService} />
              <SubmissionNotes value={notes} onChange={setNotes} />
              <UploadReceipt file={file} setFile={setFile} />

              {error && missingFields.length > 0 && (
                <FormError
                  message="Please complete the following before submitting:"
                  missingFields={missingFields}
                />
              )}

              <ButtonPrimary type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </ButtonPrimary>
            </form>

            <ModalSuccess
              isOpen={success}
              onClose={() => setSuccess(false)}
              title="Thank you!"
              message="Your submission was received and will be reviewed shortly."
            />
          </div>
        </div>
      </ContainerNarrow>
    </section>
  );
}
