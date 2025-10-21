// File: src/app/terms-and-conditions/page.jsx
// Vetpras Terms and Conditions

export const metadata = {
  title: 'Terms and Conditions | Vetpras',
  description:
    'Vetpras Terms and Conditions for Canadian pet owners using our veterinary pricing transparency platform.',
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
            <strong>Effective Date:</strong> January 20, 2025
          </p>
        </div>

        {/* WHAT VETPRAS IS */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            1. What Vetpras Is
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              Vetpras is a pricing transparency platform that helps Canadian pet owners compare veterinary costs. All pricing information is for informational purposes only and should not replace professional veterinary consultation.
            </p>
            <p>
              <strong>Pricing Estimates:</strong> All costs shown are estimates based on a combination of user-submitted estimates, bills, and receipts. Actual prices may vary based on your pet's health, location, clinic policies, and treatment complexity. Always confirm pricing directly with the veterinary clinic before booking.
            </p>
            <p>
              <strong>Not Medical Advice:</strong> Vetpras provides pricing information only. We do not diagnose, treat, or advise on pet health. For pet health emergencies, contact your veterinarian immediately regardless of cost.
            </p>
          </div>
        </section>

        {/* WHO CAN USE VETPRAS */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            2. Who Can Use Vetpras
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>Eligibility:</strong> You must be 18 years old or the age of majority in your province to use Vetpras. Users must provide accurate contact information and maintain secure login credentials.
            </p>
            <p>
              <strong>Acceptable Use:</strong> You may use Vetpras to compare veterinary prices for personal pet care decisions, research treatment costs, and find local veterinary clinics.
            </p>
            <p>
              <strong>Prohibited Activities:</strong> You may not scrape or download pricing data for commercial use, submit false information, manipulate pricing displays, spam veterinary clinics, interfere with website functionality, or circumvent data access restrictions.
            </p>
            <p>
              <strong>Account Termination:</strong> We may suspend or terminate accounts for violations of these terms, fraudulent activity, misuse of pricing data, or at our discretion with notice where possible.
            </p>
          </div>
        </section>

        {/* YOUR DATA AND PRIVACY */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            3. Your Data and Privacy
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>Bill Submission Consent:</strong> By submitting veterinary bills to Vetpras, you consent to us using your data to improve pricing prediction models, publish anonymized pricing information, include your data in aggregated statistics, and share anonymized data with veterinary industry stakeholders for research purposes.
            </p>
            <p>
              <strong>Anonymization:</strong> When you upload a bill, we only review and display the service names and prices. We do not collect, store, or display any personal information such as pet names, owner names, addresses, or contact details. Submitted receipts are stored securely, used for validation, and are never made public or shared. We recommend blurring or covering any sensitive information before uploading.
            </p>
            <p>
              <strong>Voluntary:</strong> Bill submission is entirely voluntary. You may use Vetpras without submitting bills.
            </p>
            <p>
              For more details, see our Privacy Policy.
            </p>
          </div>
        </section>

        {/* YOUR RIGHTS AND OURS */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            4. Your Rights and Ours
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>Our Intellectual Property:</strong> All pricing data compilations, website design, software algorithms, and content are owned by Pawcker Technology Inc. and protected under Canadian law. You may view and use information for personal use only. Commercial use, reproduction, or redistribution is prohibited without written permission.
            </p>
            <p>
              <strong>Third-Party Links:</strong> Our site may link to veterinary clinics or other third-party services. We are not responsible for the accuracy, availability, or privacy practices of external sites. Verify all information directly with service providers.
            </p>
          </div>
        </section>

        {/* LIMITATIONS OF LIABILITY */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            5. Limitations of Liability
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>Service Provided "As Is":</strong> Vetpras is provided without warranties about accuracy, completeness, or availability. To the maximum extent permitted by Canadian law, we are not liable for indirect, consequential, or special damages. Our total liability is limited to $100 CAD. We do not guarantee uninterrupted service, and price information may contain errors.
            </p>
            <p>
              <strong>Your Responsibility:</strong> You are solely responsible for veterinary care decisions and their consequences.
            </p>
            <p>
              <strong>Indemnification:</strong> You agree to indemnify Vetpras from claims arising from your violation of these terms, misuse of our platform, decisions made based on pricing information, or disputes with veterinary clinics.
            </p>
          </div>
        </section>

        {/* GOVERNING LAW */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            6. Governing Law and Disputes
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>Applicable Law:</strong> These terms are governed by Canadian federal law and the laws of British Columbia. Any legal disputes must be resolved in Canadian courts in British Columbia.
            </p>
            <p>
              <strong>Dispute Resolution:</strong> Please contact us first to resolve issues informally before pursuing legal action.
            </p>
            <p>
              <strong>Regulatory Compliance:</strong> We reserve the right to modify services to comply with provincial veterinary regulations, healthcare transparency requirements, and animal health information handling laws.
            </p>
          </div>
        </section>

        {/* CHANGES TO TERMS */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            7. Changes to Terms
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              We may update these terms at any time. Changes will be posted on our website with the new effective date. Continued use of Vetpras after changes means you accept the new terms.
            </p>
          </div>
        </section>

        {/* CONTACT INFORMATION */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            8. Contact Information
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>Address:</strong> 138 Esplanade E Ave, North Vancouver, BC, Canada V7L 4X9
            </p>
            <p>
              <strong>Email:</strong> info@vetpras.com
            </p>
          </div>
        </section>

        {/* GENERAL PROVISIONS */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            9. General Provisions
          </h2>
          <div className="space-y-4 text-sm text-gray-700">
            <p>
              <strong>Severability:</strong> If any part of these terms is found unenforceable, the rest remains valid.
            </p>
            <p>
              <strong>Entire Agreement:</strong> These terms constitute our entire agreement with you.
            </p>
            <p>
              <strong>Force Majeure:</strong> We are not liable for service disruptions caused by circumstances beyond our control, including natural disasters, pandemics, government actions, or internet outages.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center text-sm text-gray-600">
            <p>
              <strong>Last Updated:</strong> January 20, 2025
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
