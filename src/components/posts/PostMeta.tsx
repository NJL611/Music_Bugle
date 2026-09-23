import { formatDate } from "@/lib/utils";

// Feed-card byline only — it renders inside the card <Link>, so it must never contain an <a>.
// The article page has its own linked byline in Post.tsx.
export function PostMeta({ author, publishedAt, className = "text-gray-800", showAuthor = true }: { author?: { name: string }, publishedAt?: string | null, className?: string, showAuthor?: boolean }) {
    const authorName = showAuthor ? author?.name : undefined;
    const formattedDate = publishedAt ? formatDate(publishedAt) : '';

    if (!authorName && !formattedDate) return null;

    return (
        <div className={`text-[12px] font-medium ${className}`}>
            {authorName && (
                <>
                    By{" "}
                    <span className="text-gray-900 text-[14px]">{authorName}</span>
                    {formattedDate ? " | " : null}
                </>
            )}
            {formattedDate ? <time dateTime={publishedAt ?? undefined}>{formattedDate}</time> : null}
        </div>
    );
}
