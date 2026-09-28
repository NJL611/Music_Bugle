import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";

// Support route shell and its metadata (title, description, canonical).
// Metadata lives here because support/page.tsx is a client component and can't export it.

export const metadata: Metadata = {
    title: "Support Independent Music Journalism",
    description: "Support The Music Bugle with a one-time or monthly contribution and help keep independent music coverage going.",
    alternates: { canonical: `${SITE_URL}/support` },
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    )
}
