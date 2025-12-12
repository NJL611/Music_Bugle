import { notFound } from "next/navigation";
import { fetchCategoryData, fetchCategoryPosts, fetchPopularPosts } from "@/lib/fetchers";
import FeedLayout from "@/components/layout/FeedLayout";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [category, posts, allPosts] = await Promise.all([
        fetchCategoryData(slug),
        fetchCategoryPosts(slug),
        fetchPopularPosts()
    ]);

    if (!category) {
        console.error(`Category not found for slug: ${slug}`);
        notFound();
    }

    return (
        <FeedLayout
            title={category.title}
            description={category.description}
            mainPosts={posts || []}
            popularPosts={allPosts || []}
        />
    );
}
