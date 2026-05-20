import { documentEventHandler } from '@sanity/functions'
import { createClient, type SanityClient } from '@sanity/client'

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash'
const geminiModel = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL

// Retry within a time budget to fit Sanity function timeouts. Avoid logging full URLs (API key in query string).
const GEMINI_FETCH_BUDGET_MS = 85_000

// Tags we never want, even if the model rephrases. Compared lowercased.
const TAG_BLOCKLIST = new Set([
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
  'metal',
  'rock',
  'pop',
  'rap',
  'hip hop',
  'country',
  'jazz',
])

const ALLOWED_CATEGORY_SLUGS = [
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
type AllowedCategorySlug = typeof ALLOWED_CATEGORY_SLUGS[number]

interface CategoryOption {
  _id: string;
  slug: AllowedCategorySlug;
  title: string;
  description: string;
}

const SYSTEM_INSTRUCTION = `You are a music journalism tagging assistant for a music blog.

OUTPUT FORMAT (strict):
- Return a single valid JSON object with keys "subtitle" (string), "tags" (string array), and "category" (string).
- No markdown, no prose, no commentary, no "#" symbols, no surrounding quotes inside strings.

TAG RULES (strict):
- Each tag is 1 to 4 words. No trailing punctuation. No "#" symbol.
- Produce 5 to 8 tags total. Quality over quantity. Skip a bucket rather than pad with filler.
- FORBIDDEN tags (never emit, even rephrased): music, music video, music industry, music career, musician profile, artist spotlight, emerging artist, new album, new release, new music, single review, album review. Generic genre roots alone are also forbidden: metal, rock, pop, rap, hip hop, country, jazz. Always pick a specific subgenre instead.
- Reuse existing tags: if any item in EXISTING_TAGS matches a tag you intend to emit (case-insensitive, including plural and hyphenation variants), reuse the EXISTING_TAGS spelling exactly. Creating a near-duplicate is a failure.

TAG COMPOSITION (priority order, skip any bucket that does not fit the post):
1. Primary artist, exact spelling from the title.
2. Featured artists explicitly named in the body.
3. The specific song or album title from the post.
4. 1 to 2 specific subgenres (e.g. "technical deathcore", not "metal").
5. 1 to 2 sonic descriptors (e.g. "harsh vocals", "lush synths", "complex rhythm").
6. 1 to 2 moods or themes (e.g. "nostalgia", "social commentary", "summer anthem").
7. Optional: era or regional scene when clearly applicable (e.g. "90s alt-rock", "atlanta trap").

SUBTITLE RULES (strict):
- Length: 6 to 12 words.
- Sentence case: only the first letter and proper nouns capitalized.
- Must NOT repeat the artist, song, or album name already in the title.
- Must NOT begin with: "Navigating", "Exploring", "Unveiling", "Delving", "A Look At", "Diving Into".
- No word may appear twice within the subtitle.

CATEGORY (strict):
- Choose exactly ONE slug from CATEGORY_OPTIONS.
- Read each option's "description" carefully. It defines when that category applies. Match the article to the description, not just the title.
- When more than one description fits, apply this priority order and pick the FIRST that applies:
  1. q-and-a — any interview / Q&A format always wins.
  2. album-reviews — any post that critically reviews or rates a specific album.
  3. music-videos — any post whose primary focus is a music video.
  4. tours — any post centered on touring: announcements, dates, on-the-road coverage, tour reviews.
  5. upcoming-releases — an album or song that has been announced but is not yet released.
  6. notable-releases — a new release, but ONLY when the artist is mainstream / widely known to the general public (charting acts, major labels, household names). Genre-internal popularity does not count.
  7. new-releases — a just-released album or EP from a non-mainstream artist, when the post is a heads-up rather than a critical review.
  8. new-songs — a just-released single or track, when the post is a heads-up rather than a deep analysis.
  9. songs — a deep dive on a song that is not a fresh release (throwbacks, lyrical analyses, retrospectives).
  10. news — catch-all for music news that does not fit any of the above (signings, lineup changes, label moves, lawsuits, awards, controversies).
- "news" is the fallback. If nothing else applies, choose "news". Never return an empty string.
- Return the slug exactly as listed (lowercase, hyphens). Never invent a category outside CATEGORY_OPTIONS.`

async function fetchGeminiWithRetryBudget(url: string, init: RequestInit): Promise<Response> {
  const deadline = Date.now() + GEMINI_FETCH_BUDGET_MS
  let attempt = 0

  while (Date.now() < deadline) {
    attempt++
    const res = await fetch(url, init)
    if (![429, 502, 503, 504].includes(res.status)) {
      return res
    }

    const remaining = deadline - Date.now()
    if (remaining < 500) {
      break
    }

    const retryAfter = Number(res.headers.get('retry-after') ?? 0) * 1000
    const base =
      res.status === 429
        ? 1000 * 2 ** Math.min(attempt - 1, 6) + Math.random() * 250
        : 1500 * 2 ** Math.min(attempt - 1, 5) + Math.random() * 500
    const wait = Math.min(Math.max(retryAfter, base), Math.max(0, remaining - 250), 20_000)

    console.warn(`${res.status} from Gemini – retrying in ${wait.toFixed(0)} ms (attempt ${attempt})`)
    await new Promise((r) => setTimeout(r, wait))
  }

  throw new Error('Failed to reach Gemini in time: repeated 429/5xx (rate limit or model overload).')
}

interface Suggestions {
  subtitle: string;
  tags: string[];
  category: AllowedCategorySlug | '';
}

async function fetchExistingTagTitles(client: SanityClient): Promise<string[]> {
  const titles = await client.fetch<string[]>('*[_type == "tag" && defined(title)].title')
  return titles.map((title) => String(title).toLowerCase())
}

function isAllowedCategorySlug(value: unknown): value is AllowedCategorySlug {
  return typeof value === 'string' && (ALLOWED_CATEGORY_SLUGS as readonly string[]).includes(value)
}

async function fetchAllowedCategories(client: SanityClient): Promise<CategoryOption[]> {
  const categories = await client.fetch<Array<{ _id: string; slug?: string; title?: string; description?: string }>>(
    '*[_type == "category" && slug.current in $slugs]{_id, "slug": slug.current, title, description} | order(title asc)',
    { slugs: ALLOWED_CATEGORY_SLUGS },
  )

  return categories
    .filter(
      (category): category is { _id: string; slug: AllowedCategorySlug; title: string; description?: string } =>
        isAllowedCategorySlug(category.slug) && typeof category.title === 'string',
    )
    .map((category) => ({
      _id: category._id,
      slug: category.slug,
      title: category.title,
      description: typeof category.description === 'string' ? category.description : '',
    }))
}

// Belt-and-suspenders: clean up tags client-side so a model slip can't reach Sanity.
function normalizeTags(rawTags: unknown): string[] {
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

function portableTextToPlainText(value: unknown): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''

  return value
    .map((block) => {
      if (!block || typeof block !== 'object') return ''

      const children = 'children' in block ? block.children : undefined
      if (!Array.isArray(children)) return ''

      return children
        .map((child) => {
          if (!child || typeof child !== 'object' || !('text' in child)) return ''
          return typeof child.text === 'string' ? child.text : ''
        })
        .join('')
    })
    .filter(Boolean)
    .join('\n\n')
}

async function getSuggestions(
  title: string,
  body: unknown = '',
  existingTags: string[] = [],
  categoryOptions: CategoryOption[] = [],
): Promise<Suggestions> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${process.env.GEMINI_API_KEY}`
  const bodyText = portableTextToPlainText(body)

  const userPrompt = `EXISTING_TAGS:
${JSON.stringify(existingTags)}

CATEGORY_OPTIONS:
${JSON.stringify(categoryOptions.map(({ slug, title, description }) => ({ slug, title, description })))}

TITLE:
${title}

BODY (truncated):
${bodyText.slice(0, 4000)}`

  const res = await fetchGeminiWithRetryBudget(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        response_mime_type: 'application/json',
        response_schema: {
          type: 'object',
          required: ['subtitle', 'tags', 'category'],
          properties: {
            subtitle: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            category: { 
              type: 'string',
              ...(categoryOptions.length > 0 ? { enum: categoryOptions.map((option) => option.slug) } : {})
            },
          },
        },
      },
    }),
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Gemini API error (${res.status}): ${errorBody}`)
  }

  const completion = await res.json()
  const jsonText = completion.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'

  try {
    const parsed = JSON.parse(jsonText)
    const subtitle = typeof parsed.subtitle === 'string' ? parsed.subtitle.trim() : ''
    const tags = normalizeTags(parsed.tags)
    const category = isAllowedCategorySlug(parsed.category) ? parsed.category : ''

    if (!subtitle || tags.length === 0) {
      throw new Error('Invalid JSON structure in response.')
    }

    return { subtitle, tags, category }
  } catch (err) {
    console.error('Failed to parse Gemini JSON response.', { jsonText, err })
    throw new Error('Failed to parse Gemini JSON response.')
  }
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

