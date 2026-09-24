import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { generatePhotos } from './photos.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export async function prepareGallery(root = projectRoot) {
  const generated = path.join(root, 'src/generated');
  await mkdir(generated, { recursive: true });
  const photos = await generatePhotos({
    source: path.join(root, 'src/assets/photos'),
    output: path.join(root, 'public/generated/photos'),
  });
  await writeFile(path.join(generated, 'photos.json'), JSON.stringify(photos, null, 2) + '\n');
  return photos;
}

export async function prepareAssets(root = projectRoot) {
  const photos = await prepareGallery(root);
  const media = path.join(root, 'public/generated/media');
  await mkdir(media, { recursive: true });

  for (const [source, target, width] of [
    ['profile.jpg', 'portrait.webp', 640],
    ['N.V.2.png', 'nadia.webp', 960],
    ['Senza titolo-2.png', 'favicon.png', 64],
  ]) {
    let pipeline = sharp(path.join(root, 'img', source)).autoOrient().resize({ width, withoutEnlargement: true });
    pipeline = target.endsWith('.png') ? pipeline.png() : pipeline.webp({ quality: 90 });
    await pipeline.toFile(path.join(media, target));
  }
  console.log(`Asset pronti: ${photos.length} fotografie + ritratto, anteprima e favicon.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await prepareAssets();
}
