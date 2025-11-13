import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import ui from '@nuxt/ui/vite';
import nuxtUiStyles from './src/components/nuxt-ui/index';
import { fileURLToPath, URL } from 'node:url';
import vueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 8080,
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    commonjsOptions: { transformMixedEsModules: true },
  },
  optimizeDeps: {
    include: ['prosemirror-state', 'prosemirror-view', 'prosemirror-model', 'prosemirror-transform', 'prosemirror-commands', 'prosemirror-history'],
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      injectRegister: false,
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MyCompany',
        short_name: 'MyCompany',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'images/icons/pwa/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'images/icons/pwa/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'images/icons/pwa/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'images/icons/pwa/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 8MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
    ui({
      ui: nuxtUiStyles as any,
      autoImport: {
        imports: ['vue', '@vueuse/core', 'vue-router', 'vee-validate'],
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.vue\.[tj]sx?\?vue/, /\.md$/],
        dts: './auto-imports.d.ts',
        viteOptimizeDeps: true,
        vueTemplate: true,
        injectAtEnd: true,
      },
    }),
  ],
});
