import dynamic from "next/dynamic";
import Link from "next/link";
import Nav from "@/components/layout/Nav";
import { SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Thank you for supporting The Music Bugle - Your payment was successful.",
  openGraph: {
    title: "Payment Successful - The Music Bugle",
    description: "Thank you for supporting The Music Bugle - Your payment was successful.",
    url: `${SITE_URL}/payment-success`,
    type: "website",
  },
};

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => (
    <div className="w-full py-12 text-center text-xs text-gray-400" />
  ),
});

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string }>;
}) {
  const { amount } = await searchParams;
  const displayAmount = amount ? parseFloat(amount).toFixed(2) : null;

  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto px-8 py-12 2xl:px-64">
        <div className="max-w-4xl mx-auto">
          {/* Success Icon and Message */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-6 leading-tight">
              Thank You for Your Support!
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-graphiklight max-w-2xl mx-auto leading-relaxed mb-4">
              Your support payment has been successfully processed. Your contribution helps us maintain independent music journalism and deliver quality content.
            </p>
            {displayAmount && (
              <div className="inline-block bg-theme-red text-white px-8 py-4 rounded-sm mt-6">
                <p className="text-sm font-graphiknormal mb-1">Support Amount</p>
                <p className="text-3xl font-prata">${displayAmount}</p>
              </div>
            )}
          </div>

          {/* What's Next Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-8 mb-12">
            <h2 className="text-[28px] font-prata text-gray-900 mb-6 text-center">
              What's Next?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-theme-red text-white flex items-center justify-center font-graphiknormal text-sm mt-1">
                  1
                </div>
                <div>
                  <h3 className="text-[20px] font-prata text-gray-900 mb-2">Check Your Email</h3>
                  <p className="body-text">
                    You&apos;ll receive a payment confirmation email shortly with your receipt and transaction details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-theme-red text-white flex items-center justify-center font-graphiknormal text-sm mt-1">
                  2
                </div>
                <div>
                  <h3 className="text-[20px] font-prata text-gray-900 mb-2">Your Support Matters</h3>
                  <p className="body-text">
                    Your contribution directly supports independent music journalism and helps us continue delivering quality, unbiased music news and coverage.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-theme-red text-white flex items-center justify-center font-graphiknormal text-sm mt-1">
                  3
                </div>
                <div>
                  <h3 className="text-[20px] font-prata text-gray-900 mb-2">Stay Connected</h3>
                  <p className="body-text">
                    Follow us on social media and subscribe to our newsletter to stay updated with the latest music news and exclusive content.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/"
              className="bg-theme-red text-white px-8 py-3 rounded-sm hover:bg-[#a03b3c] transition-colors font-graphiknormal text-center"
            >
              Return to Home
            </Link>
            <Link
              href="/article"
              className="bg-white border-2 border-theme-red text-theme-red px-8 py-3 rounded-sm hover:bg-theme-red hover:text-white transition-colors font-graphiknormal text-center"
            >
              Browse Articles
            </Link>
          </div>

          {/* Support Information */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-[24px] font-prata text-gray-900 mb-4 text-center">
              Need Help?
            </h3>
            <div className="text-center body-text space-y-2">
              <p>
                If you have any questions about your payment or support, please don&apos;t hesitate to contact us.
              </p>
              <p>
                <a href="mailto:info@themusicbugle.com" className="text-theme-red hover:underline font-graphiknormal">
                  info@themusicbugle.com
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-4">
                For refund or cancellation requests, please see our <Link href="/refund" className="text-theme-red hover:underline">Refund Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
