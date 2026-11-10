import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ListingPage, listingMetadata, parseListingSegments } from "@/components/layout/ListingPage";

// Category archive, paginated: /category/<slug> and /category/<slug>/page/N.
// Thin or stale categories render but are noindexed and kept out of the sitemap (see listingRobots).

type PageProps = { params: Promise<{ slug: string; pagination?: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, pagination } = await params;
  const page = parseListingSegments(pagination);
  return page ? listingMetadata("category", slug, page) : { title: "Not Found" };
}

export const revalidate = 3600;

// Without this Next renders every hit dynamically (no-store), and bot crawls burned the Sanity API CDN quota.
export async function generateStaticParams() {
  return [];
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug, pagination } = await params;
  const page = parseListingSegments(pagination);
  if (!page) notFound();
  return <ListingPage kind="category" slug={slug} page={page} />;
}
