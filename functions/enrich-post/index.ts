import { documentEventHandler } from '@sanity/functions'
import { createClient, type SanityClient } from '@sanity/client'

const GEMINI_MODEL = 'gemini-2.5-flash'

async function fetchWithBackoff(url: string, init: RequestInit, retries = 5): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, init)
    if (res.status !== 429) {
      return res
    }

    const retryAfter = Number(res.headers.get('retry-after') ?? 0) * 1000
    // Base backoff: 3s, 6s, 12s, 24s, 48s + jitter
    const expoBackoff = 3 * (2 ** (attempt - 1)) * 1000 + Math.random() * 1000
    const wait = Math.max(retryAfter, expoBackoff)

    console.warn(`429 received – retrying in ${wait.toFixed(0)} ms (attempt ${attempt}/${retries})`)
    await new Promise(r => setTimeout(r, wait))
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts due to rate limiting.`)
}

interface Suggestions {
  subtitle: string;
  tags: string[];
}

async function getSuggestions(title: string, body = ''): Promise<Suggestions> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`

  const prompt = `You are an expert music blogger and archivist. Your task is to analyze the following blog post about a musical artist or release and generate a compelling subtitle and a set of specific, relevant tags.

  The tags should be highly specific. Focus on:
  - The primary artist's name.
  - Any featured artists mentioned.
  - The song or album title being discussed.
  - Nuanced subgenres (e.g., "Shoegaze", "Post-Punk Revival", "Art Pop" instead of generic genres).
  - Key themes or moods from the lyrics or description (e.g., "Nostalgia", "Social Commentary", "Summer Anthem").
  
  **IMPORTANT**: Avoid overly generic tags such as "Music", "New Release", or "Music Video". The goal is specificity and uniqueness based on the content, but they also should be related to other music related tags for easier searching.
  
  **Blog Post Content:**
    Title: ${title}
    Body: ${body.slice(0, 4000)}
    Return a single, valid JSON object with the keys "subtitle" and "tags".
    IMPORTANT: The tags should be plain words or phrases, WITHOUT the "#" symbol.`

  const res = await fetchWithBackoff(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        response_mime_type: 'application/json',
        response_schema: {
          type: 'object',
          required: ['subtitle', 'tags'],
          properties: {
            subtitle: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
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
    const suggestions: Suggestions = JSON.parse(jsonText)
    if (!suggestions.subtitle || !Array.isArray(suggestions.tags)) {
      throw new Error('Invalid JSON structure in response.')
    }
    return suggestions
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
      .map((label) => String(label).trim())
      .filter(Boolean)
      .map(async (label) => {
        const existingTag = await client.fetch<any>('*[_type == "tag" && title == $label][0]{_id, slug}', {
          label,
        })

        let tagId = existingTag?._id;

        if (tagId && !existingTag.slug?.current) {
          const slug = slugify(label);
          await client.patch(tagId).set({ slug: { _type: 'slug', current: slug } }).commit();
        }

        if (!tagId) {
          const slug = slugify(label);
          const newTag = await client.create({
            _type: 'tag',
            title: label,
            slug: { _type: 'slug', current: slug }
          });
          tagId = newTag._id;
        }

        if (!tagId) return null
        return { _key: tagId, _type: 'reference', _ref: tagId }
      }),
  )
  return tagRefs.filter(Boolean)
}

export const handler = documentEventHandler(async ({ context, event }) => {
  const { _id, title, body } = event.data
  if (!title) {
    console.log(`Document ${_id} has no title, skipping enrichment.`)
    return
  }

  const client = createClient({ ...context.clientOptions, apiVersion: '2024-05-01' })

  const { subtitle, tags } = await getSuggestions(title, body)

  const tagRefs = await ensureTags(client, tags)

  await client
    .patch(_id)
    .setIfMissing({ subtitle })
    .setIfMissing({ tags: tagRefs.length > 0 ? tagRefs : undefined })
    .commit({ autoGenerateArrayKeys: true })

  console.log(`Successfully enriched document ${_id} with a subtitle and ${tagRefs.length} tags.`)
})