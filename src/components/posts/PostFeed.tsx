"use client";

import Link from "next/link";
import Image from "next/image";
import type { SanityDocument } from "next-sanity";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { PostMeta } from "@/components/posts/PostMeta";
import { GRID_IMAGE_SIZES, SIDEBAR_IMAGE_SIZES } from "@/lib/constants";
import { getPostImage, formatDate, resolvePostPath } from "@/lib/utils";

const GRID_CLASS_MAP: Record<NonNullable<PostFeedProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
};

interface FeedPostRowProps {
  post: SanityDocument;
}

export function FeedPostRow({ post }: FeedPostRowProps) {
  if (!post) return null;

  const imageUrl = getPostImage(post, 400, 270);
  const category = post.categories?.[0];
  const author = post.author;

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8 group">
      {/* Image */}
      <div className="w-full md:w-[260px] shrink-0">
        <Link href={resolvePostPath(post)}>
          <div className="relative aspect-3/2 w-full overflow-hidden rounded-sm">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 260px"
            />
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center grow">
        {/* Category Label */}
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="text-theme-red text-[11px]   uppercase tracking-wider mb-2 hover:underline"
          >
            {category.title}
          </Link>
        )}

        {/* Title */}
        <Link href={resolvePostPath(post)}>
          <h2 className="text-[22px] md:text-[24px]   font-prata text-gray-900 leading-tight mb-3 group-hover:text-theme-red transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 text-[15px] leading-relaxed mb-3 font-graphiknormal line-clamp-2 md:line-clamp-3">
          {post.subtitle || post.body?.[0]?.children?.[0]?.text || "No description available."}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[12px] font-medium text-gray-600 font-graphiknormal">
          {author && (
            <div className="flex items-center gap-2">
              {/* Optional: Author Image could go here */}
              <span className="text-black">{author.name}</span>
              <span>—</span>
            </div>
          )}
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}

interface PostFeedProps {
  posts: SanityDocument[];
  title?: string;
  viewAllLink?: string;
  columns?: 1 | 2 | 3 | 4 | 5;
  variant?: "grid" | "list";
  layout?: "vertical" | "horizontal";
  showImage?: boolean;
  showCategory?: boolean;
  showAuthor?: boolean;
  imageWidth?: number;
  imageHeight?: number;
}

export default function PostFeed({
  posts,
  title,
  viewAllLink,
  columns = 4,
  variant = "grid",
  layout = "vertical",
  showImage = true,
  showCategory = false,
  showAuthor,
  imageWidth,
  imageHeight,
}: PostFeedProps) {
  if (!posts || posts.length === 0) return null;

  const gridColsClass = GRID_CLASS_MAP[columns] ?? GRID_CLASS_MAP[4];
  const isGrid = variant === "grid";
  const isHorizontal = layout === "horizontal";

  // Determine defaults if not explicitly provided
  const displayAuthor = showAuthor ?? isGrid;

  // Image dimensions
  const imgW = imageWidth ?? (isGrid ? 400 : (isHorizontal ? 124 : 300));
  const imgH = imageHeight ?? (isGrid ? 250 : (isHorizontal ? 80 : 200));

  return (
    <div className={`w-full ${isGrid ? "mt-12" : (isHorizontal ? "" : "border-t border-gray-200 pt-8")}`}>
      {title && <SectionHeader title={title} viewAllLink={viewAllLink} />}

      <div className={`grid ${gridColsClass} ${isGrid ? "gap-6" : (isHorizontal ? "gap-6" : "gap-x-6 gap-y-2")}`}>
        {posts.map((post) => {
          const imageUrl = showImage
            ? getPostImage(post, imgW, imgH)
            : null;

          if (isHorizontal) {
            // Horizontal Layout (replacing renderThumbList)
            return (
              <div key={post._id} className="flex gap-4 items-start group cursor-pointer">
                {imageUrl && (
                  <div className="relative shrink-0 overflow-hidden rounded-sm" style={{ width: imgW, height: imgH }}>
                    <Image
                      src={imageUrl}
                      alt={post.title || "Post Image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      quality={65}
                      sizes={SIDEBAR_IMAGE_SIZES}
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <Link
                    href={resolvePostPath(post)}
                    className="font-prata text-sm text-gray-900 leading-snug hover:text-theme-red transition-colors line-clamp-3"
                  >
                    {post.title}
                  </Link>
                  {showCategory && post.categories?.length ? (
                    <span className="text-[10px] text-gray-600 mt-1">{post.categories[0].title}</span>
                  ) : null}
                  <div className="mt-1">
                    <PostMeta
                      author={post.author}
                      publishedAt={post.publishedAt}
                      showAuthor={displayAuthor}
                      className="text-gray-600 text-[11px]"
                    />
                  </div>
                </div>
              </div>
            );
          }

          // Vertical Layout (Original)
          return (
            <div
              key={post._id}
              className={`flex flex-col ${!isGrid ? "border-gray-100 last:border-0" : "group cursor-pointer"
                }`}
            >
              {/* Image Section */}
              {imageUrl && (
                <Link href={resolvePostPath(post)} className="group">
                  <div
                    className={`relative w-full overflow-hidden rounded-sm ${isGrid ? "aspect-video mb-4" : "aspect-16/10 mb-3"
                      }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={post.title || "Post Image"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      sizes={GRID_IMAGE_SIZES}
                    />
                  </div>
                </Link>
              )}

              {/* Content Section */}
              <div className="flex flex-col">
                <Link href={resolvePostPath(post)}>
                  <h3
                    className={`${isGrid
                      ? "text-[18px] leading-[22px] line-clamp-3 mb-2"
                      : "text-[14px] leading-[20px] line-clamp-2 mb-2"
                      } text-black font-prata hover:text-theme-red transition-colors`}
                  >
                    {post.title}
                  </h3>
                </Link>

                <PostMeta
                  author={post.author}
                  publishedAt={post.publishedAt}
                  className={isGrid ? "text-gray-600" : "text-gray-600"}
                  showAuthor={displayAuthor}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
