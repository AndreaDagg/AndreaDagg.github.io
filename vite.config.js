import { defineConfig } from 'vite';
import { watchPhotos } from './scripts/watch-photos.mjs';

export default defineConfig({
  // Relative URLs work at the domain root, under /repository/ and on a custom domain.
  base: './',
  plugins: [watchPhotos()],
  server: { watch: { ignored: ['**/public/generated/**'], awaitWriteFinish: { stabilityThreshold: 600, pollInterval: 100 } } },
  optimizeDeps: { noDiscovery: true, include: [] },
  build: { target: 'es2022', assetsInlineLimit: 0 },
});
