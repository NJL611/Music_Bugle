import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, SUPPORT_PAYMENTS_ENABLED } from "@/lib/constants";

// Support route shell and its metadata (title, description, canonical).
// Metadata lives here because support/page.tsx is a client component and can't export it.

export const metadata: Metadata = {
    title: "Support Independent Music Journalism",
    description: "Support The Music Bugle with a one-time contribution and help keep independent music coverage going.",
    alternates: { canonical: `${SITE_URL}/support` },
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Gated here because page.tsx is a client component and can't call notFound() during the server render.
    if (!SUPPORT_PAYMENTS_ENABLED) notFound();
    return (
        <div className="min-h-screen">
            {children}
        </div>
    )
}
