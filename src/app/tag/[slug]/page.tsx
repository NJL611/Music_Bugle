import { notFound } from "next/navigation";
import { fetchPopularPosts, fetchTagData, fetchTagPosts } from "@/lib/fetchers";
import FeedLayout from "@/components/layout/FeedLayout";

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const [tag, posts, allPosts] = await Promise.all([
        fetchTagData(slug),
        fetchTagPosts(slug),
        fetchPopularPosts()
    ]);

    if (!tag) {
        console.error(`Tag not found for slug: ${slug}`);
        notFound();
    }

    return (
        <FeedLayout
            title={tag.title}
            description={tag.description}
            mainPosts={posts || []}
            popularPosts={allPosts || []}
            categoryLabel="Tag"
        />
    );
}
