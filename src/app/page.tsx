import Carousel from "@/components/Carousel";
import Nav from "@/components/Nav";
import useWindowUtils from "@/hooks/useWindowUtils";
import Image from "next/image";

import { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";

import Posts from "../components/Posts";
import PostsPreview from "../components/PostPreview";
import { loadQuery } from "../../sanity/lib/store";
import { POSTS_QUERY } from "../../sanity/lib/queries";
import Footer from "@/components/Footer";
import FeaturedPost from "@/components/FeaturedPost";
import MorePosts from "@/components/MorePosts";
import TrendingTopics from "@/components/TrendingTopics";
import LatestNews from "@/components/LatestNews";
import NewArtists from "@/components/NewArtists";


export default async function Home() {
  const initial: any = await loadQuery<SanityDocument[]>(POSTS_QUERY, {}, {
    perspective: draftMode().isEnabled ? "previewDrafts" : "published",
  });

  // const { loaded } = useWindowUtils();

  return (
    <main>
      <>
        <Nav />
        {draftMode().isEnabled ? (
          <>
            <Carousel posts={initial.data} />
            <PostsPreview initial={initial} params={[]} />
          </>
        ) : (
          <>
            <div className="xl:px-[48px] px-4 md:px-4 lg:px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Left column - 3/4 width */}
                <div className="md:col-span-3">
                  <Carousel posts={initial.data} />
                  <div className="mt-10">
                    <FeaturedPost posts={initial.data} />
                  </div>
                  <div className="mt-10">
                    {/* <LatestNews posts={initial.data} /> */}
                  </div>
                </div>

                {/* Right column - 1/4 width */}
                <div className="md:col-span-1 mt-6 md:mt-0">
                  <div className="mb-6">
                    <div className="relative h-[200px] mb-3">
                      <Image
                        className="w-full h-full object-cover"
                        width={300}
                        height={200}
                        src="/carousel-Images/pexels-elviss-railijs-bitāns-1389429.jpg"
                        alt="How Techno Took Over the World"
                      />
                    </div>
                    <h2 className="text-xl font-bold mb-2">How Techno Took Over the World</h2>
                    <p className="text-sm text-gray-600 mb-1">By John Smith</p>
                    <p className="text-xs text-gray-500 mb-4">3 hours ago</p>
                  </div>

                  <div className="mb-6">
                    <div className="relative h-[200px] mb-3">
                      <Image
                        className="w-full h-full object-cover"
                        width={300}
                        height={200}
                        src="/carousel-Images/pexels-elviss-railijs-bitāns-1389429.jpg"
                        alt="Album Review"
                      />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Album Review–Songs About Stuff</h2>
                    <p className="text-sm text-gray-600 mb-1">By Emily White</p>
                    <p className="text-xs text-gray-500 mb-6">5 hours ago</p>
                  </div>
                  <div className="mb-6">
                    <div className="relative h-[200px] mb-3">
                      <Image
                        className="w-full h-full object-cover"
                        width={300}
                        height={200}
                        src="/carousel-Images/pexels-elviss-railijs-bitāns-1389429.jpg"
                        alt="Album Review"
                      />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Album Review–Songs About Stuff</h2>
                    <p className="text-sm text-gray-600 mb-1">By Emily White</p>
                    <p className="text-xs text-gray-500 mb-6">5 hours ago</p>
                  </div>

                  {/* <TrendingTopics /> */}
                  {/* <NewArtists posts={initial.data} /> */}
                </div>
              </div>
            </div>

            <Posts posts={initial.data} />
            <MorePosts posts={initial.data} />
            <Footer />
          </>
        )}
      </>
    </main>
  );
}
