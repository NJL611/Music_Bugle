import Link from "next/link";
import Image from "next/image";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import type { SanityDocument } from "next-sanity";
import Sidebar from "@/components/layout/Sidebar";
import { AdUnit } from "@/components/ui/AdUnit";
import { ShareButtons } from "@/components/ui/Primitives";
import { portableText } from "@/components/posts/PortableText";
import { PostMeta } from "@/components/posts/PostMeta";
import { sanityImageBuilder, usableImageUrl } from "@/lib/utils";

const AD_INTERVAL = 8;
const MIN_PARAGRAPHS_FOR_ADS = 8;

interface Props {
  post: SanityDocument;
  posts: SanityDocument[];
  /** Body spacing preset; only the preview route sets it, live articles use the default. */
  spacing?: "tight" | "standard" | "airy";
}

export default function Post({ post, posts, spacing }: Props) {
  const { title, subtitle, mainImage, body, featured_image, author, publishedAt, categories } = post;
  const primaryCategory = categories?.[0];

  const paragraphCount =
    body?.filter(
      (block: PortableTextBlock) => block._type === "block" && block.style === "normal",
    ).length ?? 0;
  const shouldInsertAds = paragraphCount >= MIN_PARAGRAPHS_FOR_ADS;

  const processedBody: PortableTextBlock[] = [];
  let paragraphCounter = 0;

  if (body && Array.isArray(body)) {
    body.forEach((block, index) => {
      processedBody.push(block);

      if (shouldInsertAds && block._type === "block" && block.style === "normal") {
        paragraphCounter++;

        if (paragraphCounter % AD_INTERVAL === 0) {
          processedBody.push({ _type: "ad", _key: `ad-${index}`, children: [] });
        }
      }
    });
  }

  const mainImageUrl =
    mainImage?.asset?._ref || mainImage?.asset?._id
      ? sanityImageBuilder
          .image(mainImage)
          .width(1600)
          .height(900)
          .fit("crop")
          .auto("format")
          .quality(80)
          .url()
      : null;

  return (
    <main className="mx-auto">
      <div className="py-8 md:pt-10 md:pb-6">
        <AdUnit variant="responsive-leaderboard" />
      </div>

      <div className="lg:pl-24 px-6 lg:pr-6 mx-auto mt-5 grid grid-cols-1 lg:grid-cols-8 border-b border-t border-gray-200">
        <div className="lg:col-span-6 lg:border-r border-gray-200 lg:pr-6">
          <nav
            className="mt-4 block text-[11px] uppercase tracking-widest font-graphiknormal"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-theme-red transition-colors">
              Home
            </Link>
            {" > "}
            {primaryCategory?.slug ? (
              <Link
                href={`/category/${primaryCategory.slug}`}
                className="hover:text-theme-red transition-colors"
              >
                {primaryCategory.title}
              </Link>
            ) : (
              "News"
            )}
          </nav>
          {title ? (
            <h1 className="mx-auto text-[26px] md:text-[36px] md:w-[90%] text-center leading-[1.15] md:leading-[1.1] tracking-tight pt-4 pb-3 md:pt-8 md:pb-4 font-abril text-gray-900">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="leading-[24px] font-light mb-4 text-center text-gray-600 text-lg font-graphiklight max-w-[90%] mx-auto">
              {subtitle}
            </p>
          ) : null}

          {publishedAt ? (
            <div className="flex justify-center mb-6">
              <PostMeta author={author} publishedAt={publishedAt} className="text-gray-600" linkAuthor />
            </div>
          ) : null}

          <div className="flex flex-col md:flex-row items-center justify-between mb-4 mx-auto">
            <span className="text-[11px] uppercase tracking-widest mr-3 inline-block align-middle">
              Share Post:
            </span>
            <div className="mt-4 md:mt-0">
              <ShareButtons
                title={title}
                className="inline-flex align-middle gap-1"
                itemClassName="bg-theme-red hover:bg-theme-red/90 rounded-sm w-6 h-6 text-white !important"
              />
            </div>
          </div>

          {mainImageUrl ? (
            // aspect-video matches the 16:9 server crop exactly — a fixed height re-crops with
            // object-cover, ignoring the editor's hotspot and cutting heads off press photos.
            <div className="aspect-video w-full m-auto relative group mb-10">
              <Image
                className="w-full h-full object-cover duration-500 my-auto absolute"
                width={1600}
                height={900}
                src={mainImageUrl}
                alt={mainImage?.alt || title || ""}
                priority
              />
            </div>
          ) : usableImageUrl(featured_image) ? (
            <div className="h-[300px] md:h-[549px] w-full m-auto relative group mb-10">
              <Image
                className="w-full h-full object-cover duration-500 my-auto absolute"
                width={1920}
                height={2000}
                src={usableImageUrl(featured_image)!}
                alt={title || ""}
                priority
              />
            </div>
          ) : null}
          {body ? (
            <div className="w-full flex justify-center">
              <div className="body-text node-content-body mx-auto mb-8" data-spacing={spacing}>
                <PortableText value={processedBody} components={portableText} />
              </div>
            </div>
          ) : null}
        </div>
        <div className="md:col-span-2 relative">
          <Sidebar posts={posts} />
        </div>
      </div>
    </main>
  );
}
