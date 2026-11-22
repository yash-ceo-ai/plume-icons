import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// astro-icon reads Plume through the "@iconify-json/plume" alias of the plume-icons package.
export default defineConfig({
  integrations: [icon({ include: { plume: ['search-line', 'gear-fill'] } })],
});
