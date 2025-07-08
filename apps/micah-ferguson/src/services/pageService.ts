import { GraphQLClient } from '@sferg989/astro-utils';
import type { Page, Pages } from '@sferg989/astro-utils';

export class PageService {
  private static client: GraphQLClient;

  static initialize(endpoint: string): void {
    this.client = GraphQLClient.Instance(endpoint);
  }

  static async getHomePage(): Promise<{ page: Page }> {
    return this.client.request(`
      query HomePage {
        page(where: { slug: "homepage" }) {
          title
          slug
          publishedAt
          updatedAt
          heroImage {
            id
            url
            mimeType
          }
          body {
            html
          }
          metaDescription
          keywords
        }
      }
    `);
  }

  static async getNavigationPages(): Promise<Pages> {
    return this.client.request(`
      query NavigationPages {
        pages(where: { slug_not: "homepage" }) {
          title
          slug
        }
      }
    `);
  }

  static async getPageBySlug(slug: string): Promise<{ page: Page }> {
    return this.client.request(`
      query PageBySlug($slug: String!) {
        page(where: { slug: $slug }) {
          title
          slug
          publishedAt
          updatedAt
          highlights {
            id
            url
            mimeType
          }
          heroImage {
            id
            url
            mimeType
          }
          body {
            html
          }
          metaDescription
          keywords
        }
      }
    `, { slug });
  }
} 