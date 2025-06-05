import Link from "next/link";

export default function TrendingTopics(): JSX.Element {
    const topics = [
        { name: "Shoegaze", slug: "/tag/shoegaze" },
        { name: "Underground Rap", slug: "/tag/underground-rap" },
        { name: "New Releases", slug: "/tag/new-releases" },
        { name: "Playlists", slug: "/tag/playlists" },
    ];

    return (
        <div className="mb-8">
            <h2 className="text-lg font-bold mb-3">TRENDING</h2>
            <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                    <Link
                        key={topic.name}
                        href={topic.slug}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        {topic.name}
                    </Link>
                ))}
            </div>
        </div>
    );
} 