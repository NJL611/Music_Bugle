import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

export default defineType({
  name: 'trendingPage',
  title: 'Trending Page',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Trending',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Page description',
      type: 'text',
      rows: 3,
      initialValue: 'The stories getting the most attention right now — curated by our editors and updated automatically.',
    }),
    defineField({
      name: 'featuredPosts',
      title: 'Featured posts (priority order)',
      description:
        'Drag to reorder. These appear at the top of the Trending page, before automatically selected recent stories.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
    }),
    defineField({
      name: 'autoFillDays',
      title: 'Auto-fill lookback (days)',
      description: 'How far back to pull recent posts when filling remaining slots.',
      type: 'number',
      initialValue: 14,
      validation: (Rule) => Rule.required().min(1).max(90).integer(),
    }),
    defineField({
      name: 'autoFillLimit',
      title: 'Maximum posts on page',
      description: 'Total posts shown after merging featured, priority, and automatic picks.',
      type: 'number',
      initialValue: 24,
      validation: (Rule) => Rule.required().min(4).max(100).integer(),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Trending Page' }
    },
  },
})
