import dynamic from "next/dynamic";
import Nav from "@/components/layout/Nav";
import { SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for The Music Bugle - Learn how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy - The Music Bugle",
    description: "Privacy Policy for The Music Bugle - Learn how we collect, use, and protect your personal information.",
    url: `${SITE_URL}/privacy`,
    type: "website",
  },
};

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => (
    <div className="w-full py-12 text-center text-xs text-gray-400" />
  ),
});

export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto px-8 py-12 2xl:px-64">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 font-graphiklight mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="body-text space-y-8">
            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">1. Introduction</h2>
              <p className="mb-4">
                The Music Bugle (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website themusicbugle.com.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-[20px] font-prata text-gray-900 mb-3 mt-4">2.1 Information You Provide</h3>
              <p className="mb-4">
                We may collect information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Register for an account</li>
                <li>Make a support payment</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us through our contact form</li>
                <li>Post comments or interact with our content</li>
              </ul>
              <p className="mb-4">
                This information may include your name, email address, payment information, and any other information you choose to provide.
              </p>

              <h3 className="text-[20px] font-prata text-gray-900 mb-3 mt-4">2.2 Automatically Collected Information</h3>
              <p className="mb-4">
                When you visit our website, we may automatically collect certain information about your device, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages you visit and time spent on pages</li>
                <li>Referring website addresses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process support payments and manage memberships</li>
                <li>Send you newsletters and updates (with your consent)</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze website usage and trends</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">4. Payment Information</h2>
              <p className="mb-4">
                When you make a support payment, we use Stripe to process payments. Stripe collects and processes your payment information in accordance with their Privacy Policy. We do not store your full credit card details on our servers. For more information about Stripe&apos;s privacy practices, please visit <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-theme-red hover:underline">Stripe&apos;s Privacy Policy</a>.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
              <p className="mb-4">
                We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">6. Third-Party Services</h2>
              <p className="mb-4">
                We may use third-party services that collect, monitor, and analyze information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li><strong>Google Analytics:</strong> To analyze website traffic and usage patterns</li>
                <li><strong>Stripe:</strong> To process payments securely</li>
                <li><strong>Email Service Providers:</strong> To send newsletters and communications</li>
              </ul>
              <p className="mb-4">
                These third parties have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">7. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">8. Your Rights (GDPR/CCPA)</h2>
              <p className="mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal information</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal information</li>
                <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your information</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal information</li>
                <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information (if applicable)</li>
              </ul>
              <p className="mb-4">
                To exercise these rights, please contact us at <a href="mailto:info@themusicbugle.com" className="text-theme-red hover:underline">info@themusicbugle.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">9. Children&apos;s Privacy</h2>
              <p className="mb-4">
                Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">11. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mb-2">
                <strong>Email:</strong> <a href="mailto:info@themusicbugle.com" className="text-theme-red hover:underline">info@themusicbugle.com</a>
              </p>
              <p className="mb-2">
                <strong>Website:</strong> <a href="/contact" className="text-theme-red hover:underline">Contact Us</a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
