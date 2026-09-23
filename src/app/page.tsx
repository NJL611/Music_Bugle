

import dynamic from "next/dynamic";
import type { SanityDocument } from "next-sanity";
import { client } from "@sanity/lib/client";
import { POSTS_PREVIEW_QUERY } from "@sanity/lib/queries";
import Nav from "@/components/layout/Nav";
import { distributePosts, distributePostsShowcase } from "@/lib/utils";
import { fetchTrendingPosts } from "@/lib/fetchers";
import { LeadStories, SidebarArticles } from "@/components/sections/HomeSections";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { AdUnit } from "@/components/ui/AdUnit";
import { HOMEPAGE_COUNTS, SHOWCASE_MODE } from "@/lib/constants";

export const revalidate = 600;

// Trending auto-fill has a recency cutoff and can come back short, so the date-driven sidebar tops it up.
function buildTrendingRail(trending: SanityDocument[], fallback: SanityDocument[], exclude: (SanityDocument | null)[]) {
  const seen = new Set(exclude.map((post) => post?._id));
  return [...trending, ...fallback]
    .filter((post) => {
      if (seen.has(post._id)) return false;
      seen.add(post._id);
      return true;
    })
    .slice(0, HOMEPAGE_COUNTS.SIDEBAR);
}

export default async function Home() {
  const [allPosts, trending] = await Promise.all([
    client.fetch<SanityDocument[]>(POSTS_PREVIEW_QUERY),
    fetchTrendingPosts(),
  ]);

  if (SHOWCASE_MODE) return <ShowcaseHome allPosts={allPosts} trending={trending.posts} />;

  const content = distributePosts(allPosts);
  const rail = buildTrendingRail(trending.posts, content.sidebar, [content.lead, ...content.secondary, ...content.headlines]);

  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto md:px-8 pt-6 pb-6 2xl:px-64">
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="w-full lg:flex-1 lg:min-w-0 px-4 md:px-0">
            <LeadStories lead={content.lead} secondary={content.secondary} headlines={content.headlines} />
          </div>

          <div className="w-full lg:w-[336px] lg:shrink-0 flex flex-col px-4 md:px-0">
            <AdUnit variant="sidebar" className="mb-6 rounded-sm" />

            <div className="mt-2">
              <SectionHeader title="Trending" viewAllLink="/trending" className="mb-0!" />
              <SidebarArticles posts={rail} />
            </div>
          </div>

        </div>

        <div className="px-4 md:px-0">
          <PostFeed
            posts={content.newReleases}
            title="New Releases"
            viewAllLink="/category/new-releases"
            columns={4}
            variant="grid"
          />

          <div className="w-full mt-12">
            <div className="flex flex-col lg:flex-row gap-8">

              <div className="w-full lg:w-3/4">
                <SectionHeader title="Upcoming Releases" viewAllLink="/category/upcoming-releases" />


                <div className="mb-8">
                  <PostFeed posts={content.editorsPicksLarge} columns={3} variant="grid" />
                </div>

                <PostFeed posts={content.editorsPicksSmall} columns={3} variant="list" showImage={false} />
              </div>

              <div className="w-full lg:w-1/4">
                <div className="sticky top-4">
                  <AdUnit variant="vertical" />
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>

      <SupportBanner />

      <div className={"w-full mx-auto px-4 md:px-8 py-6 2xl:px-64"}>
        <LatestPosts posts={content.latestNews} />
        <BottomSection
          posts={content.bottomSection}
          title="Music Videos"
          viewAllLink="/category/music-videos"
        />
        <MustReadSection posts={content.mustWatch} />
      </div>

      <Footer posts={allPosts} />
    </main>
  );
}

// Every section here is date-driven so it always fills; the full layout's
// category sections (news / releases / music-videos) are empty in this corpus.
function ShowcaseHome({ allPosts, trending }: { allPosts: SanityDocument[]; trending: SanityDocument[] }) {
  const content = distributePostsShowcase(allPosts);
  const rail = buildTrendingRail(trending, content.sidebar, [content.lead, ...content.secondary, ...content.headlines]);

  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto md:px-8 pt-6 pb-6 2xl:px-64">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:flex-1 lg:min-w-0 px-4 md:px-0">
            <LeadStories lead={content.lead} secondary={content.secondary} headlines={content.headlines} />
          </div>

          <div className="w-full lg:w-[336px] lg:shrink-0 flex flex-col px-4 md:px-0">
            <AdUnit variant="sidebar" className="mb-6 rounded-sm" />

            <div className="mt-2">
              <SectionHeader title="Trending" viewAllLink="/trending" className="mb-0!" />
              <SidebarArticles posts={rail} />
            </div>
          </div>
        </div>

        <div className="px-4 md:px-0">
          <PostFeed
            posts={content.featured}
            title="Q&A Interviews"
            viewAllLink="/category/q-and-a"
            columns={4}
            variant="grid"
          />
        </div>
      </div>

      <SupportBanner />

      <div className="w-full mx-auto px-4 md:px-8 py-6 2xl:px-64">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-3/4">
            <PostFeed
              posts={content.more}
              title="More Interviews & Features"
              viewAllLink="/category/q-and-a"
              columns={3}
              variant="grid"
            />
          </div>

          <div className="w-full lg:w-1/4">
            <div className="sticky top-4">
              <AdUnit variant="vertical" />
            </div>
          </div>
        </div>
      </div>

      <Footer posts={allPosts} />
    </main>
  );
}

const PostFeed = dynamic(() => import("@/components/posts/PostFeed"), {
  loading: () => <div className="w-full min-h-[200px] animate-pulse bg-gray-100 rounded-sm" />,
});

const SupportBanner = dynamic(
  () => import("@/components/sections/HomeSections").then((mod) => mod.SupportBanner),
  {
    loading: () => <div className="w-full py-16 text-center text-sm text-gray-400" />,
  },
);

const LatestPosts = dynamic(
  () => import("@/components/sections/HomeSections").then((mod) => mod.LatestPosts),
  {
    loading: () => <div className="w-full min-h-[280px] animate-pulse bg-gray-50 rounded-sm" />,
  },
);

const BottomSection = dynamic(
  () => import("@/components/sections/HomeSections").then((mod) => mod.BottomSection),
  {
    loading: () => <div className="w-full min-h-[320px] animate-pulse bg-gray-50 rounded-sm" />,
  },
);

const MustReadSection = dynamic(
  () => import("@/components/sections/HomeSections").then((mod) => mod.MustReadSection),
  {
    loading: () => <div className="w-full min-h-[240px] animate-pulse bg-gray-50 rounded-sm" />,
  },
);

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => <div className="w-full py-12 text-center text-xs text-gray-400" />,
});