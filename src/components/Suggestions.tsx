import React from "react";
import Image from "next/image";
import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../../sanity/env";
import { SanityDocument } from '@sanity/client';

const builder = imageUrlBuilder({ projectId, dataset });

export default function Suggestions({ posts }: { posts: SanityDocument[] }) {
    return (
        <div className="w-full lg:px-6 py-2 border-t lg:border-0">

            <div className="mx-auto mt-5 bg-[#D9D9D9] w-[300px] md:w-[336px] z-10">
                <div className="h-[20px]">
                    <span className="px-2 text-left text-[10px] text-gray-500">Advertisement</span>
                </div>
                <div className="bg-[#D9D9D9] h-[250px] md:h-[280px]" />
            </div>

            <div className="">
                <div className="border-b mt-6 mb-5" />
                <span className="text-lg mb-4">Related Articles</span>
                <div className="mx-auto grid grid-cols-2 lg:grid-cols-1 gap-4 items-stretch">
                    {posts?.length > 0 ? (
                        posts.map((post, index) => {
                            const imageUrl =
                                builder.image(post.mainImage?.asset)
                                    .width(298)
                                    .height(192)
                                    .fit('crop')
                                    .auto('format')
                                    .url() ?? '/path/to/default/image.jpg';
                            return (
                                <div
                                    key={post._id}
                                    className={`h-full flex flex-col py-4 ${index === posts.length - 1 ? '' : 'border-b'
                                        } ${index === posts.length - 2 ? 'max-md:border-0' : ''
                                        } md:border-0`}
                                >
                                    <Link
                                        className="w-full h-full flex flex-col"
                                        href={`${post.slug}` || '/'}
                                    >
                                        <div className="flex-shrink-0">
                                            <Image
                                                className="w-full min-w-[150px] h-auto object-cover"
                                                width={298}
                                                height={192}
                                                src={imageUrl}
                                                alt={post.title || 'Post Image'}
                                            />
                                        </div>
                                        <div className="flex-1 flex">
                                            <span className="w-full pt-1 text-[12.5px] md:text-[15px] font-bold block flex-1">
                                                {post.title}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-red-500">No posts found</div>
                    )}
                </div>
            </div>


            {/* Trending Section */}
            <div className="">
                <div className="border-b mt-6 mb-5" />
                <span className="text-lg mb-4">Trending</span>
                <div className="mx-auto grid grid-cols-2 lg:grid-cols-1 gap-4 items-stretch">
                    {posts?.length > 0 ? (
                        posts.map((post, index) => {
                            const imageUrl =
                                builder.image(post.mainImage?.asset)
                                    .width(298)
                                    .height(192)
                                    .fit('crop')
                                    .auto('format')
                                    .url() ?? '/path/to/default/image.jpg';
                            return (
                                <div
                                    key={post._id}
                                    className={`h-full flex flex-col py-4 ${index === posts.length - 1 ? '' : 'border-b'
                                        } ${index === posts.length - 2 ? 'max-md:border-0' : ''
                                        } md:border-0`}
                                >
                                    <Link
                                        className="w-full h-full flex flex-col"
                                        href={`${post.slug}` || '/'}
                                    >
                                        <div className="flex-shrink-0">
                                            <Image
                                                className="w-full min-w-[150px] h-auto object-cover"
                                                width={298}
                                                height={192}
                                                src={imageUrl}
                                                alt={post.title || 'Post Image'}
                                            />
                                        </div>
                                        <div className="flex-1 flex">
                                            <span className="w-full pt-1 text-[12.5px] md:text-[15px] font-bold block flex-1">
                                                {post.title}
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-red-500">No posts found</div>
                    )}
                </div>
            </div>
        </div>
    );
}
