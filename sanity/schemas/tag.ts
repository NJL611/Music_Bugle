import { defineField, defineType } from 'sanity'
import { HashIcon } from '@sanity/icons'

export default defineType({
    name: 'tag',
    title: 'Tag',
    type: 'document',
    icon: HashIcon,
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'The display name for this tag (without the # symbol)',
            validation: (Rule) => Rule.required().min(2).max(50).error('Title must be between 2 and 50 characters'),
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
            validation: (Rule) => Rule.required().error('Slug is required for the tag URL'),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Optional description for SEO and tag pages',
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
                title: title ? `#${title}` : 'Untitled Tag',
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
