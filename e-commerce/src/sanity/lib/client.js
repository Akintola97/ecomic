import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production only
})
