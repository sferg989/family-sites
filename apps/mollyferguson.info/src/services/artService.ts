import { GraphQLClient } from '@sferg989/astro-utils';
import type { ArtPiece } from '@sferg989/astro-utils';

export class ArtService {
  private static client: GraphQLClient;

  static initialize(endpoint: string): void {
    this.client = GraphQLClient.Instance(endpoint);
  }

  static async getAllPieces(): Promise<{ artPieces: ArtPiece[] }> {
    return this.client.request(`
      query AllArtPieces {
        artPieces(orderBy: createdAt_DESC) {
          id
          title
          slug
          excerpt
          publishedAt
          createdAt
          artist
          medium
          year
          tags
          heroImage {
            id
            url
            mimeType
          }
        }
      }
    `);
  }

  static async getPieceBySlug(slug: string): Promise<{ artPiece: ArtPiece }> {
    return this.client.request(`
      query ArtPieceBySlug($slug: String!) {
        artPiece(where: { slug: $slug }) {
          id
          title
          slug
          excerpt
          body {
            html
          }
          heroImage {
            id
            url
            mimeType
          }
          publishedAt
          createdAt
          updatedAt
          artist
          medium
          dimensions
          year
          tags
          metaDescription
          keywords
          galleryImages {
            id
            url
            mimeType
          }
        }
      }
    `, { slug });
  }
}
