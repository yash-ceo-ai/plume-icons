import { defineConfig } from 'astro/config';

// GitHub Pages serves the site at https://yash-ceo-ai.github.io/plume-icons/ (later: a Cloudflare Worker).
export default defineConfig({
  site: 'https://yash-ceo-ai.github.io',
  base: '/plume-icons',
  trailingSlash: 'ignore',
});
