import { GraphQLClient as GQ } from 'graphql-request';

export class GraphQLClient {
  private static instance: GraphQLClient | null = null;
  private client: GQ;

  private constructor(endpoint: string) {
    if (!endpoint) {
      throw new Error('GraphQL endpoint is not defined');
    }
    this.client = new GQ(endpoint);
  }

  public static Instance(endpoint?: string): GraphQLClient {
    if (!this.instance && endpoint) {
      this.instance = new GraphQLClient(endpoint);
    } else if (!this.instance) {
      throw new Error('GraphQL endpoint must be provided when initializing the client');
    }
    return this.instance;
  }

  public async request<T>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return this.client.request<T>(query, variables);
  }
}
