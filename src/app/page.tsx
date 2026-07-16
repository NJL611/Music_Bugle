

import dynamic from "next/dynamic";
import type { SanityDocument } from "next-sanity";
import { client } from "@sanity/lib/client";
import { POSTS_PREVIEW_QUERY } from "@sanity/lib/queries";
import Nav from "@/components/layout/Nav";
import { distributePosts } from "@/lib/utils";
import { TopStory, SidebarArticles } from "@/components/sections/HomeSections";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { AdUnit } from "@/components/ui/AdUnit";
import { AD_SIZES } from "@/lib/constants";

export const revalidate = 600;

export default async function Home() {
  const allPosts = await client.fetch<SanityDocument[]>(POSTS_PREVIEW_QUERY);
  const content = distributePosts(allPosts);

  return (
    <main className="bg-white min-h-screen">
      <Nav />

      <div className="w-full mx-auto md:px-8 md:pt-6 pb-6 2xl:px-64">
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <div className="w-full md:overflow-hidden md:rounded-sm">
              <Carousel posts={content.carousel} />
            </div>

            <div className="px-4 md:px-0">
              {content.topStory && <TopStory post={content.topStory} />}
            </div>
          </div>

          <div className="w-full lg:w-[31%] flex flex-col px-4 md:px-0">
            <AdUnit variant="sidebar" className="mb-6 rounded-sm" />

            <div className="mt-2">
              <h4 className="text-lg   font-prata mb-4 border-b border-gray-200 pb-2">Latest News</h4>
              <SidebarArticles posts={content.sidebar} />
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

const Carousel = dynamic(
  () => import("@/components/sections/HomeSections").then((mod) => mod.Carousel),
  {
    loading: () => <div className="w-full aspect-video md:aspect-auto md:h-[450px] bg-[#444444] animate-pulse" />,
  },
);

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