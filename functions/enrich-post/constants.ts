export const MAX_EXISTING_TAGS = 400
export const MIN_TAGS = 4
export const MAX_TAGS = 8
export const SUBTITLE_MIN_WORDS = 6
export const SUBTITLE_MAX_WORDS = 12
export const BODY_TRUNCATE_CHARS = 4000
export const GEMINI_FETCH_BUDGET_MS = 85_000
export const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite'

export const BANNED_SUBTITLE_OPENERS = [
  'Navigating',
  'Exploring',
  'Unveiling',
  'Delving',
  'A Look At',
  'Diving Into',
] as const

export const CORRECTION_PROMPT = `CORRECTION (previous response failed validation):
- subtitle: must be 6-12 words, sentence case, no repeated words, no banned openers
- tags: must be 4-8 tags after filtering forbidden generic tags
Fix and return valid JSON only.`
