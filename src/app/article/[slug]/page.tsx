import Link from "next/link";
import { notFound } from "next/navigation";
import nextDynamic from "next/dynamic";
import type { SanityDocument } from "next-sanity";
import { POSTS_PREVIEW_QUERY, POST_QUERY } from "@sanity/lib/queries";
import { client } from "@sanity/lib/client";
import Nav from "@/components/layout/Nav";
import { AdUnit } from "@/components/ui/Primitives";
import { MoreLikeThis } from "@/components/sections/PostSections";
import Post from "@/components/posts/Post";
import { SITE_URL, METADATA, AD_SIZES } from "@/lib/constants";

export const dynamic = 'force-static';
export const revalidate = 600;


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch<SanityDocument>(POST_QUERY, { slug });

  if (!post) {
    notFound();
  }

  const posts = await client.fetch<SanityDocument[]>(POSTS_PREVIEW_QUERY);
  const metadata = await generateMetadata({ params });

  return (
    <>
      <Nav />
      <Post post={post} posts={posts} />
      <div className="w-full lg:pl-24 px-6 lg:pr-12 py-8 border-b border-gray-200">
        <span className="block text-lg mb-4 font-prata  ">Tags:</span>
        <div className="flex gap-2 flex-wrap">
          {post?.tags?.map((tag: any) => {
            if (tag.slug) {
              return (
                <Link href={`/tag/${tag.slug}`} key={tag._id} className="px-3 py-1 bg-gray-100 hover:bg-theme-red hover:text-white transition-colors rounded-full text-sm font-graphiknormal whitespace-nowrap">
                  {tag.title}
                </Link>
              );
            }
            return (
              <span key={tag._id} className="px-3 py-1 bg-gray-100 rounded-full text-sm font-graphiknormal whitespace-nowrap text-gray-500">
                {tag.title}
              </span>
            );
          })}
        </div>
      </div>
      <div className="lg:px-24 mx-auto pb-10 px-6">
        <MoreLikeThis posts={posts} currentPostId={post._id} />
      </div>
      <div className="lg:px-24 mx-auto pt-8 pb-10 px-6">
        <Disqus post={post} />
      </div>
      <AdUnit width={AD_SIZES.LEADERBOARD.width} height={AD_SIZES.LEADERBOARD.height} />
      <Footer />
    </>
  );
}


export async function generateStaticParams() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_PREVIEW_QUERY);

  return posts
    .map((post) => post?.slug?.current)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const data = await client.fetch(POST_QUERY, { slug });
    const meta = data;

    if (!meta) {
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.',
        image: METADATA.image,
        keywords: 'music, news, latest updates',
        author: METADATA.title,
        publishedTime: '',
        modifiedTime: '',
      };
    }

    return {
      title: meta.title || 'No Title',
      description: meta.description || 'No Description',
      image: meta.mainImage?.asset.url || METADATA.image,
      keywords: meta.keywords || 'music, news, latest updates',
      author: meta.author.name || METADATA.title,
      publishedTime: meta.publishedAt || '',
      modifiedTime: meta._updatedAt || '',
      openGraph: {
        title: meta.title,
        description: meta.description || METADATA.description,
        url: SITE_URL,
        locale: 'en-US',
        siteName: meta.title,
        type: 'article',
        images: [
          {
            url: meta.mainImage?.asset.url || METADATA.image,
          },
        ],
        author: meta.author.name || METADATA.title,
        published_time: meta.publishedAt || '',
        modified_time: meta._updatedAt || '',
      },
      twitter: {
        title: meta.title,
        description: meta.description || METADATA.description,
        images: meta.mainImage?.asset.url || METADATA.image,
        card: 'summary_large_image',
        site: METADATA.twitterHandle,
      },
      alternates: {
        canonical: SITE_URL,
      },
      robots: {
        index: true,
        follow: true,
        nocache: true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist.',
      image: METADATA.image,
      keywords: 'music, news, latest updates',
      author: METADATA.title,
      publishedTime: '',
      modifiedTime: '',
    };
  }
}

const Disqus = nextDynamic(() => import('@/components/sections/PostSections').then(mod => mod.Disqus), {
  loading: () => (
    <div className="text-center text-sm text-gray-500 py-8" />
  ),
});

const Footer = nextDynamic(() => import('@/components/layout/Footer'), {
  loading: () => (
    <div className="w-full py-12 text-center text-xs text-gray-400" />
  ),
});
