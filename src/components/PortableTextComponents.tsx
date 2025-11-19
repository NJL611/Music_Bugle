import React from "react";
import Image from "next/image";
import { PortableTextComponents } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../../sanity/env";
import AdUnit from "./AdUnit";

const builder = imageUrlBuilder({ projectId, dataset });

export const portableTextComponents: PortableTextComponents = {
    block: {
        normal: ({ children, value }) => {
            const text = value.children.map((child: any) => child.text).join('').trim();

            const youTubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

            if (youTubeRegex.test(text)) {
                const getYouTubeId = (url: string) => {
                    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^\s&]+)/;
                    const match = url.match(regex);
                    return match ? match[1] : null;
                };

                const videoId = getYouTubeId(text);

                if (videoId) {
                    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

                    return (
                        <div className="youtube-container my-4 relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                src={embedUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute top-0 left-0 w-full h-full"
                            ></iframe>
                        </div>
                    );
                } else {
                    return (
                        <p className="text-[16px] leading-[34px] text-gray-700 mb-4 max-w-[750px] mx-auto">
                            {children}
                        </p>
                    );
                }
            }

            return (
                <p className="text-[16px] leading-[34px] text-gray-700 mb-4 max-w-[750px] mx-auto">
                    {children}
                </p>
            );
        },
        h1: ({ children }) => (
            <h1 className="text-3xl font-bold my-4">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-semibold my-3">{children}</h2>
        ),
    },
    types: {
        image: ({ value }) => {
            if (!value?.asset?._ref) {
                return null;
            }

            return (
                <>
                    <div className="mt-6 w-[95%] h-[225px] md:h-[500px] md:w-full m-auto relative group">
                        <Image
                            className="w-full h-full object-cover duration-500 my-auto absolute"
                            alt={value.alt || ''}
                            loading="lazy"
                            src={
                                builder
                                    .image(value)
                                    .width(500)
                                    .height(300)
                                    .fit('max')
                                    .auto('format')
                                    .url()
                            }
                            width={800}
                            height={450}
                        />
                    </div>
                    {value?.alt && (
                        <span className="block mb-6 text-center md:text-left text-[10px] text-gray-500 mt-1">{value.alt}</span>
                    )}
                </>
            );
        },
        imageUrl: ({ value }) => {
            return (
                <div className="mt-6 w-[95%] h-[225px] md:h-[500px] md:w-full m-auto relative group">
                    <Image src={value.url} alt={value.alt || ''} layout="fill" objectFit="cover" />
                    {value.alt && <figcaption>{value.alt}</figcaption>}
                </div>
            )
        },
        ad: () => <AdUnit />,
    },
};

