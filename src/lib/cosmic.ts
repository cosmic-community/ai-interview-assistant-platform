import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: import.meta.env.VITE_COSMIC_BUCKET_SLUG as string,
  readKey: import.meta.env.VITE_COSMIC_READ_KEY as string,
  writeKey: import.meta.env.VITE_COSMIC_WRITE_KEY as string,
})