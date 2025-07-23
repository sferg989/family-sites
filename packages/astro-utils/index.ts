// Export components
export { default as Footer } from './src/components/Footer.astro';
export { default as FormattedDate } from './src/components/FormattedDate.astro';
export { default as SocialLinks } from './src/components/SocialLinks.astro';
export { default as VideoDisplay } from './src/components/VideoDisplay.astro';
export { default as SEOHead } from './src/components/SEOHead.astro';

// Export utilities
export { GraphQLClient } from './src/util/graphQLClient/graphQLClient';
export { optimizeImages } from './src/util/optimizeImages/optimizeImages';
export { GET_ALL_PAGES, GET_PAGE_BY_SLUG } from './src/util/pageQueries/pageQueries';
export { PageService } from './src/util/pageService/pageService';
export { RestService } from './src/util/restService/restService';

// Export types
export type { Page, Pages, DigitalAsset } from './src/util/types/page';
