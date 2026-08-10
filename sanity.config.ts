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

// The Studio runs from several origins: embedded at /admin-content, the hosted
// mb-prod.sanity.studio bundle, AND Sanity's dashboard at sanity.io. Relative preview URLs only
// resolve when the studio origin IS the site — anywhere else they route into the studio's own
// router ("Workspace not found"), so every non-embedded origin gets absolute URLs.
const isEmbeddedStudio =
  typeof window !== 'undefined' &&
  (window.location.origin === SITE_URL || window.location.hostname === 'localhost')

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
      ...(isEmbeddedStudio ? {} : { allowOrigins: [SITE_URL] }),
      previewUrl: {
        ...(isEmbeddedStudio ? {} : { initial: SITE_URL }),
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
                ? [
                    {
                      title: doc.title || 'Untitled',
                      href: `${isEmbeddedStudio ? '' : SITE_URL}/preview/${doc.slug}`,
                    },
                  ]
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
