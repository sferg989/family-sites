// Export components
export { default as Footer } from './src/components/Footer.astro';
export { default as FormattedDate } from './src/components/FormattedDate.astro';
export { default as Picture } from './src/components/Picture.astro';
export { default as SocialLinks } from './src/components/SocialLinks.astro';
export { default as VideoDisplay } from './src/components/VideoDisplay.astro';
export { default as SEOHead } from './src/components/SEOHead.astro';
export { default as ContentCard } from './src/components/ContentCard.astro';
export { default as ContentListing } from './src/components/ContentListing.astro';

// Export utilities
export { GraphQLClient } from './src/util/graphQLClient/graphQLClient';
export { GET_ALL_PAGES, GET_PAGE_BY_SLUG } from './src/util/pageQueries/pageQueries';
export { PageService } from './src/util/pageService/pageService';
export { RestService } from './src/util/restService/restService';

// Site config utilities
export { GET_SITE_CONFIG } from './src/util/siteConfigQueries/siteConfigQueries';
export { SiteConfigService } from './src/util/siteConfigService/siteConfigService';
export { getSocialIcon, SOCIAL_ICONS } from './src/util/socialIcons/socialIcons';

// Content services
export { BlogService } from './src/util/services/blogService';
export { SoccerService } from './src/util/services/soccerService';

// Date utilities
export { formatGameDate } from './src/util/dateUtils/dateUtils';

// Export types
export type { Page, Pages, DigitalAsset } from './src/util/types/page';
export type {
  SiteConfig,
  SiteIdentifier,
  SocialPlatform,
  NavigationItem,
  SocialLink
} from './src/util/types/siteConfig';
export type { SocialIconData } from './src/util/socialIcons/socialIcons';
export type {
  BaseContent,
  BlogPost,
  ArtPiece,
  SoccerGame,
  ContentListItem
} from './src/util/types/content';
