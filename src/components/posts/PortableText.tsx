import Image from "next/image";
import { PortableTextComponents } from "@portabletext/react";
import { AdUnit } from "@/components/ui/AdUnit";
import { sanityImageBuilder } from "@/lib/utils";
import { YOUTUBE_REGEX, YOUTUBE_ID_REGEX } from "@/lib/constants";

export function getYouTubeId(url: string): string | null {
    return url.match(YOUTUBE_ID_REGEX)?.[1] ?? null;
}

function YouTubeEmbed({ videoId }: { videoId: string }) {
    return (
        <div className="youtube-container my-6 relative max-w-[750px] mx-auto" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
            ></iframe>
        </div>
    );
}

export const portableText: PortableTextComponents = {
    block: {
        normal: ({ children, value }) => {
            const text = value.children.map((child: any) => child.text).join('').trim();

            if (YOUTUBE_REGEX.test(text)) {
                const videoId = getYouTubeId(text);
                if (videoId) return <YouTubeEmbed videoId={videoId} />;
            }

            return <p>{children}</p>;
        },
        // Size, measure and margins all live in styles.css under `.node-content-body >` so the
        // spacing presets can drive them from one place. Deliberately classless here.
        h1: ({ children }) => <h1>{children}</h1>,
        h2: ({ children }) => <h2>{children}</h2>,
        h3: ({ children }) => <h3>{children}</h3>,
        h4: ({ children }) => <h4>{children}</h4>,
        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    },
    list: {
        bullet: ({ children }) => <ul>{children}</ul>,
        number: ({ children }) => <ol>{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li>{children}</li>,
        number: ({ children }) => <li>{children}</li>,
    },
    marks: {
        link: ({ children, value }) => {
            const href = value?.href || '';
            const isExternal = href.startsWith('http');
            return (
                <a
                    href={href}
                    className="portable-text-link"
                    style={{
                        color: '#B94445',
                        fontFamily: "'Prata', serif",
                    }}
                    {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                    {children}
                </a>
            );
        },
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
                                sanityImageBuilder
                                    .image(value)
                                    .width(1200)
                                    .height(675)
                                    .fit('crop')
                                    .auto('format')
                                    .url()
                            }
                            width={1200}
                            height={675}
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
                    <Image
                        src={value.url}
                        alt={value.alt || ''}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                    {value.alt && <figcaption>{value.alt}</figcaption>}
                </div>
            )
        },
        youtube: ({ value }) => {
            const videoId = value?.url ? getYouTubeId(value.url) : null;
            return videoId ? <YouTubeEmbed videoId={videoId} /> : null;
        },
        ad: () => <AdUnit />,
    },
};

