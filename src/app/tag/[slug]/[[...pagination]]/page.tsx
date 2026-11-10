import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ListingPage, listingMetadata, parseListingSegments } from "@/components/layout/ListingPage";

// Tag archive, paginated: /tag/<slug> and /tag/<slug>/page/N.
// Tags under 3 posts are noindexed; tags with no live posts 404 (pruning posts leaves many behind).

type PageProps = { params: Promise<{ slug: string; pagination?: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, pagination } = await params;
  const page = parseListingSegments(pagination);
  return page ? listingMetadata("tag", slug, page) : { title: "Not Found" };
}

export const revalidate = 3600;

// Without this Next renders every hit dynamically (no-store), and bot crawls burned the Sanity API CDN quota.
export async function generateStaticParams() {
  return [];
}

export default async function TagPage({ params }: PageProps) {
  const { slug, pagination } = await params;
  const page = parseListingSegments(pagination);
  if (!page) notFound();
  return <ListingPage kind="tag" slug={slug} page={page} />;
}
