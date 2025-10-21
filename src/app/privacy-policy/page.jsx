'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-10 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Privacy Policy
        </h1>

        <div className="mb-6 text-sm text-gray-600">
          <p>
            <strong>Effective Date:</strong> January 20, 2025
          </p>
        </div>

        <div className="space-y-8 text-sm text-gray-700">
          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              How We Use Cookies and Analytics
            </h2>
            <p>
              We use cookies and similar technologies to improve your experience and understand how
              visitors interact with Vetpras.com. Specifically:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2">
              <li>
                <strong>Google Analytics:</strong> Tracks aggregate user engagement. We have IP
                anonymization enabled to protect individual privacy.
              </li>
              <li>
                <strong>Meta Pixel:</strong> Helps us measure the effectiveness of our advertising
                on Meta (Facebook/Instagram) platforms.
              </li>
              <li>
                <strong>Hotjar:</strong> Provides anonymized heatmaps and session recordings to help
                us understand how visitors use our site—no personal information is recorded.
              </li>
            </ul>
            <p className="mt-4">
              You can manage your cookie preferences at any time through our cookie consent banner
              or in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Bill Submissions</h2>
            <p>When you upload a bill, we only review and display the service names and prices.</p>
            <p className="mt-4">
              We <strong>do not</strong> collect, store, or display any personal information such as
              pet names, owner names, addresses, or contact details.
            </p>
            <p className="mt-4">
              Your email (if provided, e.g., for the monthly draw) is used only for that purpose and
              deleted after each draw is completed.
            </p>
            <p className="mt-4">
              Submitted receipts are stored securely, used for validation, and are{' '}
              <strong>never made public or shared</strong>.
            </p>
            <p className="mt-4">
              We recommend <strong>blurring or covering</strong> any sensitive information before
              uploading.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Data Use and Sharing</h2>
            <p>
              We do not sell, rent, or share any personally identifiable information with third
              parties, except as required by law.
            </p>
            <p className="mt-4">
              All data is stored in secure Canadian data centers.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Contact Information</h2>
            <p>
              <strong>Address:</strong> 138 Esplanade E Ave, North Vancouver, BC, Canada V7L 4X9
            </p>
            <p className="mt-2">
              <strong>Email:</strong> info@vetpras.com
            </p>
            <p className="mt-4">
              If you have questions about this Privacy Policy, please contact us at
              info@vetpras.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
