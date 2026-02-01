import dynamic from "next/dynamic";
import Nav from "@/components/layout/Nav";
import { SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
  description: "Refund and Cancellation Policy for The Music Bugle - Learn about our refund and cancellation procedures for support payments.",
  openGraph: {
    title: "Refund and Cancellation Policy - The Music Bugle",
    description: "Refund and Cancellation Policy for The Music Bugle - Learn about our refund and cancellation procedures for support payments.",
    url: `${SITE_URL}/refund`,
    type: "website",
  },
};

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => (
    <div className="w-full py-12 text-center text-xs text-gray-400" />
  ),
});

export default function RefundPage() {
  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto px-8 py-12 2xl:px-64">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-6 leading-tight">
            Refund and Cancellation Policy
          </h1>
          <p className="text-sm text-gray-500 font-graphiklight mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="body-text space-y-8">
            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">1. Support Payments</h2>
              <p className="mb-4">
                The Music Bugle offers support payment options to help maintain independent music journalism. Support payments are voluntary contributions to help us continue our mission.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">2. One-Time Support Payments</h2>
              <h3 className="text-[20px] font-prata text-gray-900 mb-3 mt-4">2.1 Refund Eligibility</h3>
              <p className="mb-4">
                One-time support payments are generally final. However, we may consider refunds in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Technical errors that resulted in duplicate charges</li>
                <li>Unauthorized transactions</li>
                <li>Payment made by mistake (within 48 hours of payment)</li>
              </ul>

              <h3 className="text-[20px] font-prata text-gray-900 mb-3 mt-4">2.2 Refund Process</h3>
              <p className="mb-4">
                To request a refund for a one-time support payment, please contact us at <a href="mailto:info@themusicbugle.com" className="text-theme-red hover:underline">info@themusicbugle.com</a> within 30 days of your payment. Include your payment confirmation email or transaction ID. We will review your request and respond within 5-7 business days.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">3. Monthly Support Payments</h2>
              <h3 className="text-[20px] font-prata text-gray-900 mb-3 mt-4">3.1 Cancellation</h3>
              <p className="mb-4">
                You may cancel your monthly recurring support payment at any time. To cancel:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Contact us at <a href="mailto:info@themusicbugle.com" className="text-theme-red hover:underline">info@themusicbugle.com</a> with your details</li>
                <li>Or manage your recurring support through your Stripe customer portal (if available)</li>
              </ul>
              <p className="mb-4">
                Cancellation will take effect at the end of your current billing period.
              </p>

              <h3 className="text-[20px] font-prata text-gray-900 mb-3 mt-4">3.2 Refunds for Monthly Payments</h3>
              <p className="mb-4">
                Monthly support payments are non-refundable once processed. However, if you cancel, you will not be charged for future billing periods. Refunds for the current period may be considered on a case-by-case basis for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Unauthorized charges</li>
                <li>Duplicate charges due to system errors</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">4. Processing Time</h2>
              <p className="mb-4">
                If your refund request is approved, the refund will be processed to your original payment method within 5-10 business days. The exact time may vary depending on your payment provider.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">5. Chargebacks</h2>
              <p className="mb-4">
                If you initiate a chargeback through your bank or credit card company, we reserve the right to dispute the chargeback and provide evidence of the transaction.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">6. Disputes</h2>
              <p className="mb-4">
                As support payments are voluntary contributions, refunds are generally not provided. However, we are committed to fair resolution of any payment errors.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">7. Changes to This Policy</h2>
              <p className="mb-4">
                We reserve the right to modify this Refund and Cancellation Policy at any time. Changes will be effective immediately upon posting to this page. Your continued use of our services after changes are posted constitutes acceptance of the modified policy.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">8. Contact Us</h2>
              <p className="mb-4">
                For questions about refunds or cancellations, please contact us at:
              </p>
              <p className="mb-2">
                <strong>Email:</strong> <a href="mailto:info@themusicbugle.com" className="text-theme-red hover:underline">info@themusicbugle.com</a>
              </p>
              <p className="mb-2">
                <strong>Website:</strong> <a href="/contact" className="text-theme-red hover:underline">Contact Us</a>
              </p>
              <p className="mb-4 mt-4">
                Please include your payment confirmation email or transaction ID when contacting us about refunds or cancellations.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
