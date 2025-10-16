import { SanityDocument } from "next-sanity";
import { client } from "../../../../sanity/lib/client";
import { POSTS_BY_TAG_QUERY, TAG_QUERY, ALL_TAGS_QUERY } from "../../../../sanity/lib/queries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Posts from "@/components/Posts";

export const dynamic = 'force-static';

export async function generateStaticParams() {
    const tags = await client.fetch<SanityDocument[]>(ALL_TAGS_QUERY);

    return tags.map((tag) => ({
        slug: tag.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string; }; }) {
    try {
        const tag = await client.fetch(TAG_QUERY, { slug: params.slug });

        if (!tag) {
            return {
                title: 'Tag Not Found - Music Bugle',
                description: 'The tag you are looking for does not exist.',
            };
        }

        return {
            title: `${tag.title} - Music Bugle`,
            description: tag.description || `Articles tagged with ${tag.title}`,
            openGraph: {
                title: `${tag.title} - Music Bugle`,
                description: tag.description || `Articles tagged with ${tag.title}`,
                type: 'website',
            },
            twitter: {
                title: `${tag.title} - Music Bugle`,
                description: tag.description || `Articles tagged with ${tag.title}`,
                card: 'summary_large_image',
            },
        };
    } catch (error) {
        console.error('Error generating metadata for tag:', error);
        return {
            title: 'Tag Not Found - Music Bugle',
            description: 'The tag you are looking for does not exist.',
        };
    }
}

export default async function TagPage({ params }: { params: { slug: string; }; }) {
    try {
        const [tag, posts] = await Promise.all([
            client.fetch(TAG_QUERY, { slug: params.slug }),
            client.fetch<SanityDocument[]>(POSTS_BY_TAG_QUERY, { slug: params.slug })
        ]);

        if (!tag) {
            return (
                <>
                    <Nav />
                    <div className="container mx-auto px-6 py-12">
                        <h1 className="text-3xl font-bold mb-4">Tag Not Found</h1>
                        <p className="text-gray-600 mb-4">The tag you are looking for does not exist or may not have a proper URL.</p>
                        <p className="text-sm text-gray-500">
                            This could happen if the tag was recently created and hasn't been properly configured yet.
                        </p>
                    </div>
                    <Footer />
                </>
            );
        }

        return (
            <>
                <Nav />
                <div className="container mx-auto px-6 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">#{tag.title}</h1>
                        {tag.description && (
                            <p className="text-lg text-gray-600 mb-4">{tag.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                            {posts.length} article{posts.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {posts.length > 0 ? (
                        <Posts posts={posts} amount={posts.length} label="ARTICLES" />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-600">No articles found for this tag.</p>
                        </div>
                    )}
                </div>
                <Footer />
            </>
        );
    } catch (error) {
        console.error('Error fetching tag data:', error);
        return (
            <>
                <Nav />
                <div className="container mx-auto px-6 py-12">
                    <h1 className="text-3xl font-bold mb-4">Error</h1>
                    <p className="text-gray-600">There was an error loading this tag page.</p>
                </div>
                <Footer />
            </>
        );
    }
}
