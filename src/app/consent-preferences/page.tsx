import dynamic from "next/dynamic";
import Nav from "@/components/layout/Nav";
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

            <div className="w-full mx-auto px-8 py-12 2xl:px-64">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-6 leading-tight">
                        Cookie Preferences
                    </h1>

                    <div className="body-text space-y-8">
                        <p className="mb-4">
                            You can manage your cookie preferences at any time by clicking the link below. This allows you to adjust how we collect and use your data via cookies while you visit our website.
                        </p>

                        <p className="mb-8">
                            <a href="#" className="termly-display-preferences text-theme-red hover:underline font-graphiknormal text-lg">
                                Manage Cookie Preferences
                            </a>
                        </p>

                        <p className="mb-4 text-sm text-gray-500">
                            If the preference center does not open, please ensure you have not blocked the consent management script.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
