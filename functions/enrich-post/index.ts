import { documentEventHandler } from '@sanity/functions'
import { createClient, type SanityClient } from '@sanity/client'

const AI_API_KEY = process.env.AI_API_KEY || process.env.GEMINI_API_KEY
const AI_MODEL = process.env.AI_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const AI_PROVIDER = process.env.AI_PROVIDER || 'grok' // 'gemini' or 'grok'

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
  if (!AI_API_KEY) throw new Error('AI_API_KEY environment variable not set.')

  const prompt = `Extract subtitle and tags from this music blog post.

RULES:
- Generate 5 specific tags (vary the count based on content richness)
- Tags MUST be concrete nouns: artist names, album titles, song names, record labels, subgenres, or music scenes
- NEVER use generic words: "Music Video", "New Release", "Debut", "Official", "Single", "Album"
- NEVER use adjectives: "Long-Awaited", "Introspective", "Emotional"
- Prioritize proper nouns (capitalize artist/album/song names)

GOOD TAGS: "Mac Miller", "Circles", "Warner Records", "Pittsburgh Hip-Hop", "Swimming"
BAD TAGS: "Music Video", "New Release", "Hip-Hop" (too broad), "Emotional" (adjective)

Title: ${title}
Body: ${body.slice(0, 4000)}

Return JSON with subtitle and tags array.`

  if (AI_PROVIDER === 'grok') {
    return await getGrokSuggestions(prompt)
  } else {
    return await getGeminiSuggestions(prompt)
  }
}

async function getGrokSuggestions(prompt: string): Promise<Suggestions> {
  const url = 'https://api.x.ai/v1/chat/completions'

  const res = await fetchWithBackoff(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL || 'grok-beta',
      messages: [
        { role: 'system', content: 'You are a music data extraction assistant. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Grok API error (${res.status}): ${errorBody}`)
  }

  const completion = await res.json()
  const jsonText = completion.choices?.[0]?.message?.content ?? '{}'

  try {
    const suggestions: Suggestions = JSON.parse(jsonText)
    if (!suggestions.subtitle || !Array.isArray(suggestions.tags)) {
      throw new Error('Invalid JSON structure in response.')
    }
    return suggestions
  } catch (err) {
    console.error('Failed to parse Grok JSON response.', { jsonText, err })
    throw new Error('Failed to parse Grok JSON response.')
  }
}

async function getGeminiSuggestions(prompt: string): Promise<Suggestions> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent?key=${AI_API_KEY}`

  const res = await fetchWithBackoff(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        response_mime_type: 'application/json',
        response_schema: {
          type: 'object',
          required: ['subtitle', 'tags'],
          properties: {
            subtitle: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 5 },
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

        let tagId = existingTag?._id

        if (!tagId) {
          // Create new tag with slug generated from title
          const slug = label
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim()

          const newTag = await client.create({
            _type: 'tag',
            title: label,
            slug: {
              _type: 'slug',
              current: slug
            }
          })
          tagId = newTag._id
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