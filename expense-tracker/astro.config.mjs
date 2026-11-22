// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages serves this at /Expense-Tracker (set by the deploy workflow)
  base: process.env.BASE_PATH || '/',
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});