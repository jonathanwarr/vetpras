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

        <div className="mb-6 text-sm text-gray-600">
          <p>
            <strong>Effective Date:</strong> September 11, 2025
          </p>
        </div>

        {/* PRICING INFORMATION DISCLAIMER */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            1. Pricing Information Disclaimer
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              All veterinary costs shown on Vetpras are estimates only. Actual prices may vary
              significantly based on:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Your pet's specific health condition</li>
              <li>Geographic location</li>
              <li>Individual clinic policies</li>
              <li>Treatment complexity</li>
              <li>Emergency vs. routine care</li>
            </ul>
            <p>
              <strong>Important:</strong> Always confirm pricing directly with the veterinary clinic
              before booking or treatment. Vetpras updates pricing data regularly but cannot
              guarantee real-time accuracy.
            </p>
            <p>
              <strong>No Medical Advice:</strong> Vetpras provides pricing information only. We do
              not provide veterinary or medical advice. For pet health emergencies, contact your
              veterinarian immediately regardless of cost considerations.
            </p>
          </div>
        </section>

        {/* ACCOUNT CREATION */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            2. Account Creation and User Registration
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Account Requirements:</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li>Must be 18+ years old (age of majority in your province)</li>
                <li>Provide accurate contact information</li>
                <li>Maintain secure login credentials</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Your Responsibilities:
              </h3>
              <ul className="ml-6 list-disc space-y-1">
                <li>Keep account information current</li>
                <li>Protect your password</li>
                <li>Notify us of unauthorized access immediately</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Account Termination:</h3>
              <p>
                We may suspend or terminate accounts for terms violations, fraudulent activity, or
                misuse of pricing data.
              </p>
            </div>
          </div>
        </section>

        {/* INTELLECTUAL PROPERTY */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            3. Intellectual Property Rights
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Our Property:</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li>All pricing data compilations</li>
                <li>Website design and functionality</li>
                <li>Software algorithms</li>
                <li>Content and graphics</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Your Rights:</h3>
              <p>
                You may view and use information for personal pet care decisions only. Commercial
                use, reproduction, or redistribution is prohibited without written permission.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Database Protection:</h3>
              <p>
                Our pricing database is protected under Canadian law. Unauthorized extraction or
                systematic copying is prohibited.
              </p>
            </div>
          </div>
        </section>

        {/* USER CONDUCT */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            4. User Conduct and Prohibited Activities
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Allowed Uses:</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li>Compare veterinary prices for your pets</li>
                <li>Research treatment costs</li>
                <li>Find local veterinary clinics</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Prohibited Activities:
              </h3>
              <ul className="ml-6 list-disc space-y-1">
                <li>Scraping or downloading pricing data for commercial use</li>
                <li>Submitting false veterinary information</li>
                <li>Attempting to manipulate pricing displays</li>
                <li>Spamming veterinary clinics through our platform</li>
                <li>Interfering with website functionality</li>
                <li>Circumventing data access restrictions</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BILL SUBMISSION AND DATA USE */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            5. Bill Submission and Data Use Consent
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Consent to Data Use:
              </h3>
              <p>
                By submitting veterinary bills or receipts to Vetpras, you provide explicit consent for us to:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Use your submitted bill data to train and improve our pricing prediction models</li>
                <li>Publish anonymized pricing information derived from your submission</li>
                <li>Include your data in aggregated pricing statistics and analysis</li>
                <li>Share anonymized data with veterinary industry stakeholders for research purposes</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Data Anonymization:</h3>
              <p>
                We take privacy seriously. All submitted bills are anonymized by removing:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Personal identifying information (names, addresses, phone numbers)</li>
                <li>Pet identifying information (names, microchip numbers)</li>
                <li>Account numbers and payment information</li>
                <li>Any other personally identifiable data</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Purpose and Benefits:</h3>
              <p>
                Your contribution helps build a comprehensive database of veterinary pricing that benefits all pet owners by:
              </p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Improving price transparency in veterinary care</li>
                <li>Enabling better cost prediction accuracy</li>
                <li>Supporting informed decision-making for pet owners</li>
                <li>Contributing to veterinary industry research and analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Voluntary Submission:</h3>
              <p>
                Bill submission is entirely voluntary. You may use Vetpras services without submitting bills, though doing so helps improve our platform for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* LIMITATION OF LIABILITY */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">6. Limitation of Liability</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Service Provided "As Is":
              </h3>
              <p>
                Vetpras is provided without warranties about accuracy, completeness, or
                availability.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Liability Limits:</h3>
              <p>To the maximum extent permitted by Canadian law:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>We are not liable for indirect, consequential, or special damages</li>
                <li>Our total liability is limited to $100 CAD</li>
                <li>We do not guarantee uninterrupted service</li>
                <li>Price information may contain errors or omissions</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Your Decisions:</h3>
              <p>
                You are solely responsible for veterinary care decisions and their consequences.
              </p>
            </div>
          </div>
        </section>

        {/* INDEMNIFICATION */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">7. Indemnification</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>You agree to protect Vetpras from claims arising from:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Your violation of these terms</li>
              <li>Misuse of our platform</li>
              <li>Decisions made based on pricing information</li>
              <li>Disputes with veterinary clinics</li>
            </ul>
            <p>This includes covering our legal fees and damages from such claims.</p>
          </div>
        </section>

        {/* TERMINATION */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">8. Termination and Suspension</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Grounds for Termination:
              </h3>
              <ul className="ml-6 list-disc space-y-1">
                <li>Terms violations</li>
                <li>Fraudulent activity</li>
                <li>Misuse of pricing data</li>
                <li>At our discretion with reasonable notice</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Process:</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li>We will provide notice when possible</li>
                <li>Account access ends immediately</li>
                <li>User data may be retained per our Privacy Policy</li>
              </ul>
            </div>
          </div>
        </section>

        {/* THIRD-PARTY LINKS */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            9. Third-Party Links and Services
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">External Links:</h3>
              <p>
                Our site may link to veterinary clinics, booking systems, or other third-party
                services.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Disclaimer:</h3>
              <p>We are not responsible for:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Accuracy of third-party content</li>
                <li>Availability of external services</li>
                <li>Privacy practices of other sites</li>
                <li>Your interactions with veterinary clinics</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Use at Your Own Risk:</h3>
              <p>Verify all information directly with service providers.</p>
            </div>
          </div>
        </section>

        {/* GOVERNING LAW */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            10. Governing Law and Jurisdiction
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Applicable Law:</h3>
              <p>
                These terms are governed by Canadian federal law and the laws of British Columbia.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Dispute Resolution:</h3>
              <p>
                Any legal disputes must be resolved in Canadian courts in British Columbia. You
                cannot sue us in foreign jurisdictions.
              </p>
            </div>
          </div>
        </section>

        {/* HEALTH DISCLAIMERS */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            11. Health Information Disclaimers
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Not Medical Advice:</h3>
              <ul className="ml-6 list-disc space-y-1">
                <li>Vetpras provides pricing information only</li>
                <li>We do not diagnose, treat, or advise on pet health</li>
                <li>Always consult qualified veterinarians for medical decisions</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Emergency Situations:</h3>
              <p>
                Seek immediate veterinary attention for pet emergencies regardless of cost
                considerations.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Professional Consultation Required:
              </h3>
              <p>Pricing information should never replace professional veterinary consultation.</p>
            </div>
          </div>
        </section>

        {/* FORCE MAJEURE */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">12. Force Majeure</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              We are not liable for service disruptions caused by circumstances beyond our control,
              including:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Natural disasters</li>
              <li>Pandemics</li>
              <li>Government actions</li>
              <li>Internet outages</li>
              <li>Other extraordinary events</li>
            </ul>
          </div>
        </section>

        {/* SEVERABILITY */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            13. Severability and Entire Agreement
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Severability:</h3>
              <p>If any part of these terms is found unenforceable, the rest remains valid.</p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Complete Agreement:</h3>
              <p>
                These terms constitute our entire agreement. Previous negotiations or
                representations do not apply.
              </p>
            </div>
          </div>
        </section>

        {/* AMENDMENTS */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">14. Amendment Procedures</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Updates:</h3>
              <p>We may update these terms at any time.</p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Notice:</h3>
              <p>Changes will be posted on our website with the new effective date.</p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Acceptance:</h3>
              <p>Continued use of Vetpras after changes means you accept the new terms.</p>
            </div>
          </div>
        </section>

        {/* CONTACT INFO */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            15. Contact Information and Disputes
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Legal Notices:</h3>
              <p>138 Esplanade E Ave, North Vancouver, BC, Canada V7L 4X9</p>
              <p>Email: info@vetpras.com</p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Dispute Resolution:</h3>
              <p>Contact us first to resolve issues informally before pursuing legal action.</p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Questions:</h3>
              <p>Email info@vetpras.com for general inquiries.</p>
            </div>
          </div>
        </section>

        {/* REGULATORY COMPLIANCE */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            16. Compliance with Canadian Healthcare Regulations
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Regulatory Compliance:
              </h3>
              <p>We reserve the right to modify services to comply with:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Provincial veterinary regulations</li>
                <li>Healthcare transparency requirements</li>
                <li>Animal health information handling laws</li>
                <li>Future regulatory changes</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                Service Modifications:
              </h3>
              <p>Changes may be made without notice to ensure regulatory compliance.</p>
            </div>
          </div>
        </section>

        {/* AGE RESTRICTIONS */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">17. Age Restrictions</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Minimum Age:</h3>
              <p>
                You must be 18 years old or the age of majority in your province to use Vetpras.
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Capacity:</h3>
              <p>Users must have legal capacity to make veterinary care decisions.</p>
            </div>
            <div>
              <h3 className="mb-2 text-base font-semibold text-slate-900">Parental Supervision:</h3>
              <p>Minors should use this service only with parental guidance.</p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center text-sm text-gray-600">
            <p>
              <strong>Last Updated:</strong> September 11, 2025
            </p>
            <p>
              <strong>Questions?</strong> Contact us at info@vetpras.com
            </p>
            <p className="mt-4 italic">
              By using Vetpras, you agree to these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
    
  );
}
