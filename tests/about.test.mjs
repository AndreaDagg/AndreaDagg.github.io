import test from 'node:test';
import assert from 'node:assert/strict';
import { renderAbout } from '../src/pages/about-selector.js';

test('about page include tre tab tematici e un prompt di scelta', () => {
  const html = renderAbout();
  assert.match(html, /Lavoro\s*[-–]\s*Full stack/i);
  assert.match(html, /Foto e Video/i);
  assert.match(html, /Music/i);
  assert.match(html, /Quale di queste cose vuoi approfondire/i);
  assert.match(html, /Tecnologie/i);
});
