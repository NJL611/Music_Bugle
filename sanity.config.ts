/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...index]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { defineDocuments, defineLocations, presentationTool } from 'sanity/presentation'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schema'
import { SITE_URL } from './src/lib/constants'

// The Studio runs from two origins: embedded at /admin-content (same origin as the site) and the
// hosted mb-prod.sanity.studio bundle. Relative preview URLs only resolve correctly when embedded;
// the hosted studio must aim at the production site explicitly.
const isHostedStudio =
  typeof window !== 'undefined' && window.location.hostname.endsWith('.sanity.studio')

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
    // Side-by-side draft preview. It points at /preview/[slug], not /article/[slug], because the
    // article route stays force-static for the 800+ published posts and so ignores draft mode.
    presentationTool({
      title: 'Preview',
      ...(isHostedStudio ? { allowOrigins: [SITE_URL] } : {}),
      previewUrl: {
        ...(isHostedStudio ? { initial: SITE_URL } : {}),
        previewMode: { enable: '/api/draft-mode/enable' },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/preview/:slug',
            filter: '_type == "post" && slug.current == $slug',
          },
        ]),
        locations: {
          post: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              // `message` replaces the default "Used on one page" banner label, which no editor
              // reads as "this is where you preview the article".
              message: doc?.slug ? 'Preview this article' : 'Add a slug to enable preview',
              tone: doc?.slug ? 'positive' : 'caution',
              locations: doc?.slug
                ? [{ title: doc.title || 'Untitled', href: `/preview/${doc.slug}` }]
                : [],
            }),
          }),
        },
      },
    }),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
