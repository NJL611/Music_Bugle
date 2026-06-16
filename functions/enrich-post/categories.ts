/**
 * Single source of truth for post categorization in enrich-post.
 * Descriptions live in category-descriptions.json (also used by seedCategoryDescriptions.js).
 */

import descriptions from './category-descriptions.json'

export const ALLOWED_CATEGORY_SLUGS = [
  'album-reviews',
  'music-videos',
  'new-releases',
  'new-songs',
  'news',
  'notable-releases',
  'q-and-a',
  'songs',
  'tours',
  'upcoming-releases',
] as const

export type AllowedCategorySlug = (typeof ALLOWED_CATEGORY_SLUGS)[number]

/** Tie-break order when multiple categories could apply. First match wins. */
export const CATEGORY_PRIORITY: readonly AllowedCategorySlug[] = [
  'q-and-a',
  'album-reviews',
  'music-videos',
  'tours',
  'upcoming-releases',
  'notable-releases',
  'new-releases',
  'new-songs',
  'songs',
  'news',
]

export const CATEGORY_DESCRIPTIONS = descriptions as Record<AllowedCategorySlug, string>

export function isAllowedCategorySlug(value: unknown): value is AllowedCategorySlug {
  return typeof value === 'string' && (ALLOWED_CATEGORY_SLUGS as readonly string[]).includes(value)
}

export function sortCategoryOptions<T extends { slug: AllowedCategorySlug }>(options: T[]): T[] {
  const order = new Map(CATEGORY_PRIORITY.map((slug, index) => [slug, index]))
  return [...options].sort(
    (a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999),
  )
}

export function buildCategoryPromptSection(): string {
  const priorityList = CATEGORY_PRIORITY.map(
    (slug, i) => `  ${i + 1}. ${slug}`,
  ).join('\n')

  return `CATEGORY (strict):
- Choose exactly ONE slug from CATEGORY_OPTIONS.
- Each option includes a "description" — that is the definition of when the category applies.
- Match the article to descriptions using title AND body, not title alone.
- When PUBLISHED_AT is provided, compare release dates in the body to that date to decide upcoming vs already released.

PRESS RELEASE AND ANNOUNCEMENT SIGNALS:
Most articles are republished press releases or promotional announcements. Use these signals before the priority list:
- Body contains "press release" or "issued by [PR firm]" → treat as announcement, NOT a review.
- Video premiere / debut video / music video release → music-videos (even if a single is mentioned).
- Pre-orders open / release date after PUBLISHED_AT / "out on [future date]" with nothing live yet → upcoming-releases.
- Teaser track ahead of a future album (headline emphasizes upcoming album, track is a preview) → upcoming-releases.
- Single already out on DSPs at publish time ("out now", "available everywhere", "releases new single") → new-songs, even if a full album is dated later. Do NOT classify these as upcoming-releases.
- Digital EP or album already released at publish time:
  - Mainstream household-name artist (Macklemore, Tegan and Sara, Taylor Swift, Drake, etc.) → notable-releases.
  - Full album or EP, non-mainstream → new-releases.
  - Single or one track focus, non-mainstream → new-songs.
- Tour dates, show announcements, festival appearances → tours.
- Interview, Q&A, "we spoke with" → q-and-a.
- Label signing, roster news, no specific release → news.

PRIORITY ORDER (when multiple categories still fit, pick the FIRST):
${priorityList}

- "news" is the fallback when nothing else applies. Never return an empty string.
- Return the slug exactly as listed (lowercase, hyphens). Never invent a category outside CATEGORY_OPTIONS.`
}
