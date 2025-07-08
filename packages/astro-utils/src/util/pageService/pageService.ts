import { GraphQLClient } from '../graphQLClient/graphQLClient';
import { GET_ALL_PAGES, GET_PAGE_BY_SLUG } from '../pageQueries/pageQueries';
import type { Page, Pages } from '../types/page';

export class PageService {
  private static client: GraphQLClient;

  static initialize(endpoint: string) {
    this.client = GraphQLClient.Instance(endpoint);
  }

  static async getAllPages(): Promise<Pages> {
    return this.client.request<Pages>(GET_ALL_PAGES);
  }

  static async getPageBySlug(slug: string): Promise<{ page: Page }> {
    return this.client.request<{ page: Page }>(GET_PAGE_BY_SLUG, { slug });
  }
}
