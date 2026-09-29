// Author profile: name, bio. Standalone (no post feed) while the site has a single author —
// the feed duplicated the homepage; bring FeedLayout back if contributors are added.
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import Nav from "@/components/layout/Nav";
import { fetchAuthorData } from "@/lib/fetchers";
import { METADATA, SITE_URL } from "@/lib/constants";
import { bioToText } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => (
    <div className="w-full py-12 text-center text-xs text-gray-400" />
  ),
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await fetchAuthorData(slug);

  if (!author) {
    return { title: "Author Not Found" };
  }

  const description = bioToText(author.bio) || `${author.name}, ${METADATA.title}.`;
  const url = `${SITE_URL}/author/${slug}`;

  return {
    title: author.name,
    description,
    openGraph: {
      title: `${author.name} - ${METADATA.title}`,
      description,
      url,
      type: "profile",
    },
    alternates: { canonical: url },
    // bio-only page is thin; keep it out of the index (and sitemap) but let crawlers follow links
    robots: { index: false, follow: true },
  };
}

export const revalidate = 3600;

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = await fetchAuthorData(slug);

  if (!author) {
    notFound();
  }

  const bio = bioToText(author.bio);

  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto px-8 py-12 2xl:px-64">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[42px] md:text-[56px] font-abril text-gray-900 mb-2 leading-tight">
            {author.name}
          </h1>
          <p className="text-sm uppercase tracking-widest text-gray-500 font-graphiknormal mb-8">
            Creator, {METADATA.title}
          </p>
          {bio && (
            <p className="text-lg md:text-xl text-gray-600 font-graphiklight leading-relaxed text-left md:text-center">
              {bio}
            </p>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
