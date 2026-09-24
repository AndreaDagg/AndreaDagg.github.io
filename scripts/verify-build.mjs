import { readFile, stat, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = path.join(root, 'dist');
const html = await readFile(path.join(dist, 'index.html'), 'utf8');
if (html.includes('%BASE_URL%') || html.includes('/src/main.js')) throw new Error('HTML non compilato');

async function verifyAsset(reference, parent = dist) {
  if (/^(?:https?:|data:|#)/.test(reference)) return;
  if (reference.startsWith('/')) throw new Error(`URL assoluto non portabile: ${reference}`);
  const target = path.resolve(parent, decodeURIComponent(reference.split(/[?#]/)[0]));
  if (!target.startsWith(dist + path.sep)) throw new Error(`Asset fuori dalla build: ${reference}`);
  if (!(await stat(target)).isFile()) throw new Error(`Asset mancante: ${reference}`);
}

for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) await verifyAsset(match[1]);
const photos = JSON.parse(await readFile(path.join(root, 'src/generated/photos.json'), 'utf8'));
for (const photo of photos) for (const variant of photo.variants) await verifyAsset(variant.src);
for (const file of ['portrait.webp', 'nadia.webp', 'favicon.png']) await verifyAsset(`generated/media/${file}`);
await stat(path.join(dist, '.nojekyll'));

let javascript = 0;
let css = 0;
for (const filename of await readdir(path.join(dist, 'assets'))) {
  const content = await readFile(path.join(dist, 'assets', filename));
  if (filename.endsWith('.js')) javascript += gzipSync(content).length;
  if (filename.endsWith('.css')) {
    css += gzipSync(content).length;
    for (const match of content.toString().matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
      await verifyAsset(match[1], path.join(dist, 'assets'));
    }
  }
}
console.log(`Build verificata: asset presenti, URL relativi, ${photos.length} fotografie. JS ${(javascript / 1024).toFixed(1)} KiB gzip; CSS ${(css / 1024).toFixed(1)} KiB gzip.`);
