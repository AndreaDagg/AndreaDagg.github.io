import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, unlink, rm } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { createServer } from 'vite';
import { watchPhotos } from '../scripts/watch-photos.mjs';

test('server dev aggiorna il manifest dopo aggiunta, modifica e rimozione', { timeout: 30000 }, async t => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'andrea-watch-test-'));
  let server;
  t.after(async () => {
    await server?.close();
    const target = path.resolve(root);
    if (path.dirname(target) !== path.resolve(os.tmpdir()) || !path.basename(target).startsWith('andrea-watch-test-')) throw new Error('Cartella test non valida');
    await rm(target, { recursive: true, force: true, maxRetries: 3 });
  });
  const source = path.join(root, 'src/assets/photos');
  const manifest = path.join(root, 'src/generated/photos.json');
  await mkdir(path.join(root, 'img'), { recursive: true });
  await mkdir(source, { recursive: true });
  const input = await sharp({ create: { width: 90, height: 60, channels: 3, background: '#718068' } }).png().toBuffer();
  for (const filename of ['profile.jpg', 'N.V.2.png', 'Senza titolo-2.png']) {
    await sharp(input).toFile(path.join(root, 'img', filename));
  }
  server = await createServer({
    configFile: false, root, logLevel: 'silent',
    plugins: [watchPhotos()],
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { host: '127.0.0.1', port: 0, watch: { ignored: ['**/public/generated/**'], awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 20 } } },
  });
  await server.listen();
  assert.deepEqual(JSON.parse(await readFile(manifest, 'utf8')), []);
  async function waitFor(check) {
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        const photos = JSON.parse(await readFile(manifest, 'utf8'));
        if (check(photos)) return photos;
      } catch { /* The watcher may be completing the manifest write. */ }
      await delay(100);
    }
    assert.fail('Manifest non aggiornato automaticamente');
  }
  const filename = path.join(source, 'nuova-foto.png');
  await sharp(input).toFile(filename);
  const added = await waitFor(photos => photos.length === 1);
  assert.equal(added[0].title, 'Nuova foto');
  await sharp({ create: { width: 60, height: 90, channels: 3, background: '#718068' } }).png().toFile(filename);
  const changed = await waitFor(photos => photos[0]?.height === 90);
  assert.notEqual(changed[0].id, added[0].id);
  await unlink(filename);
  await waitFor(photos => photos.length === 0);
});
