import { SanityDocument } from "next-sanity";
import { client } from "../../../../sanity/lib/client";
import { POSTS_BY_CATEGORY_QUERY, CATEGORY_QUERY, ALL_CATEGORIES_QUERY } from "../../../../sanity/lib/queries";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Posts from "@/components/Posts";

export const dynamic = 'force-static';

export async function generateStaticParams() {
    const categories = await client.fetch<SanityDocument[]>(ALL_CATEGORIES_QUERY);

    return categories.map((category) => ({
        slug: category.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string; }; }) {
    try {
        const category = await client.fetch(CATEGORY_QUERY, { slug: params.slug });

        if (!category) {
            return {
                title: 'Category Not Found - Music Bugle',
                description: 'The category you are looking for does not exist.',
            };
        }

        return {
            title: `${category.title} - Music Bugle`,
            description: category.description || `Articles in the ${category.title} category`,
            openGraph: {
                title: `${category.title} - Music Bugle`,
                description: category.description || `Articles in the ${category.title} category`,
                type: 'website',
            },
            twitter: {
                title: `${category.title} - Music Bugle`,
                description: category.description || `Articles in the ${category.title} category`,
                card: 'summary_large_image',
            },
        };
    } catch (error) {
        console.error('Error generating metadata for category:', error);
        return {
            title: 'Category Not Found - Music Bugle',
            description: 'The category you are looking for does not exist.',
        };
    }
}

export default async function CategoryPage({ params }: { params: { slug: string; }; }) {
    try {
        const [category, posts] = await Promise.all([
            client.fetch(CATEGORY_QUERY, { slug: params.slug }),
            client.fetch<SanityDocument[]>(POSTS_BY_CATEGORY_QUERY, { slug: params.slug })
        ]);

        if (!category) {
            return (
                <>
                    <Nav />
                    <div className="container mx-auto px-6 py-12">
                        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
                        <p className="text-gray-600 mb-4">The category you are looking for does not exist or may not have a proper URL.</p>
                        <p className="text-sm text-gray-500">
                            This could happen if the category was recently created and hasn&apos;t been properly configured yet.
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
                        <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
                        {category.description && (
                            <p className="text-lg text-gray-600 mb-4">{category.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                            {posts.length} article{posts.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {posts.length > 0 ? (
                        <Posts posts={posts} amount={posts.length} />
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-600">No articles found in this category.</p>
                        </div>
                    )}
                </div>
                <Footer />
            </>
        );
    } catch (error) {
        console.error('Error fetching category data:', error);
        return (
            <>
                <Nav />
                <div className="container mx-auto px-6 py-12">
                    <h1 className="text-3xl font-bold mb-4">Error</h1>
                    <p className="text-gray-600">There was an error loading this category page.</p>
                </div>
                <Footer />
            </>
        );
    }
}
