import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ListingPage, listingMetadata, parseListingSegments } from "@/components/layout/ListingPage";

// Author profile and archive: bio, then every article, paginated (/author/<slug>/page/N).
// Indexed so the byline's author.url in each article's JSON-LD leads to a real page, not a noindexed stub.

type PageProps = { params: Promise<{ slug: string; pagination?: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, pagination } = await params;
  const page = parseListingSegments(pagination);
  return page ? listingMetadata("author", slug, page) : { title: "Not Found" };
}

export const revalidate = 3600;

// Without this Next renders every hit dynamically (no-store), and bot crawls burned the Sanity API CDN quota.
export async function generateStaticParams() {
  return [];
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug, pagination } = await params;
  const page = parseListingSegments(pagination);
  if (!page) notFound();
  return <ListingPage kind="author" slug={slug} page={page} />;
}
