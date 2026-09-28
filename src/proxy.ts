import { NextResponse, type NextRequest } from 'next/server';
import legacySlugs from '@/lib/legacy-slugs.json';

// Old WordPress dated permalinks -> /article/<slug>, via the WP post_name -> Sanity slug map.
// 741 live posts were re-slugged on import ("q-a" -> "q-and-a" etc.), so a same-slug rewrite 404s on Google's indexed URLs.

const SLUG_MAP = legacySlugs as Record<string, string>;

export function proxy(request: NextRequest) {
    const slug = request.nextUrl.pathname.split('/')[4];
    const url = request.nextUrl.clone();
    url.pathname = `/article/${SLUG_MAP[slug] ?? slug}`;
    url.search = '';
    return NextResponse.redirect(url, 308);
}

export const config = {
    matcher: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
};
