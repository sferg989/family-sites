import { defineConfig } from 'astro/config';


import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://micah-ferguson.com',
  integrations: [sitemap()],
  image: {
    remotePatterns: [{ protocol: 'https' }]
  },
  middleware: [
    {
      name: 'trailing-slash',
      handler: './src/middleware.ts'
    }
  ]
});
