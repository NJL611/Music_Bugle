import dynamic from "next/dynamic";
import Nav from "@/components/layout/Nav";
import { SITE_URL, METADATA } from "@/lib/constants";
import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import { FacebookLogo, TwitterLogo, InstagramLogo, PinterestLogo } from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact The Music Bugle for music news inquiries, story tips, press requests, or feedback. Reach out via our contact form or email - we'd love to hear from you.",
  keywords: "contact, music news, music journalism, press inquiry, story tip, feedback, music blog contact",
  authors: [{ name: METADATA.title }],
  openGraph: {
    title: "Contact Us - The Music Bugle",
    description: "Contact The Music Bugle for music news inquiries, story tips, press requests, or feedback. Reach out via our contact form or email.",
    url: `${SITE_URL}/contact`,
    siteName: METADATA.title,
    type: "website",
    images: [
      {
        url: METADATA.image,
        width: 1200,
        height: 630,
        alt: "The Music Bugle - Contact Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - The Music Bugle",
    description: "Contact The Music Bugle for music news inquiries, story tips, press requests, or feedback. Reach out via our contact form or email.",
    images: [METADATA.image],
    creator: METADATA.twitterHandle,
  },
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => (
    <div className="w-full py-12 text-center text-xs text-gray-400" />
  ),
});

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto px-8 py-12 2xl:px-64">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-graphiklight max-w-3xl mx-auto leading-relaxed">
            Have a question, story tip, or feedback? We&apos;d love to hear from you. Get in touch with The Music Bugle team.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Information */}
            <div>
              <h2 className="text-[32px] md:text-[40px] font-prata text-gray-900 mb-6 border-b border-gray-200 pb-4">
                Get In Touch
              </h2>

              <div className="body-text space-y-6">
                <div>
                  <h3 className="text-[20px] font-prata text-gray-900 mb-3">General Inquiries</h3>
                  <p className="mb-2">
                    For general questions, feedback, or story tips, please use the contact form or reach out via email.
                  </p>
                  <p className="text-theme-red font-graphiknormal">
                    <a href="mailto:info@themusicbugle.com" className="hover:underline">
                      info@themusicbugle.com
                    </a>
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-[20px] font-prata text-gray-900 mb-3">Press Inquiries</h3>
                  <p className="mb-2">
                    For press releases, media requests, or interview opportunities, please include &quot;Press Inquiry&quot; in your subject line.
                  </p>
                  <p className="text-theme-red font-graphiknormal">
                    <a href="mailto:press@themusicbugle.com" className="hover:underline">
                      press@themusicbugle.com
                    </a>
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-[20px] font-prata text-gray-900 mb-3">Partnerships</h3>
                  <p className="mb-2">
                    Interested in collaborating or partnering with The Music Bugle? We&apos;d love to hear from you.
                  </p>
                  <p className="text-theme-red font-graphiknormal">
                    <a href="mailto:partnerships@themusicbugle.com" className="hover:underline">
                      partnerships@themusicbugle.com
                    </a>
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-[20px] font-prata text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <a 
                      href="#" 
                      aria-label="Facebook" 
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-theme-red hover:text-white transition-colors rounded-sm"
                    >
                      <FacebookLogo />
                    </a>
                    <a 
                      href="#" 
                      aria-label="Twitter" 
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-theme-red hover:text-white transition-colors rounded-sm"
                    >
                      <TwitterLogo />
                    </a>
                    <a 
                      href="#" 
                      aria-label="Instagram" 
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-theme-red hover:text-white transition-colors rounded-sm"
                    >
                      <InstagramLogo />
                    </a>
                    <a 
                      href="#" 
                      aria-label="Pinterest" 
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-theme-red hover:text-white transition-colors rounded-sm"
                    >
                      <PinterestLogo />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <section className="mb-16 border-t border-gray-200 pt-12">
            <h2 className="text-[32px] md:text-[40px] font-prata text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-[20px] font-prata text-gray-900 mb-2">How quickly will I receive a response?</h3>
                <p className="body-text">
                  We aim to respond to all inquiries within 2-3 business days. For urgent press inquiries, please mark your email as urgent.
                </p>
              </div>
              <div>
                <h3 className="text-[20px] font-prata text-gray-900 mb-2">Do you accept story submissions?</h3>
                <p className="body-text">
                  Yes! We welcome story tips and submissions. Please use the contact form and select &quot;Story Tip&quot; as your inquiry type. Include as much detail as possible about your story idea.
                </p>
              </div>
              <div>
                <h3 className="text-[20px] font-prata text-gray-900 mb-2">Can I contribute to The Music Bugle?</h3>
                <p className="body-text">
                  We&apos;re always looking for talented writers and contributors. Please send us a message with your portfolio or writing samples, and we&apos;ll get back to you.
                </p>
              </div>
              <div>
                <h3 className="text-[20px] font-prata text-gray-900 mb-2">How can I advertise on The Music Bugle?</h3>
                <p className="body-text">
                  For advertising and sponsorship opportunities, please contact us at partnerships@themusicbugle.com with details about your brand and campaign.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
