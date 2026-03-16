import { GraphQLClient } from '../graphQLClient/graphQLClient';
import type { SoccerGame } from '../types/content';

export class SoccerService {
  private static client: GraphQLClient;

  static initialize(endpoint: string): void {
    this.client = GraphQLClient.Instance(endpoint);
  }

  static async getAllGames(): Promise<{ soccerGames: SoccerGame[] }> {
    return this.client.request(`
      query AllSoccerGames {
        soccerGames(orderBy: gameDate_DESC) {
          id
          title
          slug
          excerpt
          gameDate
          opponent
          score
          location
          season
          heroImage {
            id
            url
            mimeType
          }
        }
      }
    `);
  }

  static async getGameBySlug(slug: string): Promise<{ soccerGame: SoccerGame }> {
    return this.client.request(`
      query SoccerGameBySlug($slug: String!) {
        soccerGame(where: { slug: $slug }) {
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
          gameDate
          opponent
          score
          location
          season
          createdAt
          updatedAt
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
