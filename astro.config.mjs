import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  integrations: [mdx(), react()],
  vite: { plugins: [tailwindcss()] },
  // Languages are defined in src/i18n/ui.ts. The [lang] pages generate
  // explicit static routes; no runtime locale middleware is needed.
  // Add `site: 'https://your-actual-domain'` when deploying.
});
