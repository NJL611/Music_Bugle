import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '../env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  perspective: "published",
  stega: {
    enabled: false,
    // Must match `basePath` in sanity.config.ts — /studio has never existed in this app.
    studioUrl: "/admin-content",
  },
})
