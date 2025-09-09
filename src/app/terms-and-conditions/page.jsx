// File: src/app/terms-and-conditions/page.jsx
// Vetpras Terms and Conditions & Monthly Draw Rules

export const metadata = {
  title: 'Terms and Conditions | Vetpras',
  description:
    'Vetpras Terms and Conditions, including Monthly Draw Official Rules (Canada, excluding Quebec unless a full French version is published).',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="mb-10 font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Terms and Conditions
        </h1>

        {/* GENERAL TERMS SECTION */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">General Terms</h2>

          <div className="space-y-6 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Pricing Information Disclaimer
              </h3>
              <p>
                Veterinary prices displayed on Vetpras are estimates based on aggregated data and
                may vary significantly depending on multiple factors including but not limited to:
                your pet's species, breed, age, weight, sex, pre-existing conditions, geographic
                location, and the specific veterinary clinic's pricing structure. The complexity of
                your pet's condition and any additional diagnostics or treatments required may also
                affect final costs. Always consult directly with your veterinarian for accurate
                pricing specific to your pet's individual needs and circumstances. Vetpras pricing
                data should be used for general guidance only and does not constitute a guarantee of
                actual costs.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Use of Service</h3>
              <p>
                By accessing and using Vetpras, you agree to comply with these Terms and Conditions.
                The service is provided for informational purposes to help pet owners make informed
                decisions about veterinary care.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Privacy</h3>
              <p>
                Your use of our service is also governed by our{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                . We collect and use personal information in accordance with Canadian privacy laws.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
