import { NextResponse, type NextRequest } from 'next/server';
import legacySlugs from '@/lib/legacy-slugs.json';

// Old WordPress dated permalinks: 308 to /article/<slug> for the 770 live posts, 410 Gone for the ~3.6k pruned ones.
// The map must list every live WP post, same-slug ones included: a slug missing from it answers 410 for a live article.

const SLUG_MAP = legacySlugs as Record<string, string>;

const GONE_PAGE =
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Page removed - The Music Bugle</title></head><body style="font-family:system-ui,sans-serif;max-width:36rem;margin:4rem auto;padding:0 1rem">' +
    '<h1>This page has been removed</h1><p>This article is no longer available on The Music Bugle.</p><p><a href="/">Read the latest articles</a></p></body></html>';

export function proxy(request: NextRequest) {
    const target = SLUG_MAP[request.nextUrl.pathname.split('/')[4].toLowerCase()];
    // 410 rather than a redirect to a 404: Google drops a permanent removal sooner, and each recrawl is one cheap response.
    if (!target) {
        return new NextResponse(GONE_PAGE, { status: 410, headers: { 'content-type': 'text/html; charset=utf-8' } });
    }
    const url = request.nextUrl.clone();
    url.pathname = `/article/${target}`;
    url.search = '';
    return NextResponse.redirect(url, 308);
}

export const config = {
    matcher: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
};
