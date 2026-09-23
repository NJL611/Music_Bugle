import Link from "next/link";
import Image from "next/image";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import type { SanityDocument } from "next-sanity";
import Sidebar from "@/components/layout/Sidebar";
import { AdUnit } from "@/components/ui/AdUnit";
import { ShareButtons } from "@/components/ui/Primitives";
import { portableText } from "@/components/posts/PortableText";
import { formatDate, sanityImageBuilder, usableImageUrl } from "@/lib/utils";

const AD_INTERVAL = 8;
const MIN_PARAGRAPHS_FOR_ADS = 8;
const WORDS_PER_MINUTE = 230;

interface Props {
  post: SanityDocument;
  posts: SanityDocument[];
  /** Body spacing preset; only the preview route sets it, live articles use the default. */
  spacing?: "tight" | "standard" | "airy";
}

export default function Post({ post, posts, spacing }: Props) {
  const { title, subtitle, mainImage, body, featured_image, author, publishedAt, categories } = post;
  const primaryCategory = categories?.[0];

  // WordPress imports open with a "By Author" line plus empty <p><br/></p> spacers; the header
  // already shows the author, and the Spacer block now owns deliberate gaps.
  const blockText = (b: PortableTextBlock) =>
    b._type === "block" && (b.children as any[]).every((c) => c._type === "span")
      ? (b.children as any[]).map((c) => c.text ?? "").join("").trim()
      : null;
  const firstContent = (body ?? []).findIndex((b: PortableTextBlock) => {
    const t = blockText(b);
    return !(t === "" || (t && t.length < 60 && /^(written\s+)?by\s+\S/i.test(t)));
  });
  const cleanBody: PortableTextBlock[] =
    firstContent < 0 ? [] : body.slice(firstContent).filter((b: PortableTextBlock) => blockText(b) !== "");

  const paragraphCount =
    cleanBody.filter(
      (block: PortableTextBlock) => block._type === "block" && block.style === "normal",
    ).length ?? 0;
  const shouldInsertAds = paragraphCount >= MIN_PARAGRAPHS_FOR_ADS;

  const wordCount = cleanBody.reduce(
    (n, block) => n + (blockText(block) ?? "").split(/\s+/).filter(Boolean).length,
    0,
  );
  const readMinutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));

  const authorImageUrl = author?.image?.asset
    ? sanityImageBuilder.image(author.image).width(72).height(72).fit("crop").auto("format").url()
    : null;

  const processedBody: PortableTextBlock[] = [];
  let paragraphCounter = 0;

  cleanBody.forEach((block, index) => {
    processedBody.push(block);

    if (shouldInsertAds && block._type === "block" && block.style === "normal") {
      paragraphCounter++;

      if (paragraphCounter % AD_INTERVAL === 0) {
        processedBody.push({ _type: "ad", _key: `ad-${index}`, children: [] });
      }
    }
  });

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
          <div className="mt-8 md:mt-10 text-center text-[11px] uppercase tracking-[.16em] font-graphiknormal text-theme-red">
            {primaryCategory?.slug ? (
              <Link href={`/category/${primaryCategory.slug}`} className="hover:underline underline-offset-4">
                {primaryCategory.title}
              </Link>
            ) : (
              "News"
            )}
          </div>
          {title ? (
            <h1 className="mx-auto text-[32px] md:text-[52px] md:w-[90%] text-center text-balance leading-[1.1] md:leading-[1.05] pt-3 pb-3 md:pt-4 md:pb-4 font-abril text-gray-900">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="leading-[24px] font-light mb-5 text-center text-gray-600 text-lg font-graphiklight max-w-[90%] mx-auto">
              {subtitle}
            </p>
          ) : null}

          {publishedAt ? (
            <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {authorImageUrl ? (
                  <Image
                    src={authorImageUrl}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded-full w-9 h-9 object-cover"
                  />
                ) : null}
                {/* Every node carries its own size: the global `* { font-size: 15px }` otherwise wins over inheritance. */}
                <div className="leading-snug">
                  {author?.name ? (
                    author.slug ? (
                      <Link href={`/author/${author.slug}`} className="block text-[14px] font-graphiklight text-gray-900 hover:text-theme-red transition-colors">
                        {author.name}
                      </Link>
                    ) : (
                      <span className="block text-[14px] font-graphiklight text-gray-900">{author.name}</span>
                    )
                  ) : null}
                  <span className="block text-[14px] font-graphiklight text-gray-600">
                    <time dateTime={publishedAt} className="text-[14px]">{formatDate(publishedAt)}</time>
                    {` · ${readMinutes} min read`}
                  </span>
                </div>
              </div>
              <ShareButtons
                title={title}
                className="inline-flex gap-1 shrink-0"
                itemClassName="bg-theme-red hover:bg-theme-red/90 rounded-sm w-6 h-6 text-white !important"
              />
            </div>
          ) : null}

          {mainImageUrl || usableImageUrl(featured_image) ? (
            <figure className="mb-10">
              {/* aspect-video matches the 16:9 server crop — a fixed height re-crops with object-cover
                  and cuts heads off press photos. */}
              <div className="aspect-video w-full relative">
                <Image
                  className="w-full h-full object-cover absolute"
                  width={1600}
                  height={900}
                  src={mainImageUrl || usableImageUrl(featured_image)!}
                  alt={mainImage?.alt || title || ""}
                  priority
                />
              </div>
              {mainImage?.credit ? (
                <figcaption className="text-[13px] text-gray-500 mt-2">Photo: {mainImage.credit}</figcaption>
              ) : null}
            </figure>
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
