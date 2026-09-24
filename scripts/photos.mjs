import { createHash } from 'node:crypto';
import { readdir, mkdir, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export const photoExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff', '.gif']);

export async function discoverPhotos(directory, prefix = '') {
  await mkdir(directory, { recursive: true });
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await discoverPhotos(path.join(directory, entry.name), relative));
    else if (entry.isFile() && photoExtensions.has(path.extname(entry.name).toLowerCase())) files.push(relative);
  }
  return files.sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'variant' }));
}

export function photoTitle(file) {
  const title = path.posix.basename(file, path.posix.extname(file))
    .replace(/^\d+[-_\s]+/, '').replace(/[-_]+/g, ' ').trim();
  return title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Fotografia';
}

export async function generatePhotos({ source, output, urlPrefix = 'generated/photos' }) {
  const files = await discoverPhotos(source);
  await mkdir(output, { recursive: true });
  const keep = new Set();
  const photos = [];
  for (const file of files) {
    try {
      const input = await readFile(path.join(source, file));
      const id = createHash('sha256').update(file).update(input).digest('hex').slice(0, 16);
      const metadata = await sharp(input).metadata();
      const rotated = [5, 6, 7, 8].includes(metadata.orientation);
      const width = rotated ? metadata.height : metadata.width;
      const height = rotated ? metadata.width : metadata.height;
      if (!width || !height) throw new Error('Dimensioni non disponibili');
      const widths = [...new Set([480, 960, 1600, 2560, 3840].map(size => Math.min(size, width)))];
      const variants = [];
      for (const size of widths) {
        const filename = `${id}-${size}.webp`;
        keep.add(filename);
        const { width: actualWidth, height: actualHeight } = await sharp(input)
          .autoOrient().resize({ width: size, withoutEnlargement: true })
          .webp({ quality: size === widths.at(-1) ? 94 : 86, effort: 5 })
          .toFile(path.join(output, filename));
        variants.push({ src: `${urlPrefix}/${filename}`, width: actualWidth, height: actualHeight });
      }
      const preview = variants.find(item => item.width >= Math.min(960, width)) ?? variants.at(-1);
      photos.push({
        id, title: photoTitle(file), alt: photoTitle(file),
        category: path.posix.dirname(file) === '.' ? null : path.posix.dirname(file),
        width, height, src: preview.src, full: variants.at(-1).src,
        variants,
      });
    } catch (error) {
      throw new Error(`Impossibile preparare la fotografia "${file}": ${error.message}`, { cause: error });
    }
  }
  // Only generated WebP files are removed; source photographs are never touched.
  for (const entry of await readdir(output, { withFileTypes: true })) {
    if (entry.isFile() && /^[a-f0-9]{16}-\d+\.webp$/.test(entry.name) && !keep.has(entry.name)) {
      await unlink(path.join(output, entry.name));
    }
  }
  return photos;
}
