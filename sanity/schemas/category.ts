import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The display name for this category',
      validation: (Rule) => Rule.required().min(2).max(80).error('Title must be between 2 and 80 characters'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the title. Click "Generate" to auto-create from title.',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug is required for the category URL'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional description for SEO and category pages',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Untitled Category',
        subtitle: subtitle || 'No description',
      }
    },
  },
  orderings: [
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Title, Z-A',
      name: 'titleDesc',
      by: [{ field: 'title', direction: 'desc' }],
    },
  ],
})
