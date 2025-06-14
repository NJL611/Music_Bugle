import { documentEventHandler } from '@sanity/functions'
import { createClient, type SanityClient } from '@sanity/client'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash-latest'

function slugify(input: string): string {
  return input.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

async function fetchWithBackoff(url: string, init: RequestInit, retries = 3): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, init)
    if (res.status !== 429) {
      return res
    }

    const retryAfter = Number(res.headers.get('retry-after') ?? 0) * 1000
    const expoBackoff = 2 ** attempt * 1000 + Math.random() * 500
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
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY environment variable not set.')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`
  const prompt = `Based on the following blog post, generate a compelling subtitle that takes up to 1-2 sentences and up to 5 relevant tags.
    Title: ${title}
    Body: ${body.slice(0, 4000)}
    Return a single, valid JSON object with the keys "subtitle" and "tags".`

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

async function ensureTags(client: SanityClient, labels: string[]) {
  const tagRefs = await Promise.all(
    labels
      .map((label) => String(label).trim())
      .filter(Boolean)
      .map(async (label) => {
        const existingTag = await client.fetch<any>('*[_type == "tag" && title == $label][0]', {
          label,
        })
        const tagId = existingTag?._id ?? (await client.create({ _type: 'tag', title: label }))._id

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