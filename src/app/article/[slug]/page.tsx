import { QueryParams, SanityDocument } from "next-sanity";
import { draftMode } from "next/headers";
import { loadQuery } from "../../../../sanity/lib/store";
import { POSTS_QUERY, POST_QUERY } from "../../../../sanity/lib/queries";
import Post from "@/components/Post";
import PostPreview from "@/components/PostPreview";
import { client } from "../../../../sanity/lib/client";
import Nav from "@/components/Nav";
import ExtendMetadata from "../../../components/ExtendMetadata";
import Footer from "@/components/Footer";

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY);

  // posts.map((post) => {
  //   console.log(post._updatedAt);
  // });

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

  const metadata = await generateMetadata({ params });

  // console.log('metadata', metadata);

  return draftMode().isEnabled ? (
    <PostPreview initial={initial} params={params} />
  ) : (
    <>
      <ExtendMetadata meta={metadata} />
      <Nav />
      <Post post={initial.data} />
      <Footer />
    </>
  );
}
