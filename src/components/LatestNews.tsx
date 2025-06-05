import { SanityDocument } from "next-sanity";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function LatestNews({ posts }: { posts: SanityDocument[] }): JSX.Element {
    // Get the last 2 posts for the latest news section
    const latestPosts = posts && posts.length > 0 ? posts.slice(0, 4) : [];

    if (latestPosts.length === 0) {
        return <div className="text-red-500">No posts found</div>;
    }

    return (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">LATEST NEWS</h2>
                <Link href="/news" className="flex items-center text-sm hover:underline">
                    1 hour ago <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
            <div className="space-y-4">
                {latestPosts.map((post) => (
                    <Link key={post._id} href={post.slug ?? "/"} className="block hover:opacity-80 border-b border-gray-200 pb-2">
                        <span className="text-lg font-graphiksemibold font-medium">{post.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
} 