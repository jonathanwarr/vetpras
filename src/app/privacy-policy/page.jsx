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
              When you visit Vetpras.com, our servers automatically record technical information
              about your visit. This may include your device’s IP address, browser type, time and
              date of access, and referring webpage.
            </p>
            <br></br>
            <p>
              We use your IP address to help determine your approximate location so that we can show
              you nearby veterinary clinics and improve your browsing experience.
            </p>
            <br></br>
            <p>
              Your IP address is considered personal information under Canadian law. We only use
              this information for the legitimate business purpose of providing location-based
              services. We do not use your IP address to personally identify you, nor do we share it
              with third parties except as required to deliver our services or if mandated by law.
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
              <li>
                Your email (if provided) is used <strong>solely</strong> for the monthly draw
              </li>
            </ul>
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
            <p className="mt-4">
              We recommend <strong>blurring or covering</strong> any sensitive information before
              uploading.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
