export type SiteIdentifier = 'MOLLY' | 'MICAH' | 'CALEB';

export type SocialPlatform = 'TWITTER' | 'INSTAGRAM' | 'LINKEDIN' | 'YOUTUBE' | 'TIKTOK' | 'MASTODON';

export type NavigationItem = {
  label: string;
  href: string;
  sortOrder?: number;
};

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  label?: string;
};

export type SiteConfig = {
  site: SiteIdentifier;
  siteTitle: string;
  siteDescription?: string;
  navigationItems: NavigationItem[];
  socialLinks: SocialLink[];
};
