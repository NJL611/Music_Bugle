import { defineType } from 'sanity'

export default defineType({
    name: 'tag',
    title: 'Tag',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
        },
    ],
})
