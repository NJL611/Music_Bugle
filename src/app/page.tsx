import Carousel from "@/components/Carousel";
import Nav from "@/components/Nav";
import useWindowUtils from "@/hooks/useWindowUtils";

import { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";

import Posts from "../components/Posts";
import PostsPreview from "../components/PostPreview";
import { loadQuery } from "../../sanity/lib/store";
import { POSTS_QUERY } from "../../sanity/lib/queries";

export default async function Home() {
  const initial: any = await loadQuery<SanityDocument[]>(POSTS_QUERY, {}, {
    perspective: draftMode().isEnabled ? "previewDrafts" : "published",
  });


  // const { loaded } = useWindowUtils();

  return (
    <main className="flex flex-col items-center w-full">
      {/* {loaded && ( */}
      <>
        <Nav />
        <Carousel />
        {draftMode().isEnabled ? (
          <PostsPreview initial={initial} params={[]} />
        ) : (
          <Posts posts={initial.data} />
        )}
      </>
      {/* )} */}
    </main>
  );
}
