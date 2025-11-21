import Carousel from "@/components/Carousel";
import Nav from "@/components/Nav";
import { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";
import PostsPreview from "../components/PostPreview";
import { loadQuery } from "../../sanity/lib/store";
import { POSTS_QUERY } from "../../sanity/lib/queries";
import Footer from "@/components/Footer";
import { distributePosts } from "@/utils/postHelpers";
import PostGrid from "@/components/PostGrid";
import PostList from "@/components/PostList";
import AdUnit from "@/components/AdUnit";

import {
  TopStory,
  SidebarAd,
  SidebarArticles,
  SupportBanner,
  StickyAd,
  SectionHeader,
  LatestPosts,
  BottomSection,
  VideoSection
} from "@/components/HomeSections";

export default async function Home() {
  const initial: any = await loadQuery<SanityDocument[]>(POSTS_QUERY, {}, {
    perspective: draftMode().isEnabled ? "previewDrafts" : "published",
  });

  const allPosts = initial.data || [];
  const content = distributePosts(allPosts);

  const containerClass = "w-full mx-auto px-8 py-6 2xl:px-64";

  return (
    <main className="bg-white min-h-screen">
      <Nav />

      {/* <AdUnit width="w-full" height="h-[386px]" className="mx-auto" /> */}

      <div className={containerClass}>
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <div className="w-full rounded-sm overflow-hidden">
              <Carousel posts={content.carousel} />
            </div>

            {content.topStory && <TopStory post={content.topStory} />}
          </div>

          <div className="w-full lg:w-[31%] flex flex-col">
            <SidebarAd />
            <div className="mt-2">
              <h4 className="text-lg font-bold font-prata mb-4 border-b border-gray-200 pb-2">Latest News</h4>
              <SidebarArticles posts={content.sidebar} />
            </div>
          </div>

        </div>

        <PostGrid
          posts={content.newReleases}
          title="New Releases"
          viewAllLink="/new-releases"
          columns={4}
        />

        <div className="w-full mt-12">
          <div className="flex flex-col lg:flex-row gap-8">

            <div className="w-full lg:w-3/4">
              <SectionHeader title="Must Read" viewAllLink="/must-read" />

              <div className="mb-8">
                <PostGrid posts={content.editorsPicksLarge} columns={3} />
              </div>

              <PostList posts={content.editorsPicksSmall} columns={3} />
            </div>

            <div className="w-full lg:w-1/4">
              <StickyAd />
            </div>
          </div>
        </div>

      </div>

      <SupportBanner />

      <div className={containerClass}>
        {draftMode().isEnabled ? (
          <PostsPreview initial={initial} params={[]} />
        ) : (
          <>
            <LatestPosts posts={content.latestNews} />
            <BottomSection posts={content.bottomSection} />
            <VideoSection posts={content.mustWatch} />
          </>
        )}
      </div>

      <Footer posts={allPosts} />
    </main>
  );
}
