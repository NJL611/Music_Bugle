import { documentEventHandler } from '@sanity/functions'
import { createClient, type SanityClient } from '@sanity/client'
import {
  ALLOWED_CATEGORY_SLUGS,
  type AllowedCategorySlug,
  buildCategoryPromptSection,
  isAllowedCategorySlug,
  sortCategoryOptions,
} from './categories'
import {
  BODY_TRUNCATE_CHARS,
  CORRECTION_PROMPT,
  DEFAULT_GEMINI_MODEL,
  GEMINI_FETCH_BUDGET_MS,
  MAX_EXISTING_TAGS,
} from './constants'
import { buildFewShotSection } from './prompt-examples'
import { fetchTopTagsByUsage } from './tags'
import { validateSuggestions, type Suggestions } from './validation'

const geminiModel = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL

interface CategoryOption {
  _id: string
  slug: AllowedCategorySlug
  title: string
  description: string
}

const SYSTEM_INSTRUCTION = `You are a music journalism tagging assistant for a music blog.

OUTPUT FORMAT (strict):
- Return a single valid JSON object with keys "subtitle" (string), "tags" (string array), and "category" (string).
- No markdown, no prose, no commentary, no "#" symbols, no surrounding quotes inside strings.

TAG RULES (strict):
- Each tag is 1 to 4 words. No trailing punctuation. No "#" symbol.
- Produce 5 to 8 tags total. Quality over quantity. Skip a bucket rather than pad with filler.
- FORBIDDEN tags (never emit, even rephrased): music, music video, music industry, music career, musician profile, artist spotlight, emerging artist, new album, new release, new music, single review, album review, we are interview, interview, q and a, q&a. Generic genre roots alone are also forbidden: metal, rock, pop, rap, hip hop, country, jazz. Always pick a specific subgenre instead.
- For q-and-a posts: never tag with meta labels about the format (no "interview", "we are interview", "q and a"). Tag artists, releases discussed, subgenres, and topics from the conversation instead.
- Reuse existing tags: if any item in EXISTING_TAGS matches a tag you intend to emit (case-insensitive, including plural and hyphenation variants), reuse the EXISTING_TAGS spelling exactly. Creating a near-duplicate is a failure.

PRESS RELEASE TAGGING:
- Ignore boilerplate: "press release issued by", "photo courtesy of", PR firm names.
- Tag artists, song/album titles, specific subgenres, locations/scenes — not PR firms.
- Parse feat./featuring collaborators from title and body.

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

${buildCategoryPromptSection()}`

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

