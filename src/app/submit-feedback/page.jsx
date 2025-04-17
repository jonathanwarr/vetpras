'use client';

import ContainerNarrow from '@/components/layout/container-narrow';
import FormFeedback from '@/components/forms/form-feedback';
import { submitFeedback } from '@/content/submit-feedback';

export default function SubmitFeedbackPage() {
  return (
    <section className="px-6 py-24 sm:px-10 md:px-16">
      <ContainerNarrow className="mt-8">
        <p className="text-primary mb-2 text-sm font-semibold tracking-widest uppercase">
          Submit Feedback
        </p>
        <p className={submitFeedback.introClass}>{submitFeedback.intro}</p>

        <div className="mt-12">
          <FormFeedback />
        </div>
      </ContainerNarrow>
    </section>
  );
}
