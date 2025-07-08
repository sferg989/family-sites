import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('Site URL is not configured. Add a site property to your astro.config.mjs file.');
  }
  
  const robotsTxt = `
User-agent: *
Allow: /

# Sitemap
Sitemap: ${new URL('sitemap.xml', site).toString()}
`.trim();

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=3600'
    }
  });
}; 