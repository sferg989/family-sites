export const GET_SITE_CONFIG = `
  query SiteConfig($site: SiteIdentifier!) {
    siteConfigs(where: { site: $site }, first: 1) {
      site
      siteTitle
      siteDescription
      navigationItems {
        label
        href
        sortOrder
      }
      socialLinks {
        platform
        url
        label
      }
    }
  }
`;
