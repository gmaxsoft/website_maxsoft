import { defineConfig } from 'astro/config';
import sharp from 'sharp'; // Opcjonalnie, dla szybszej transformacji
import node from '@astrojs/node'; // 🚨 Dodaj adapter

export default defineConfig({
  site: 'https://maxsoft.pl',
  output: 'server',
  trailingSlash: 'always',
  adapter: node({
    mode: 'standalone',
  }),
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  image: {
    serviceEntryPoint: '@astrojs/image/sharp' // Użyj sharp dla lepszej wydajności (opcjonalnie)
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['./node_modules'], // Pomaga w resolvowaniu ścieżek
        },
      },
    },
  }
});