async function ensureTags(client: SanityClient, labels: string[]) {
  const tagRefs = await Promise.all(
    labels
      .map((label) => String(label).trim().toLowerCase())
      .filter(Boolean)
      .map(async (label) => {
        const slug = slugify(label)
        const existingTag = await client.fetch<{ _id: string } | null>('*[_type == "tag" && slug.current == $slug][0]{_id}', {
          slug,
        })

        if (existingTag?._id) {
          return { _key: existingTag._id, _type: 'reference', _ref: existingTag._id }
        }

        const newTag = await client.create({
          _type: 'tag',
          title: label,
          slug: { _type: 'slug', current: slug },
        })

        return { _key: newTag._id, _type: 'reference', _ref: newTag._id }
      }),
  )
  return tagRefs.filter(Boolean)
}

export const handler = documentEventHandler(async ({ context, event }) => {
  const { _id, title, body, subtitle: existingSubtitle, tagCount, categoryCount } = event.data
  if (!title) {
    console.log(`Document ${_id} has no title, skipping enrichment.`)
    return
  }

  // Skip if already enriched. Prevents the function from firing on its own follow-up patches.
  if (
    existingSubtitle &&
    typeof tagCount === 'number' &&
    tagCount > 0 &&
    typeof categoryCount === 'number' &&
    categoryCount > 0
  ) {
    console.log(`Document ${_id} already enriched (subtitle + ${tagCount} tags + ${categoryCount} category), skipping.`)
    return
  }

  const client = createClient({ ...context.clientOptions, apiVersion: '2024-05-01', useCdn: false })

  const [existingTags, categoryOptions] = await Promise.all([
    fetchExistingTagTitles(client),
    fetchAllowedCategories(client),
  ])
  const { subtitle, tags, category } = await getSuggestions(title, body, existingTags, categoryOptions)
  let categoryDoc = categoryOptions.find((option) => option.slug === category)

  if (!categoryDoc) {
    console.warn(`Category "${category}" returned by Gemini is invalid or missing in options. Falling back to "news".`)
    categoryDoc = categoryOptions.find((option) => option.slug === 'news')
  }

  if (!categoryDoc && categoryOptions.length > 0) {
    console.warn(`Fallback "news" category not found. Falling back to first available category option: "${categoryOptions[0].slug}".`)
    categoryDoc = categoryOptions[0]
  }

  if (!categoryDoc) {
    throw new Error(`No valid categories found in Sanity database for document ${_id}.`)
  }

  const tagRefs = await ensureTags(client, tags)
  const categoryRef = { _key: categoryDoc._id, _type: 'reference', _ref: categoryDoc._id }

  await client
    .patch(_id)
    .setIfMissing({ subtitle })
    .setIfMissing({ tags: tagRefs.length > 0 ? tagRefs : undefined })
    .setIfMissing({ categories: [categoryRef] })
    .commit({ autoGenerateArrayKeys: true })

  console.log(
    `Successfully enriched document ${_id} with a subtitle, ${tagRefs.length} tags, and category ${categoryDoc.slug}.`,
  )
})