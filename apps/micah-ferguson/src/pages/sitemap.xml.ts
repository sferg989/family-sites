import type { APIRoute } from 'astro';
import { PageService } from '../services/pageService';
import { BlogService } from '../services/blogService';
import { SoccerService } from '../services/soccerService';
import type { Page, BlogPost, SoccerGame } from '@sferg989/astro-utils';

export const GET: APIRoute = async ({ site }) => {
  const endpoint = import.meta.env.ASTRO_HYGRAPH_ENDPOINT;

  // Initialize services
  PageService.initialize(endpoint);
  BlogService.initialize(endpoint);
  SoccerService.initialize(endpoint);

  // Fetch all content
  const [pagesResult, blogResult, soccerResult] = await Promise.all([
    PageService.getNavigationPages(),
    BlogService.getAllPosts(),
    SoccerService.getAllGames()
  ]);

  if (!site) {
    throw new Error('Site URL is not configured. Add a site property to your astro.config.mjs file.');
  }

  const today = new Date().toISOString().split('T')[0];

  // Build sitemap entries
  const links = [
    // Homepage
    {
      url: new URL('/', site).toString(),
      lastModified: today,
      priority: '1.0'
    },
    // Blog index
    {
      url: new URL('/blog/', site).toString(),
      lastModified: today,
      priority: '0.8'
    },
    // Soccer index
    {
      url: new URL('/soccer/', site).toString(),
      lastModified: today,
      priority: '0.8'
    },
    // Dynamic pages
    ...pagesResult.pages.map((page: Page) => ({
      url: new URL(`/${page.slug}`, site).toString(),
      lastModified: page.updatedAt
        ? new Date(page.updatedAt).toISOString().split('T')[0]
        : today,
      priority: '0.7'
    })),
    // Blog posts
    ...blogResult.blogPosts.map((post: BlogPost) => ({
      url: new URL(`/blog/${post.slug}`, site).toString(),
      lastModified: post.updatedAt
        ? new Date(post.updatedAt).toISOString().split('T')[0]
        : today,
      priority: '0.6'
    })),
    // Soccer games
    ...soccerResult.soccerGames.map((game: SoccerGame) => ({
      url: new URL(`/soccer/${game.slug}`, site).toString(),
      lastModified: game.updatedAt
        ? new Date(game.updatedAt).toISOString().split('T')[0]
        : today,
      priority: '0.6'
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${links.map(link => `  <url>
    <loc>${link.url}</loc>
    <lastmod>${link.lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${link.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
};
