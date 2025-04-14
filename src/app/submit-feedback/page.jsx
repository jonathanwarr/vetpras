'use client';

import FormFeedback from '@/components/forms/form-feedback';

export default function SubmitFeedbackPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-h2 font-playfair text-heading-1 mb-4">Submit Feedback</h1>
      <p className="mb-6 text-sm text-gray-700">
        Have something to report or suggest? Whether it’s a new service, clinic correction, or a
        bug—your feedback helps make Vetpras better for everyone.
      </p>
      <FormFeedback />
    </div>
  );
}
