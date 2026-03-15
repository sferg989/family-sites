import { GraphQLClient } from '../graphQLClient/graphQLClient';
import { GET_SITE_CONFIG } from '../siteConfigQueries/siteConfigQueries';
import type { SiteConfig, SiteIdentifier, NavigationItem } from '../types/siteConfig';

export class SiteConfigService {
  private static client: GraphQLClient;

  static initialize(endpoint: string) {
    this.client = GraphQLClient.Instance(endpoint);
  }

  static async getSiteConfig(site: SiteIdentifier): Promise<SiteConfig | null> {
    const result = await this.client.request<{ siteConfigs: SiteConfig[] }>(
      GET_SITE_CONFIG,
      { site }
    );

    if (!result.siteConfigs || result.siteConfigs.length === 0) {
      return null;
    }

    const config = result.siteConfigs[0];

    // Sort navigation items by sortOrder
    if (config.navigationItems) {
      config.navigationItems = [...config.navigationItems].sort(
        (a: NavigationItem, b: NavigationItem) =>
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
      );
    }

    return config;
  }
}
