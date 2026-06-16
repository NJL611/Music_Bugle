import type { AllowedCategorySlug } from './categories'
import { isAllowedCategorySlug } from './categories'
import {
  BANNED_SUBTITLE_OPENERS,
  MAX_TAGS,
  MIN_TAGS,
  SUBTITLE_MAX_WORDS,
  SUBTITLE_MIN_WORDS,
} from './constants'
import { normalizeTags } from './tags'

export interface Suggestions {
  subtitle: string
  tags: string[]
  category: AllowedCategorySlug | ''
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  suggestions?: Suggestions
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function validateSubtitle(subtitle: string): string[] {
  const errors: string[] = []
  const trimmed = subtitle.trim()

  if (!trimmed) {
    errors.push('subtitle is empty')
    return errors
  }

  const wordCount = countWords(trimmed)
  if (wordCount < SUBTITLE_MIN_WORDS || wordCount > SUBTITLE_MAX_WORDS) {
    errors.push(`subtitle must be ${SUBTITLE_MIN_WORDS}-${SUBTITLE_MAX_WORDS} words (got ${wordCount})`)
  }

  for (const opener of BANNED_SUBTITLE_OPENERS) {
    if (trimmed.startsWith(opener)) {
      errors.push(`subtitle must not begin with "${opener}"`)
      break
    }
  }

  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean)
  const seen = new Set<string>()
  for (const word of words) {
    if (seen.has(word)) {
      errors.push(`subtitle repeats word "${word}"`)
      break
    }
    seen.add(word)
  }

  return errors
}

export function validateTags(tags: string[]): string[] {
  const errors: string[] = []

  if (tags.length < MIN_TAGS) {
    errors.push(`tags must have at least ${MIN_TAGS} items after filtering (got ${tags.length})`)
  }
  if (tags.length > MAX_TAGS) {
    errors.push(`tags must have at most ${MAX_TAGS} items (got ${tags.length})`)
  }

  return errors
}

export function validateCategory(category: string): string[] {
  if (!category) {
    return ['category is empty']
  }
  if (!isAllowedCategorySlug(category)) {
    return [`category "${category}" is not an allowed slug`]
  }
  return []
}

export function validateSuggestions(parsed: {
  subtitle: unknown
  tags: unknown
  category: unknown
}): ValidationResult {
  const subtitle = typeof parsed.subtitle === 'string' ? parsed.subtitle.trim() : ''
  const tags = normalizeTags(parsed.tags)
  const category = isAllowedCategorySlug(parsed.category) ? parsed.category : ''

  const errors = [
    ...validateSubtitle(subtitle),
    ...validateTags(tags),
    ...validateCategory(category),
  ]

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    suggestions: { subtitle, tags, category },
  }
}
