import type { SanityClient } from '@sanity/client'
import { MAX_EXISTING_TAGS } from './constants'

export const TAG_BLOCKLIST = new Set([
  'music',
  'music video',
  'music industry',
  'music career',
  'musician profile',
  'artist spotlight',
  'emerging artist',
  'new album',
  'new release',
  'new music',
  'single review',
  'album review',
  'we are interview',
  'interview',
  'q and a',
  'q&a',
  'metal',
  'rock',
  'pop',
  'rap',
  'hip hop',
  'country',
  'jazz',
])

export interface TopTagsResult {
  tags: string[]
  totalTagCount: number
}

export async function fetchTopTagsByUsage(
  client: SanityClient,
  limit = MAX_EXISTING_TAGS,
): Promise<TopTagsResult> {
  const rows = await client.fetch<Array<{ title: string }>>(
    `*[_type == "tag" && defined(title)] {
      title,
      "usage": count(*[_type == "post" && references(^._id)])
    } | order(usage desc) [0...$limit] { title }`,
    { limit },
  )

  const totalTagCount = await client.fetch<number>('count(*[_type == "tag" && defined(title)])')

  return {
    tags: rows.map((row) => String(row.title).toLowerCase()),
    totalTagCount,
  }
}

export function normalizeTags(rawTags: unknown): string[] {
  if (!Array.isArray(rawTags)) return []

  const seen = new Set<string>()
  const cleaned: string[] = []

  for (const raw of rawTags) {
    if (typeof raw !== 'string') continue

    const tag = raw
      .replace(/^#+/, '')
      .replace(/^["']|["']$/g, '')
      .replace(/[.,;:!?]+$/, '')
      .trim()
      .toLowerCase()

    if (!tag) continue
    if (TAG_BLOCKLIST.has(tag)) continue
    if (tag.split(/\s+/).length > 4) continue
    if (seen.has(tag)) continue

    seen.add(tag)
    cleaned.push(tag)
  }

  return cleaned
}
