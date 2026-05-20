import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'enrich-post',
      timeout: 90,
      event: {
        on: ['publish'],
        filter: `_type == "post" && (!defined(subtitle) || !defined(tags) || count(tags) == 0 || !defined(categories) || count(categories) == 0)`,
        projection: `{title, _id, _type, body, subtitle, "tagCount": count(coalesce(tags, [])), "categoryCount": count(coalesce(categories, []))}`
      }
    })
  ]
})
