// Privacy policy, including the Google/AdSense cookie and opt-out disclosures AdSense requires.
// Sets its own canonical: the root layout no longer provides one.

import dynamic from "next/dynamic";
import Nav from "@/components/layout/Nav";
import { SITE_URL, LEGAL_LAST_UPDATED } from "@/lib/constants";
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
  alternates: { canonical: `${SITE_URL}/privacy` },
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

      <div className="min-h-[90vh] flex flex-col before:flex-1 after:flex-[7] w-full mx-auto px-8 pt-16 pb-12 2xl:px-64">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 font-graphiklight mb-8">
            Last updated: {LEGAL_LAST_UPDATED}
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
                <li>Make a support payment</li>
                <li>Contact us through our contact form</li>
                <li>Post comments or interact with our content (for example, via Disqus)</li>
                <li>Manage your cookie preferences through our consent tool</li>
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
                We use cookies and similar technologies (such as pixels and local storage) to operate our website, remember preferences, measure traffic, and support advertising. Cookies are small files stored on your device that may include an anonymous unique identifier.
              </p>
              <p className="mb-4">
                We use both first-party cookies (set by The Music Bugle) and third-party cookies (set by partners such as Google). You can instruct your browser to refuse cookies or alert you when cookies are being sent; some features may not work correctly if you disable cookies.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">6. Third-Party Advertising and Google AdSense</h2>
              <p className="mb-4">
                We display third-party advertisements on our website through Google AdSense and its advertising partners. These services may use cookies, device identifiers, and similar technologies to serve ads, limit how often you see an ad, measure ad performance, and show ads that may be relevant to your interests.
              </p>
              <p className="mb-4">
                Google and its partners may collect or receive information from your browser or device when you visit our site, including through cookies. This may include your IP address, browser type, pages viewed, and interactions with ads. For more information about how Google uses data in advertising, see{" "}
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-theme-red hover:underline">Google&apos;s Advertising Technologies Policy</a>{" "}
                and{" "}
                <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer" className="text-theme-red hover:underline">How Google uses data when you use our partners&apos; sites or apps</a>.
              </p>
              <p className="mb-4">
                You can learn more about personalized advertising and opt out of interest-based ads from many providers at{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-theme-red hover:underline">Google Ad Settings</a>{" "}
                and{" "}
                <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-theme-red hover:underline">aboutads.info choices</a>.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">7. Third-Party Services</h2>
              <p className="mb-4">
                We use third-party services that may collect, monitor, and analyze information when you use our website, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li><strong>Google AdSense:</strong> To display advertisements on our site</li>
                <li><strong>Google Analytics and Google Tag Manager:</strong> To analyze website traffic and usage patterns</li>
                <li><strong>Google Privacy &amp; messaging:</strong> To ask visitors in the EEA, the UK and Switzerland for cookie consent and remember their choices</li>
                <li><strong>Stripe:</strong> To process support payments securely</li>
                <li><strong>Disqus:</strong> To host and display article comments</li>
                <li><strong>Resend:</strong> To deliver messages sent through our contact form</li>
                <li><strong>Vercel:</strong> To host the website, which includes standard server logs such as IP addresses</li>
              </ul>
              <p className="mb-4">
                These providers process data according to their own privacy policies. They have access to information only as needed to perform services for us and are contractually or policy-bound to protect it.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">8. Cookie Consent and Your Choices</h2>
              <p className="mb-4">
                If you are in the European Economic Area, the United Kingdom or Switzerland, we ask for your consent before we or our partners use cookies for analytics and advertising, through a consent message provided by Google. Until you choose, those cookies stay off. You can review or change your choice at any time on our{" "}
                <a href="/consent-preferences" className="text-theme-red hover:underline">Cookie Preferences</a> page.
              </p>
              <p className="mb-4">
                Everywhere else, we use analytics and advertising cookies by default. You can opt out of personalized advertising using the links in Section 6, and you can block or delete cookies in your browser settings.
              </p>
              <p className="mb-4">
                <strong>Do Not Track:</strong> Some browsers send a &quot;Do Not Track&quot; signal. Because there is no common standard for responding to it, our website does not currently respond to Do Not Track signals.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">9. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">10. Your Rights (GDPR/CCPA)</h2>
              <p className="mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate personal information</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal information</li>
                <li><strong>Right to Restrict Processing:</strong> Request limitation of how we use your information</li>
                <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Right to Object:</strong> Object to processing of your personal information</li>
                <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information (if applicable)</li>
                <li><strong>Right to Withdraw Consent:</strong> Where we rely on your consent, withdraw it at any time, for cookies on our <a href="/consent-preferences" className="text-theme-red hover:underline">Cookie Preferences</a> page</li>
              </ul>
              <p className="mb-4">
                To exercise these rights, please contact us at <a href="mailto:info@themusicbugle.com" className="text-theme-red hover:underline">info@themusicbugle.com</a>. We will respond within 30 days and may need to verify your identity first. If you are in the EEA, the UK or Switzerland, you also have the right to lodge a complaint with your local data protection authority.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">11. Children&apos;s Privacy</h2>
              <p className="mb-4">
                Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">12. Legal Bases for Processing (EEA, UK and Switzerland)</h2>
              <p className="mb-4">If you are in the EEA, the UK or Switzerland, we process your personal information on these legal bases:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li><strong>Consent:</strong> Analytics and advertising cookies, and personalized ads</li>
                <li><strong>Contract:</strong> Processing a support payment you make</li>
                <li><strong>Legitimate interests:</strong> Running and securing the website, preventing abuse, and responding to messages you send us</li>
                <li><strong>Legal obligation:</strong> Keeping payment records that tax and accounting laws require</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">13. Data Retention</h2>
              <p className="mb-4">We keep personal information only as long as we need it for the purposes in this policy:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li><strong>Contact form messages:</strong> As long as needed to respond and handle any follow-up</li>
                <li><strong>Support payment records:</strong> As long as tax and accounting laws require (Stripe holds the payment details)</li>
                <li><strong>Analytics data:</strong> According to our Google Analytics retention setting, and no longer than 14 months</li>
                <li><strong>Comments:</strong> Held by Disqus until you or we delete them</li>
                <li><strong>Cookies:</strong> For the lifetime set by us or our partners, or until you delete them</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">14. International Data Transfers</h2>
              <p className="mb-4">
                Our service providers, including Google, Vercel and Stripe, may process your information in the United States and other countries whose data protection laws may differ from yours. Where the law requires it, these transfers rely on safeguards such as the European Commission&apos;s Standard Contractual Clauses or the EU-U.S. Data Privacy Framework.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">15. Changes to This Privacy Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">16. Contact Us</h2>
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