async function fetchAllowedCategories(client: SanityClient): Promise<CategoryOption[]> {
  const categories = await client.fetch<Array<{ _id: string; slug?: string; title?: string; description?: string }>>(
    '*[_type == "category" && slug.current in $slugs]{_id, "slug": slug.current, title, description}',
    { slugs: ALLOWED_CATEGORY_SLUGS },
  )

  const options = categories
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

  return sortCategoryOptions(options)
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

function buildUserPrompt(params: {
  title: string
  body: unknown
  publishedAt?: string
  existingTags: string[]
  totalTagCount: number
  categoryOptions: CategoryOption[]
  includeExamples: boolean
  correction?: string
}): string {
  const bodyText = portableTextToPlainText(params.body)
  const sortedCategories = sortCategoryOptions(params.categoryOptions)
  const tagsNote =
    params.totalTagCount > params.existingTags.length
      ? `\n(Showing top ${params.existingTags.length} of ${params.totalTagCount} tags by usage; prefer reusing these when applicable.)`
      : ''

  const sections = [
    params.includeExamples ? buildFewShotSection() : null,
    `EXISTING_TAGS:${tagsNote}\n${JSON.stringify(params.existingTags)}`,
    `CATEGORY_OPTIONS:\n${JSON.stringify(sortedCategories.map(({ slug, title, description }) => ({ slug, title, description })))}`,
    params.publishedAt
      ? `PUBLISHED_AT: ${params.publishedAt}\nCompare release dates in the body to this date to decide upcoming vs already released.`
      : null,
    `TITLE:\n${params.title}`,
    `BODY (truncated):\n${bodyText.slice(0, BODY_TRUNCATE_CHARS)}`,
    params.correction ?? null,
  ].filter(Boolean)

  return sections.join('\n\n')
}

async function callGemini(userPrompt: string, categoryOptions: CategoryOption[]): Promise<unknown> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${process.env.GEMINI_API_KEY}`

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
              ...(categoryOptions.length > 0 ? { enum: categoryOptions.map((option) => option.slug) } : {}),
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
    return JSON.parse(jsonText)
  } catch (err) {
    console.error('Failed to parse Gemini JSON response.', { jsonText, err })
    throw new Error('Failed to parse Gemini JSON response.')
  }
}

async function getSuggestionsWithRetry(
  title: string,
  body: unknown,
  publishedAt: string | undefined,
  existingTags: string[],
  totalTagCount: number,
  categoryOptions: CategoryOption[],
): Promise<Suggestions> {
  const baseParams = {
    title,
    body,
    publishedAt,
    existingTags,
    totalTagCount,
    categoryOptions,
  }

  const firstPrompt = buildUserPrompt({ ...baseParams, includeExamples: true })
  const firstParsed = await callGemini(firstPrompt, categoryOptions)
  const firstResult = validateSuggestions(
    firstParsed as { subtitle: unknown; tags: unknown; category: unknown },
  )

  if (firstResult.valid && firstResult.suggestions) {
    return firstResult.suggestions
  }

  console.warn('Validation failed on first attempt:', firstResult.errors.join('; '))

  const retryPrompt = buildUserPrompt({
    ...baseParams,
    includeExamples: false,
    correction: CORRECTION_PROMPT,
  })
  const retryParsed = await callGemini(retryPrompt, categoryOptions)
  const retryResult = validateSuggestions(
    retryParsed as { subtitle: unknown; tags: unknown; category: unknown },
  )

  if (retryResult.valid && retryResult.suggestions) {
    console.warn('Validation passed on retry.')
    return retryResult.suggestions
  }

  console.error('Validation failed on retry:', retryResult.errors.join('; '))
  throw new Error(`Enrichment validation failed: ${retryResult.errors.join('; ')}`)
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

async function ensureTags(client: SanityClient, labels: string[]) {
  const tagRefs = await Promise.all(
    labels
      .map((label) => String(label).trim().toLowerCase())
      .filter(Boolean)
      .map(async (label) => {
        const slug = slugify(label)
        const existingTag = await client.fetch<{ _id: string } | null>(
          '*[_type == "tag" && slug.current == $slug][0]{_id}',
          { slug },
        )

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
  const { _id, title, body, subtitle: existingSubtitle, publishedAt, tagCount, categoryCount } = event.data
  if (!title) {
    console.log(`Document ${_id} has no title, skipping enrichment.`)
    return
  }

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

  const [topTags, categoryOptions] = await Promise.all([
    fetchTopTagsByUsage(client, MAX_EXISTING_TAGS),
    fetchAllowedCategories(client),
  ])

  const publishedAtStr = typeof publishedAt === 'string' ? publishedAt : undefined

  const { subtitle, tags, category } = await getSuggestionsWithRetry(
    title,
    body,
    publishedAtStr,
    topTags.tags,
    topTags.totalTagCount,
    categoryOptions,
  )

  let categoryDoc = categoryOptions.find((option) => option.slug === category)

  if (!categoryDoc) {
    console.warn(`Category "${category}" returned by Gemini is invalid or missing in options. Falling back to "news".`)
    categoryDoc = categoryOptions.find((option) => option.slug === 'news')
  }

  if (!categoryDoc && categoryOptions.length > 0) {
    console.warn(
      `Fallback "news" category not found. Falling back to first available category option: "${categoryOptions[0].slug}".`,
    )
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
