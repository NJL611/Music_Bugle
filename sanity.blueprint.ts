import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'enrich-post',
      timeout: 30,
      event: {
        on: ['publish'],
        filter: `_type == "post"`,
        projection: `{title, _id, _type, body}`
      }
    })
  ]
})
