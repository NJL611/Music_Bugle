import Link from "next/link";
import { formatDate } from "@/lib/utils";

// linkAuthor is opt-in: only the article page links the byline. In feed cards PostMeta renders
// inside the card <Link>, where a nested <a> would be invalid HTML.
export function PostMeta({ author, publishedAt, className = "text-gray-800", showAuthor = true, linkAuthor = false }: { author?: { name: string, slug?: string }, publishedAt?: string | null, className?: string, showAuthor?: boolean, linkAuthor?: boolean }) {
    const authorName = showAuthor ? author?.name : undefined;
    const formattedDate = publishedAt ? formatDate(publishedAt) : '';

    if (!authorName && !formattedDate) return null;

    return (
        <div className={`text-[12px] font-medium ${className}`}>
            {authorName && (
                <>
                    By{" "}
                    {linkAuthor && author?.slug ? (
                        <Link href={`/author/${author.slug}`} className="text-gray-900 text-[14px] hover:text-theme-red transition-colors">
                            {authorName}
                        </Link>
                    ) : (
                        <span className="text-gray-900 text-[14px]">{authorName}</span>
                    )}
                    {formattedDate ? " | " : null}
                </>
            )}
            {formattedDate ? <time dateTime={publishedAt ?? undefined}>{formattedDate}</time> : null}
        </div>
    );
}
