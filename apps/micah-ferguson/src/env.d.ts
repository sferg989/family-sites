/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
  readonly ASTRO_HYGRAPH_ENDPOINT: string
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
