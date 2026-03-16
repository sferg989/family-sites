import type { DigitalAsset } from './page';

export interface BaseContent {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body: { html: string };
  heroImage?: DigitalAsset;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  metaDescription?: string;
  keywords?: string;
}

export interface BlogPost extends BaseContent {
  author?: string;
  tags?: string[];
  highlights?: DigitalAsset[];
}

export interface ArtPiece extends BaseContent {
  artist?: string;
  medium?: string;
  dimensions?: string;
  year?: number;
  tags?: string[];
  galleryImages?: DigitalAsset[];
}

export interface SoccerGame extends BaseContent {
  gameDate?: string;
  opponent?: string;
  score?: string;
  location?: string;
  season?: string;
  highlights?: DigitalAsset[];
}

export interface ContentListItem {
  title: string;
  slug: string;
  excerpt?: string | undefined;
  heroImage?: DigitalAsset | undefined;
  publishedAt?: string | undefined;
  meta?: string | undefined;
}
