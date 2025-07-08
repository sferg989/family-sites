import type { APIRoute } from 'astro';
import { PageService } from '@sferg989/astro-utils';

export const GET: APIRoute = async ({ site }) => {
  const endpoint = import.meta.env.ASTRO_HYGRAPH_ENDPOINT;
  PageService.initialize(endpoint);
  const { pages } = await PageService.getAllPages();
  
  // Ensure the site URL is available
  if (!site) {
    throw new Error('Site URL is not configured. Add a site property to your astro.config.mjs file.');
  }
  
  // Format pages into sitemap entries
  const links = [
    // Add homepage
    { 
      url: new URL('/', site).toString(),
      lastModified: new Date().toISOString().split('T')[0]
    },
    
    // Add all dynamic pages
    ...pages.map(page => ({
      url: new URL(`/page/${page.slug}`, site).toString(),
      lastModified: page.updatedAt 
        ? new Date(page.updatedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    }))
  ];
  
  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${links.map(link => `
  <url>
    <loc>${link.url}</loc>
    <lastmod>${link.lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${link.url === new URL('/', site).toString() ? '1.0' : '0.7'}</priority>
  </url>`).join('')}
</urlset>`;
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600'
    }
  });
}; 