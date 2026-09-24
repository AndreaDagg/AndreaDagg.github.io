import path from 'node:path';
import { photoExtensions } from './photos.mjs';
import { prepareAssets, prepareGallery } from './prepare-assets.mjs';

export function watchPhotos() {
  let timer;
  let running = Promise.resolve();
  let pending = false;
  let disposed = false;
  let stopWatching;

  return {
    name: 'portfolio-photo-watcher',
    apply: 'serve',
    async configureServer(server) {
      const root = server.config.root;
      const source = path.resolve(root, 'src/assets/photos');
      await prepareAssets(root);

      async function update() {
        while (pending && !disposed) {
          pending = false;
          try {
            const photos = await prepareGallery(root);
            if (!disposed) server.config.logger.info(`Gallery aggiornata: ${photos.length} fotografie.`);
          } catch (error) {
            server.config.logger.error(error.message);
            server.ws.send({ type: 'error', err: { message: error.message, stack: error.stack, plugin: 'portfolio-photo-watcher' } });
          }
        }
      }

      const onChange = (event, file) => {
        const relative = path.relative(source, path.resolve(file));
        if (disposed || relative.startsWith('..') || path.isAbsolute(relative)) return;
        if (!['add', 'change', 'unlink'].includes(event) || !photoExtensions.has(path.extname(file).toLowerCase())) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          pending = true;
          running = running.then(update);
        }, 400);
      };
      server.watcher.add(source);
      server.watcher.on('all', onChange);
      stopWatching = () => server.watcher.off('all', onChange);
    },
    async closeBundle() {
      disposed = true;
      clearTimeout(timer);
      stopWatching?.();
      await running;
    },
  };
}
