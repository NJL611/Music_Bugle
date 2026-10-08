// Cookie preferences page: ad and cookie opt-outs for everyone, plus Google's consent settings for EEA/UK/Swiss visitors only.
// Sets its own canonical: the root layout no longer provides one.

import dynamic from "next/dynamic";
import Nav from "@/components/layout/Nav";
import { ConsentSettings } from "@/components/layout/ConsentSettings";
import { SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookie Preferences",
    description: "Manage your cookie settings for The Music Bugle.",
    openGraph: {
        title: "Cookie Preferences - The Music Bugle",
        description: "Manage your cookie settings for The Music Bugle.",
        url: `${SITE_URL}/consent-preferences`,
        type: "website",
    },
    alternates: { canonical: `${SITE_URL}/consent-preferences` },
};

const Footer = dynamic(() => import("@/components/layout/Footer"), {
    loading: () => (
        <div className="w-full py-12 text-center text-xs text-gray-400" />
    ),
});

export default function ConsentPreferencesPage() {
    return (
        <main className="bg-white min-h-screen">
            <Nav />

            <div className="min-h-[90vh] flex flex-col before:flex-1 after:flex-[7] w-full mx-auto px-8 pt-16 pb-12 2xl:px-64">
                <div className="w-full max-w-4xl mx-auto">
                    <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-6 leading-tight">
                        Cookie Preferences
                    </h1>

                    <div className="body-text space-y-8">
                        <ConsentSettings buttonClassName="text-theme-red hover:underline font-graphiknormal text-lg" />

                        <p className="mb-4">
                            You can opt out of personalized advertising at{" "}
                            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-theme-red hover:underline">Google Ad Settings</a>{" "}
                            and{" "}
                            <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-theme-red hover:underline">aboutads.info choices</a>, and you can block or delete cookies in your browser settings. See our{" "}
                            <a href="/privacy" className="text-theme-red hover:underline">Privacy Policy</a> for details.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
