import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { draftMode } from "next/headers";
import VisualEditing from "@/components/VisualEditing";
import "../../styles.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Music Bugle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {draftMode().isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
