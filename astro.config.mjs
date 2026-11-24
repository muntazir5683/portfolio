// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Static Site Generation: pure HTML/CSS output, React islands hydrate on demand.
  output: 'static',
  // Production origin — used for canonical, OG, sitemap, and JSON-LD URLs.
  site: 'https://syedmuntazir.dev',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
