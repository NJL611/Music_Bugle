import { formatDate } from "@/lib/utils";

export function PostMeta({ author, publishedAt, className = "text-gray-800", showAuthor = true }: { author?: { name: string }, publishedAt: string, className?: string, showAuthor?: boolean }) {
    const authorName = showAuthor ? author?.name : undefined;

    return (
        <div className={`text-[12px] font-medium ${className}`}>
            {authorName && (
                <>
                    By <span className="text-gray-900 text-[14px]">{authorName}</span> |{" "}
                </>
            )}
            {formatDate(publishedAt)}
        </div>
    );
}

