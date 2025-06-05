'use client'

import { useState } from "react";
import { SanityDocument } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import Image from "next/image";
import Button from '@/components/Button';

import { dataset, projectId } from "../../sanity/env";

export const dynamic = "force-static";

const builder = imageUrlBuilder({ projectId, dataset });

export default function MorePosts({
    posts,
    initialAmount = 4, // Start with 4 articles
}: {
    posts: SanityDocument[];
    initialAmount?: number;
}): JSX.Element {
    const [amount, setAmount] = useState(initialAmount);

    // Increases the number of visible posts by 4, capped at the total
    const handleLoadMore = () => {
        setAmount((prev) => Math.min(prev + 4, posts.length));
    };

    // Slice the list of posts to match 'amount'
    const visiblePosts = posts.slice(0, amount);

    return (
        <div className="px-4 md:px-6 xl:px-[103px] pt-8 pb-8">
            <span className="w-full text-lg mb-4 inline-block">LATEST</span>

            {/* 1 column on small screens, 2 columns on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {visiblePosts.length > 0 ? (
                    visiblePosts.map((post) => {
                        let imageUrl =
                            post.mainImage?.asset?._ref || post.mainImage?.asset?._id;
                        if (imageUrl) {
                            imageUrl = builder
                                .image(post.mainImage.asset)
                                .width(600)
                                .height(400)
                                .fit("clip")
                                .auto("format")
                                .url();
                        } else if (post.featured_image) {
                            imageUrl = post.featured_image;
                        } else {
                            imageUrl = "/carousel-Images/pexels-elviss-railijs-bitāns-1389429.jpg";
                        }

                        const formattedDate = new Date(post.publishedAt).toLocaleDateString(
                            "en-GB",
                            {
                                day: "2-digit",
                                month: "short",
                                year: "2-digit",
                            }
                        );

                        return (
                            <div key={post._id}>
                                {/* Height is 240px by default, 400px on large screens */}
                                <Image
                                    className="w-full h-[240px] lg:h-[400px] object-cover"
                                    width={600}
                                    height={400}
                                    src={imageUrl}
                                    alt={post.title || "Post Image"}
                                />
                                <Link
                                    className="inline-block"
                                    href={`article/${post.slug}` || "/"}
                                >
                                    {post?.categories?.map((category: any) => (
                                        <span
                                            key={category._id}
                                            className="inline-block text-sm text-[#808080] py-2"
                                        >
                                            {category.title}
                                        </span>
                                    ))}
                                    <div>
                                        <h2 className="text-[22px] leading-[1.5] font-bold inline-block">
                                            {post.title}
                                        </h2>
                                        {post.author && (
                                            <p className="text-sm">
                                                By <span className="bold">{post.author.name}</span> |{" "}
                                                {formattedDate}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-red-500">No posts found</div>
                )}
            </div>

            {amount < posts.length && (
                <div className="w-full flex justify-center">

                    <Button
                        text="Load More Articles"
                        onClick={handleLoadMore}
                        bgColor="#C14E4E"
                        textColor="#FFF"
                    />
                </div>
            )}
        </div>
    );
}
