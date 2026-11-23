// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Static Site Generation: pure HTML/CSS output, React islands hydrate on demand.
  output: 'static',
  // Replace with the production URL once deployed (used for canonical/OG URLs).
  site: 'https://syedmuntazir.dev',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
