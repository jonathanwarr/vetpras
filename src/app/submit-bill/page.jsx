'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import InputClinic from '@/components/forms/input-clinic';
import SelectService from '@/components/forms/select-service';
import InputPrice from '@/components/forms/input-price';
import UploadReceipt from '@/components/forms/upload-receipt';
import SubmissionNotes from '@/components/forms/submission-notes';
import ButtonPrimary from '@/components/ui/button-primary';
import FormError from '@/components/forms/form-error';
import ModalSuccess from '@/components/ui/modal-success';
import ServiceNavigation from '@/components/sections/service-navigation';

export default function SubmitBillPage() {
  // Form input state
  const [clinicId, setClinicId] = useState('');
  const [serviceCode, setServiceCode] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);

  // Dropdown options
  const [services, setServices] = useState([]);
  const [clinics, setClinics] = useState([]);

  // UI state
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);

  // Scroll to top when modal is shown
  useEffect(() => {
    if (success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [success]);

  // Fetch clinics on load
  useEffect(() => {
    const fetchClinics = async () => {
      const { data, error } = await supabase.from('clinics').select('clinic_id, clinic_name');
      if (error) console.error('Error fetching clinics:', error);
      else setClinics(data);
    };
    fetchClinics();
  }, []);

  // Fetch services on load
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, service, service_code, parent_code');
      if (error) console.error('Error fetching services:', error);
      else setServices(data);
    };
    fetchServices();
  }, []);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation check
    const missing = [];
    if (!clinicId) missing.push('Clinic Name');
    if (!serviceCode) missing.push('Service');
    if (!price.trim()) missing.push('Price');
    if (!file) missing.push('Receipt');

    if (missing.length > 0) {
      setMissingFields(missing);
      setError('Please fill out all required fields.');
      return;
    }

    setMissingFields([]);
    setLoading(true);

    // Upload receipt file
    const filename = `${Date.now()}_${file.name}`;
    const { data: fileData, error: fileError } = await supabase.storage
      .from('receipts')
      .upload(filename, file);

    if (fileError || !fileData?.path) {
      console.error('[📤 Upload Error]', fileError);
      setError('File upload failed. Please try again.');
      setLoading(false);
      return;
    }

    // Insert into pending table for admin review
    const { error: submitError } = await supabase.from('bill_submissions_pending').insert([
      {
        clinic_id: clinicId,
        service_code: serviceCode,
        price: parseFloat(price),
        image_url: fileData.path,
        notes,
        submitted_at: new Date().toISOString(),
        status: 'pending',
      },
    ]);

    if (submitError) {
      console.error('[🧾 DEBUG] Submission Insert Error:', submitError);
      setError('Submission failed. Please try again.');
    } else {
      console.log('✅ Submission succeeded – showing modal');
      setSuccess(true);
      setClinicId('');
      setServiceCode('');
      setPrice('');
      setNotes('');
      setFile(null);
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-h2 font-playfair text-heading-1 mb-4">Submit a Vet Bill</h1>

      <p className="mb-6 text-sm text-gray-700">
        Use the left-hand menu or start typing to find your service. If you don’t see your exact
        service listed, select the general category and describe the specific service in the comment
        section. We’ll look into adding it!
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <ServiceNavigation services={services} onSelect={(code) => setServiceCode(code)} />
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputClinic value={clinicId} onChange={setClinicId} clinics={clinics} />
            <SelectService value={serviceCode} onChange={setServiceCode} services={services} />
            <InputPrice value={price} onChange={setPrice} />
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
    </div>
  );
}
