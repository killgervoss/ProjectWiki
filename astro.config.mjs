import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  integrations: [mdx(), react()],
  vite: { plugins: [tailwindcss()] },
  // Set `site: 'https://your-domain.example'` when you know your real domain.
  // This starter assumes deployment at the domain root, without a `base` path.
});
