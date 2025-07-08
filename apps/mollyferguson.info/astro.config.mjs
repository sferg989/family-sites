import { defineConfig } from 'astro/config';


import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://mollyferguson.info',
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
