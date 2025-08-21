'use client';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-10 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-sm text-gray-700">
          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              How We Handle Your Information
            </h2>
            <p>
              At Vetpras, your privacy is important to us. We only collect the minimum information
              necessary to support our mission of bringing clarity to pet care costs.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Bill Submissions</h2>
            <p>When you upload a vet bill:</p>
            <ul className="mt-2 list-inside list-disc space-y-2">
              <li>
                We <strong>only</strong> review the service names and associated prices.
              </li>
              <li>
                We <strong>do not</strong> collect or store any personal information, such as pet
                names, owner names, addresses, or contact details.
              </li>
            </ul>
            <p className="mt-4">
              We recommend <strong>blurring or covering</strong> any sensitive information before
              uploading.
            </p>
            <p className="mt-4">Submitted receipts are:</p>
            <ul className="mt-2 list-inside list-disc space-y-2">
              <li>Stored securely</li>
              <li>Reviewed only for validation</li>
              <li>
                <strong>Never made public</strong>
              </li>
              <li>
                <strong>Never shared</strong> with third parties
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Browsing and Using the Site</h2>
            <p>When you browse Vetpras:</p>
            <ul className="mt-2 list-inside list-disc space-y-2">
              <li>We do not track or collect personally identifiable information.</li>
              <li>We may collect anonymized analytics to help improve the experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">Third-Party Services</h2>
            <p>
              We do not sell, share, or trade your data with third-party marketing platforms. Our
              goal is to create a trusted, transparent community — not an ad-driven marketplace.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
