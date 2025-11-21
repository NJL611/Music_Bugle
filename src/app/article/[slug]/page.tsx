import { SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";
import { loadQuery } from "../../../../sanity/lib/store";
import { POSTS_QUERY, POST_QUERY } from "../../../../sanity/lib/queries";
import Post from "@/components/Post";
import PostPreview from "@/components/PostPreview";
import { client } from "../../../../sanity/lib/client";
import Nav from "@/components/Nav";
import ExtendMetadata from "../../../components/ExtendMetadata";
import Footer from "@/components/Footer";
import Disqus from "@/components/Disqus";
import AdUnit from "@/components/AdUnit";
import TwitterLogo from "public/svgs/TwitterLogo";
import FacebookLogo from "public/svgs/FacebookLogo";
import PinterestLogo from "public/svgs/PinterestLogo";
import MailIcon from "public/svgs/MailIcon";
import InstagramLogo from "public/svgs/InstagramLogo";
import Link from "next/link";

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY);

  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string; }; }) {
  const slug = params.slug;

  try {
    const data = await client.fetch(POST_QUERY, { slug });
    const meta = data;

    if (!meta) {
      return {
        title: 'Not Found',
        description: 'The page you are looking for does not exist.',
        image: 'https://themusicbugle.com/og-preview.jpg',
        keywords: 'music, news, latest updates',
        author: 'The Music Bugle',
        publishedTime: '',
        modifiedTime: '',
      };
    }

    return {
      title: meta.title || 'No Title',
      description: meta.description || 'No Description',
      image: meta.mainImage?.asset.url || 'https://themusicbugle.com/og-preview.jpg',
      keywords: meta.keywords || 'music, news, latest updates',
      author: meta.author.name || 'The Music Bugle',
      publishedTime: meta.publishedAt || '',
      modifiedTime: meta._updatedAt || '',
      openGraph: {
        title: meta.title,
        description: meta.description || 'Your source for the latest music news.',
        url: process.env.SITE_URL || 'https://themusicbugle.com',
        locale: 'en-US',
        siteName: meta.title,
        type: 'article',
        images: [
          {
            url: meta.mainImage?.asset.url || 'https://themusicbugle.com/og-preview.jpg',
          },
        ],
        author: meta.author.name || 'The Music Bugle',
        published_time: meta.publishedAt || '',
        modified_time: meta._updatedAt || '',
      },
      twitter: {
        title: meta.title,
        description: meta.description || 'Your source for the latest music news.',
        images: meta.mainImage?.asset.url || 'https://themusicbugle.com/og-preview.jpg',
        card: 'summary_large_image',
        site: '@TheMusicBugle',
      },
      alternates: {
        canonical: process.env.SITE_URL || 'https://themusicbugle.com',
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
      image: 'https://themusicbugle.com/og-preview.jpg',
      keywords: 'music, news, latest updates',
      author: 'The Music Bugle',
      publishedTime: '',
      modifiedTime: '',
    };
  }
}

export default async function Page({ params }: { params: { slug: string; }; }) {
  const initial = await loadQuery<SanityDocument>(POST_QUERY, params, {
    perspective: draftMode().isEnabled ? "previewDrafts" : "published",
  });

  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY);

  const metadata = await generateMetadata({ params });

  return draftMode().isEnabled ? (
    <PostPreview initial={initial} params={params} />
  ) : (
    <>
      <ExtendMetadata meta={metadata} />
      <Nav />
      <Post post={initial.data} posts={posts} />
      <div className="w-full lg:pl-24 px-6 lg:pr-12 py-8 border-b">
        <span className="block text-lg mb-5">Share this:</span>
        <div className="flex gap-2">
          <a href="#" aria-label="Twitter" className="flex justify-center rounded-full items-center w-6 h-6 bg-black">
            <div className="transform scale-[0.75]">
              <TwitterLogo />
            </div>
          </a>
          <a href="#" aria-label="Facebook" className="flex justify-center rounded-full items-center w-6 h-6 bg-black">
            <div className="transform scale-[0.75]">
              <FacebookLogo />
            </div>
          </a>
          <a href="#" aria-label="Pinterest" className="flex justify-center rounded-full items-center w-6 h-6 bg-black">
            <div className="transform scale-[0.75]">
              <PinterestLogo />
            </div>
          </a>
          <a href="#" aria-label="Mail" className="flex justify-center rounded-full items-center w-6 h-6 bg-black">
            <div className="transform scale-[0.75]">
              <MailIcon />
            </div>
          </a>
          <a href="#" aria-label="Instagram" className="flex justify-center rounded-full items-center w-6 h-6 bg-black">
            <div className="transform scale-[0.8]">
              <InstagramLogo />
            </div>
          </a>
        </div>
      </div>
      <div className="w-full lg:pl-24 px-6 lg:pr-12 py-8 border-b">
        <span className="block text-lg mb-4">Tags:</span>
        <div className="flex gap-2 flex-wrap">
          {initial.data?.tags?.map((tag: any) => (
            <span key={tag._id} className="px-2 py-1 bg-gray-100 rounded-full text-sm whitespace-nowrap">
              {tag.title}
            </span>
          ))}
        </div>
      </div>
      <div className="lg:px-24 mx-auto pt-8 pb-10 px-6">
        <Disqus post={initial.data} />
      </div>
      <AdUnit width="w-[320px] md:w-[728px] lg:w-[970px]" height="h-[50px] md:h-[90px] lg:h-[90px]" />
      <Footer />
    </>
  );
}
