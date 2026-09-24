import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, unlink, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { generatePhotos, photoTitle } from '../scripts/photos.mjs';

async function fixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'andrea-photo-test-'));
  t.after(async () => {
    const target = path.resolve(directory);
    if (path.dirname(target) !== path.resolve(os.tmpdir()) || !path.basename(target).startsWith('andrea-photo-test-')) throw new Error('Cartella test non valida');
    await rm(target, { recursive: true, force: true });
  });
  const source = path.join(directory, 'source');
  const output = path.join(directory, 'output');
  await mkdir(source);
  return { source, output };
}

async function photograph(target, width = 90, height = 60) {
  await sharp({ create: { width, height, channels: 3, background: '#84937c' } }).png().toFile(target);
}

test('gallery vuota, aggiunta e rimozione senza manifest manuale', async t => {
  const options = await fixture(t);
  assert.deepEqual(await generatePhotos(options), []);
  const photo = path.join(options.source, '01-prima-foto.PNG');
  await photograph(photo);
  const result = await generatePhotos(options);
  assert.equal(result.length, 1);
  assert.equal(result[0].title, 'Prima foto');
  assert.equal(result[0].width / result[0].height, 1.5);
  assert.equal(result[0].variants.length, 1, 'nessun ingrandimento degli originali piccoli');
  await unlink(photo);
  assert.deepEqual(await generatePhotos(options), []);
  assert.deepEqual(await readdir(options.output), [], 'le immagini eliminate non restano pubblicate');
});

for (const count of [5, 24]) {
  test(`gallery con ${count} foto miste, nomi speciali e categorie`, async t => {
    const options = await fixture(t);
    await mkdir(path.join(options.source, 'Viaggi'));
    for (let index = count; index > 0; index--) {
      await photograph(path.join(options.source, `${index}-città & luce.png`), index % 2 ? 90 : 60, index % 2 ? 60 : 90);
    }
    await photograph(path.join(options.source, 'Viaggi', '1-città & luce.png'));
    await writeFile(path.join(options.source, 'README.md'), 'not a photograph');
    const result = await generatePhotos(options);
    assert.equal(result.length, count + 1);
    assert.equal(new Set(result.map(photo => photo.id)).size, count + 1);
    assert.equal(result[0].width, 90);
    assert.equal(result[1].width, 60, 'ordinamento numerico naturale');
    assert.equal(result.at(-1).category, 'Viaggi');
    for (const photo of result) {
      const metadata = await sharp(await readFile(path.join(options.output, path.basename(photo.src)))).metadata();
      assert.equal(metadata.width / metadata.height, photo.width / photo.height);
      assert.match(photo.src, /^generated\/photos\/[a-f0-9]+-\d+\.webp$/);
    }
  });
}

test('orientamento EXIF applicato a dimensioni e immagini', async t => {
  const options = await fixture(t);
  await sharp({ create: { width: 120, height: 80, channels: 3, background: '#fafafa' } })
    .jpeg().withMetadata({ orientation: 6 }).toFile(path.join(options.source, 'rotated.jpg'));
  const [photo] = await generatePhotos(options);
  assert.equal(photo.width, 80);
  assert.equal(photo.height, 120);
  const metadata = await sharp(await readFile(path.join(options.output, path.basename(photo.src)))).metadata();
  assert.equal(metadata.width, 80);
  assert.equal(metadata.height, 120);
  assert.equal(metadata.orientation, undefined);
});

test('file corrotto produce un errore con nome, senza omissioni silenziose', async t => {
  const options = await fixture(t);
  await writeFile(path.join(options.source, 'corrotta.jpg'), 'broken');
  await assert.rejects(generatePhotos(options), /corrotta\.jpg/);
});

test('titoli automatici leggibili', () => {
  assert.equal(photoTitle('Viaggi/02-una-città_al-mattino.JPG'), 'Una città al mattino');
});

test('GIF inclusa nella gallery come immagine statica', async t => {
  const options = await fixture(t);
  await sharp({ create: { width: 60, height: 90, channels: 3, background: '#84937c' } })
    .gif().toFile(path.join(options.source, 'pixelart.gif'));
  const [photo] = await generatePhotos(options);
  assert.equal(photo.title, 'Pixelart');
  assert.equal(photo.width, 60);
  assert.equal(photo.height, 90);
  assert.match(photo.full, /\.webp$/);
});
