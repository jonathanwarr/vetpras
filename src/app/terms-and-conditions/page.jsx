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

        <hr className="my-12 border-gray-200" />

        {/* MONTHLY DRAW SECTION */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Vetpras Monthly Draw — Official Rules
          </h2>

          <div className="mb-8 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-800">
            <p className="font-semibold">
              NO PURCHASE NECESSARY. A PURCHASE OR PAYMENT (E.G., SUBMITTING A VETERINARY BILL) DOES
              NOT INCREASE YOUR CHANCES OF WINNING.
            </p>
          </div>

          <div className="space-y-8 text-sm text-gray-700">
            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">Sponsor</h3>
              <p>
                Vetpras <span className="whitespace-nowrap">[Amwarr Consulting Ltd.]</span>,
                <span className="whitespace-nowrap"> [138 Esplanade E Ave]</span>,{' '}
                <span className="whitespace-nowrap">[North Vancouver, BC]</span>, Canada
                ("Sponsor").
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">Promotion Period</h3>
              <p>
                Each monthly entry period runs from <strong>12:00:00 a.m. ET</strong> on the first
                calendar day of the month through <strong>11:59:59 p.m. ET</strong> on the last
                calendar day of the month, beginning <strong>[start month/year]</strong> and
                continuing until ended by Sponsor (each, a "Monthly Entry Period").
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">1. Eligibility</h3>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  Open to legal residents of Canada who have reached the{' '}
                  <strong>age of majority</strong> in their province/territory at the time of entry.
                </li>
                <li>
                  Excluded: employees, officers, directors, contractors and representatives of
                  Sponsor, its affiliates, advertising/promotion agencies, and their
                  household/immediate family members.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">2. How to Enter</h3>

              <h4 className="mt-4 mb-2 text-base font-semibold text-slate-900">
                (A) With a Vet Bill (Dog only)
              </h4>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  During a Monthly Entry Period, submit an itemized veterinary bill for{' '}
                  <strong>dog</strong> care via{' '}
                  <span className="whitespace-nowrap">[https://www.vetpras.com/submit-bill]</span>{' '}
                  or the in-app flow.
                </li>
                <li>
                  The invoice must be dated within the <strong>past 24 months</strong> and show
                  clinic name, invoice date, line items and total. Redact payment card numbers and
                  unrelated personal data. Accepted formats: PDF/JPG/PNG up to [10] MB.
                </li>
                <li>
                  <strong>One (1) entry per unique invoice.</strong> Duplicate, altered, unreadable,
                  or suspicious invoices will be rejected. Sponsor may require proof that you are
                  the account holder.
                </li>
              </ul>

              <h4 className="mt-4 mb-2 text-base font-semibold text-slate-900">
                (B) No Purchase Necessary (Equal-Integrity AMOE)
              </h4>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  During a Monthly Entry Period, visit{' '}
                  <span className="whitespace-nowrap">[https://www.vetpras.com/submit-bill]</span>{' '}
                  and submit your full name, mailing address, email, and a short statement (25–50
                  words) about your dog.
                </li>
                <li>
                  AMOE entries go into the <strong>same drawing pool</strong> and have the{' '}
                  <strong>same chance of winning</strong> as bill-based entries.
                </li>
                <li>
                  Limit <strong>one (1)</strong> AMOE entry per person per Monthly Entry Period.
                </li>
              </ul>

              <h4 className="mt-4 mb-2 text-base font-semibold text-slate-900">
                Entry Limits & Anti-Abuse
              </h4>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  To protect fairness, Sponsor may impose a cap of up to{' '}
                  <strong>twenty (20)</strong> bill-entries per person per Monthly Entry Period.
                  Automated/scripted/bulk entries are prohibited.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">3. Prize</h3>
              <p>
                Each month, <strong>one (1)</strong> prize is available:{' '}
                <strong>one (1) digital gift card valued at CAD $50</strong> from{' '}
                <span className="whitespace-nowrap">[issuer]</span> (approximate retail value: $50).
                Gift card is subject to the issuer's terms (and where permitted by law, promotional
                cards may carry restrictions or expiry). No cash equivalent, except as required by
                law or at Sponsor's sole discretion. Sponsor may substitute a prize of equal or
                greater value if the advertised prize becomes unavailable.
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">4. Winner Selection & Odds</h3>
              <p>
                Within <strong>7 business days</strong> after each Monthly Entry Period ends,
                Sponsor will conduct a random draw from all eligible entries received for that
                month. <strong>Odds</strong> depend on the number of eligible entries received in
                that Monthly Entry Period.
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                5. Winner Verification (Skill-Testing Question)
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  Selected entrant must correctly answer, without assistance, a{' '}
                  <strong>time-limited mathematical skill-testing question</strong>.
                </li>
                <li>
                  Sponsor may require a signed Declaration of Eligibility/Liability/Publicity
                  Release within <strong>5 days</strong> of notification. Non-compliance, inability
                  to contact, or ineligibility may result in disqualification and an alternate
                  selection.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                6. Notification & Prize Delivery
              </h3>
              <p>
                Sponsor will contact the selected entrant by email at the address provided at entry.
                It is your responsibility to keep contact details current. Prize will be delivered
                by email within <strong>10 business days</strong> of verification.
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                7. Entry Content & Invoice Rules
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  You must own/control the rights in any content you submit. Do not submit
                  invoices/images containing others' personal information without consent.
                </li>
                <li>
                  Entries that are incomplete, forged, altered, generated by bots or otherwise
                  incompatible with these Rules may be disqualified.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">8. Draw Privacy</h3>
              <p>
                Personal information is collected and used solely for administering the Promotion,
                verifying eligibility, and awarding the prize, and—only if you provide express
                consent—for marketing communications. Data handling follows Sponsor's{' '}
                <a href="/privacy-policy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{' '}
                and Canadian privacy-law principles (e.g., consent, limiting
                collection/use/retention). Data may be processed outside Canada by service
                providers. Marketing emails comply with CASL and include an unsubscribe mechanism.
                You can withdraw consent at any time, subject to legal and contractual limits.
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">9. General Draw Conditions</h3>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  Sponsor may cancel, modify, or suspend the Promotion if fraud, technical failures
                  or other factors impair its integrity. Sponsor's decisions are final on all
                  matters.
                </li>
                <li>
                  By entering, you release and hold harmless Sponsor, its affiliates, partners, and
                  agents from any claims arising from participation or prize use, to the extent
                  permitted by law. The prize issuer is not a sponsor of this Promotion.
                </li>
                <li>Void where prohibited.</li>
              </ul>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">10. Publicity</h3>
              <p>
                By accepting a prize, you permit Sponsor to use your{' '}
                <strong>first name, initial of last name, and city/province</strong> for winner
                announcements and required disclosures without additional compensation, where
                lawful.
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                11. Governing Law & Disputes
              </h3>
              <p>
                These Rules are governed by the laws of <strong>[British Columbia]</strong> and the
                federal laws of Canada applicable therein. Exclusive venue: the courts of{' '}
                <strong>[British Columbia]</strong>.
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-bold text-slate-900">12. Winners' List</h3>
              <p>
                For the winner's first name/initial and city/province for a given month, email{' '}
                <a href="mailto:winners@vetpras.com" className="text-blue-600 hover:underline">
                  winners@vetpras.com
                </a>{' '}
                within <strong>60 days</strong> after that Monthly Entry Period.
              </p>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
