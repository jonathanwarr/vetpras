'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { submitBill } from '@/content/submit-bill';
import UploadReceipt from '@/components/forms/upload-image';
import SubmissionNotes from '@/components/forms/submission-notes';
import ButtonPrimary from '@/components/ui/button-primary';
import FormError from '@/components/forms/form-error';
import ModalSuccess from '@/components/ui/modal-success';
import ContainerNarrow from '@/components/layout/container-narrow';
import DisclaimerBill from '@/components/forms/disclaimer-bill';

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
    const fetchData = async () => {
      const [{ data: clinicData }, { data: serviceData }] = await Promise.all([
        supabase.from('vet_clinics').select('clinic_id, clinic_name'),
        supabase
          .from('vet_services')
          .select('service_id, service, service_code, parent_code')
          .order('sort_order'),
      ]);

      setClinics(clinicData || []);
      setServices(serviceData || []);
    };

    fetchData();
  }, []);

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

    const sanitizedFilename = file.name.replace(/[^\w.-]/g, '_');
    const filename = `${Date.now()}_${sanitizedFilename}`;

    const { data: fileData, error: fileError } = await supabase.storage
      .from('receipts')
      .upload(filename, file);

    if (fileError || !fileData?.path) {
      setError('Something went wrong with the uploaded image. Try a JPG or PDF.');
      setLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user?.id) {
      setError('Unable to confirm your login session. Please try logging in again.');
      setLoading(false);
      return;
    }

    const payload = {
      user_id: userData.user.id,
      clinic_id: clinicId,
      service_code: serviceCodes[0],
      price: parseFloat(price),
      image_url: fileData.path,
      notes,
      submission_date: new Date().toISOString(),
      service_date: dateOfService,
    };

    const { error: insertError } = await supabase.from('pending_bills').insert([payload]);

    if (insertError) {
      console.error('[Insert Error]', insertError);
      setError('Submission failed. Please try again.');
    } else {
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
    <section className="mt-12 px-6 pt-8 pb-20 sm:px-10 sm:pt-24 sm:pb-24 md:px-16">
      <ContainerNarrow className="mt-8">
        <p className="mb-6 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-balance">
          Submit a Bill
        </p>
        <p className={submitBill.introClass}>{submitBill.intro}</p>

        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="w-full">
                <DisclaimerBill />
                <label className="mb-2 block space-y-5 font-sans text-sm font-bold text-slate-900">
                  Receipt
                </label>
                <UploadReceipt file={file} setFile={setFile} />
              </div>

              <div className="w-full">
                <SubmissionNotes value={notes} onChange={setNotes} />
              </div>

              {error && missingFields.length > 0 && (
                <FormError
                  message="Please complete the following before submitting:"
                  missingFields={missingFields}
                />
              )}

              <div className="w-full">
                <ButtonPrimary
                  type="submit"
                  disabled={loading}
                  className="w-full justify-center py-4 text-sm"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </ButtonPrimary>
              </div>
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
