// node src/lib/youtube.test.mjs — guards the id regex against the ?si= share-link tracking param.
import assert from 'node:assert/strict'

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com|youtu\.be)\/.+$/
const YOUTUBE_ID_REGEX =
  /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/

const id = (url) => url.match(YOUTUBE_ID_REGEX)?.[1] ?? null

for (const url of [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://youtu.be/dQw4w9WgXcQ?si=Kj3nQ0abc-1x',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s',
  'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
]) {
  assert.equal(YOUTUBE_REGEX.test(url), true, url)
  assert.equal(id(url), 'dQw4w9WgXcQ', url)
}

assert.equal(YOUTUBE_REGEX.test('https://example.com/watch?v=dQw4w9WgXcQ'), false)
assert.equal(id('not a url'), null)

console.log('ok')
