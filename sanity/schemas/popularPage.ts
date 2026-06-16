import { defineField, defineType } from 'sanity'
import { TrendUpwardIcon } from '@sanity/icons'

export default defineType({
  name: 'popularPage',
  title: 'Popular Page',
  type: 'document',
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      initialValue: 'Popular',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Page description',
      type: 'text',
      rows: 3,
      initialValue:
        'The stories readers are engaging with most — curated by our editors until analytics is connected.',
    }),
    defineField({
      name: 'featuredPosts',
      title: 'Featured posts (priority order)',
      description:
        'Drag to reorder. These appear first in Popular sections across the site, before automatically selected recent stories.',
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
      description: 'Total posts shown after merging featured and automatic picks.',
      type: 'number',
      initialValue: 12,
      validation: (Rule) => Rule.required().min(4).max(100).integer(),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Popular Page' }
    },
  },
})
