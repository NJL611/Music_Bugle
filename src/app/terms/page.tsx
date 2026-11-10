// Terms of service trust page.
// Sets its own canonical: the root layout no longer provides one.

import dynamic from "next/dynamic";
import Nav from "@/components/layout/Nav";
import { SITE_URL, LEGAL_LAST_UPDATED, SUPPORT_PAYMENTS_ENABLED } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for The Music Bugle - Read our terms and conditions for using our music journalism platform.",
  openGraph: {
    title: "Terms of Service - The Music Bugle",
    description: "Terms of Service for The Music Bugle - Read our terms and conditions for using our music journalism platform.",
    url: `${SITE_URL}/terms`,
    type: "website",
  },
  alternates: { canonical: `${SITE_URL}/terms` },
};

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => (
    <div className="w-full py-12 text-center text-xs text-gray-400" />
  ),
});

export default function TermsPage() {
  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="min-h-[90vh] flex flex-col before:flex-1 after:flex-[7] w-full mx-auto px-8 pt-16 pb-12 2xl:px-64">
        <div className="w-full max-w-4xl mx-auto">
          <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-6 leading-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 font-graphiklight mb-8">
            Last updated: {LEGAL_LAST_UPDATED}
          </p>

          <div className="body-text space-y-8">
            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using The Music Bugle website (themusicbugle.com), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily access the materials on The Music Bugle&apos;s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on The Music Bugle&apos;s website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">3. Copyright and Photo Credits</h2>
              <p className="mb-4">
                Articles, interviews and reviews on this website are the work of The Music Bugle and its contributors. Photos and artwork are usually supplied by artists, their labels or their publicists for editorial use, and they remain the property of their owners.
              </p>
              <p className="mb-4">
                If you own a photo or other material on this website and believe it is used without permission, email <a href="mailto:info@themusicbugle.com" className="text-theme-red hover:underline">info@themusicbugle.com</a> with the page address and the details of your claim. We will review it promptly and remove or credit the material as appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">4. Comments</h2>
              <p className="mb-4">
                Readers can comment on articles through Disqus, which applies its own terms of service. Please do not post spam, harassment, hate speech, or anything unlawful or infringing. We may remove any comment that breaks these rules. By posting a comment, you grant The Music Bugle a non-exclusive, royalty-free, perpetual, and worldwide license to display and distribute it.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">5. Disclaimer</h2>
              <p className="mb-4">
                The materials on The Music Bugle&apos;s website are provided on an &apos;as is&apos; basis. The Music Bugle makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">6. Limitations</h2>
              <p className="mb-4">
                In no event shall The Music Bugle or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on The Music Bugle&apos;s website.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">7. Revisions and Errata</h2>
              <p className="mb-4">
                The materials appearing on The Music Bugle&apos;s website could include technical, typographical, or photographic errors. The Music Bugle does not warrant that any of the materials on its website are accurate, complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">8. Links</h2>
              <p className="mb-4">
                The Music Bugle has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by The Music Bugle of the site.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">9. Site Terms of Use Modifications</h2>
              <p className="mb-4">
                The Music Bugle may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">10. Governing Law</h2>
              <p className="mb-4">
                Any claim relating to The Music Bugle&apos;s website shall be governed by the laws of the State of New York, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            {SUPPORT_PAYMENTS_ENABLED && (
              <section>
                <h2 className="text-[28px] font-prata text-gray-900 mb-4">11. Support Payments</h2>
                <p className="mb-4">
                  Readers can make one-time support payments to help fund independent music journalism. By making a support payment, you acknowledge that:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>Support payments are voluntary contributions, not charitable donations</li>
                  <li>Payments are processed by Stripe and subject to Stripe&apos;s terms of service</li>
                  <li>Refunds follow our <a href="/refund" className="text-theme-red hover:underline">Refund Policy</a></li>
                </ul>
              </section>
            )}

            <section>
              <h2 className="text-[28px] font-prata text-gray-900 mb-4">{SUPPORT_PAYMENTS_ENABLED ? 12 : 11}. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
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
