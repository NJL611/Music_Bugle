import Carousel from "@/components/Carousel";
import Nav from "@/components/Nav";
import type { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";
import dynamic from "next/dynamic";
import { loadQuery } from "../../sanity/lib/store";
import { POSTS_QUERY } from "../../sanity/lib/queries";
import { distributePosts } from "@/utils/postHelpers";
import {
  TopStory,
  SidebarAd,
  SidebarArticles,
  StickyAd,
  SectionHeader,
} from "@/components/HomeSections";

const PostGrid = dynamic(() => import("@/components/PostGrid"), {
  loading: () => <div className="w-full min-h-[200px] animate-pulse bg-gray-100 rounded-sm" />,
});

const PostList = dynamic(() => import("@/components/PostList"), {
  loading: () => <div className="w-full min-h-[160px] animate-pulse bg-gray-100 rounded-sm" />,
});

const SupportBanner = dynamic(
  () => import("@/components/HomeSections").then((mod) => mod.SupportBanner),
  {
    ssr: false,
    loading: () => <div className="w-full py-16 text-center text-sm text-gray-400">Loading supporter info…</div>,
  },
);

const LatestPosts = dynamic(
  () => import("@/components/HomeSections").then((mod) => mod.LatestPosts),
  {
    ssr: false,
    loading: () => <div className="w-full min-h-[280px] animate-pulse bg-gray-50 rounded-sm" />,
  },
);

const BottomSection = dynamic(
  () => import("@/components/HomeSections").then((mod) => mod.BottomSection),
  {
    ssr: false,
    loading: () => <div className="w-full min-h-[320px] animate-pulse bg-gray-50 rounded-sm" />,
  },
);

const VideoSection = dynamic(
  () => import("@/components/HomeSections").then((mod) => mod.VideoSection),
  {
    ssr: false,
    loading: () => <div className="w-full min-h-[240px] animate-pulse bg-gray-50 rounded-sm" />,
  },
);

const PostsPreview = dynamic(() => import("../components/PostPreview"), {
  ssr: false,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => <div className="w-full py-12 text-center text-xs text-gray-400">Loading footer…</div>,
});

export const revalidate = 600;

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
