import { GraphQLClient } from '../graphQLClient/graphQLClient';
import type { BlogPost } from '../types/content';

export class BlogService {
  private static client: GraphQLClient;

  static initialize(endpoint: string): void {
    this.client = GraphQLClient.Instance(endpoint);
  }

  static async getAllPosts(): Promise<{ blogPosts: BlogPost[] }> {
    return this.client.request(`
      query AllBlogPosts {
        blogPosts(orderBy: createdAt_DESC) {
          id
          title
          slug
          excerpt
          publishedAt
          createdAt
          author
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

  static async getPostBySlug(slug: string): Promise<{ blogPost: BlogPost }> {
    return this.client.request(`
      query BlogPostBySlug($slug: String!) {
        blogPost(where: { slug: $slug }) {
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
          author
          tags
          metaDescription
          keywords
          highlights {
            id
            url
            mimeType
          }
        }
      }
    `, { slug });
  }
}
