import type { AllowedCategorySlug } from './categories'

export interface PromptExample {
  title: string
  publishedAt: string
  category: AllowedCategorySlug
  subtitle: string
  tags: string[]
}

export const PROMPT_EXAMPLES: PromptExample[] = [
  {
    title:
      'Winnipeg\'s Alone I Walk Debut Video For Upcoming Single "Get Up"; Available On All DSPs July 25',
    publishedAt: '2019-07-19T10:05:56.000Z',
    category: 'music-videos',
    subtitle: 'Visual rollout ahead of streaming launch later this month',
    tags: [
      'alone i walk',
      'get up',
      'winnipeg',
      'indie rock',
      'music video premiere',
      'us tour',
    ],
  },
  {
    title:
      "Oakland CA's Daxma 'Ruins Upon Ruins' Pre-Orders Open At Blues Funeral Recordings - EP Out July 26th",
    publishedAt: '2019-07-19T09:44:59.000Z',
    category: 'upcoming-releases',
    subtitle: 'Pre-order window opens ahead of late-July EP arrival',
    tags: [
      'daxma',
      'ruins upon ruins',
      'oakland',
      'post-metal',
      'blues funeral recordings',
      'ep pre-order',
    ],
  },
  {
    title:
      'InVogue Records Welcomes Nashville\'s "FFN" & Releases New Single "Ugly"; Label Debut Album "Such Is Life" Out August 9',
    publishedAt: '2019-07-14T10:00:00.000Z',
    category: 'new-songs',
    subtitle: 'Lead single lands now ahead of August full-length debut',
    tags: [
      'ffn',
      'ugly',
      'such is life',
      'nashville',
      'emo',
      'pop-rock',
      'invogue records',
    ],
  },
  {
    title:
      'Abstract Minded Discuss New Album "Seven" And Upcoming US Tour Dates In Exclusive Interview Pt. I',
    publishedAt: '2019-07-07T10:00:00.000Z',
    category: 'q-and-a',
    subtitle: 'Band opens up on writing process and summer routing plans',
    tags: [
      'abstract minded',
      'seven',
      'progressive rock',
      'atmospheric rock',
      'us tour',
      'songwriting',
    ],
  },
]

export function buildFewShotSection(): string {
  return `EXAMPLES:
${JSON.stringify(PROMPT_EXAMPLES, null, 2)}`
}
