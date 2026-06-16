/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schema'

export default defineConfig({
  basePath: '/admin-content',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Trending Page')
              .child(
                S.document()
                  .schemaType('trendingPage')
                  .documentId('trendingPage'),
              ),
            S.listItem()
              .title('Popular Page')
              .child(
                S.document()
                  .schemaType('popularPage')
                  .documentId('popularPage'),
              ),
            ...S.documentTypeListItems().filter(
              (listItem) => !['trendingPage', 'popularPage'].includes(listItem.getId() ?? ''),
            ),
          ]),
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
