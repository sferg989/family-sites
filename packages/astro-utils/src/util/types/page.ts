export type DigitalAsset = {
  id: string
  url: string
  alt: string
  mimeType: 'video/mp4' | 'image/jpeg' | 'image/png'
}

export type Page = {
  title: string
  slug: string
  publishedAt: string
  updatedAt: string
  heroImage: DigitalAsset
  highlights: DigitalAsset[]
  metaDescription: string
  keywords: string
  body: {
    html: string
  }
}

export type Pages = {
  pages: Page[]
}
