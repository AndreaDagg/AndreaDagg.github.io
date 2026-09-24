import { test, expect } from '@playwright/test';

for (const base of ['/', '/portfolio-test/']) {
  test(`build statica e navigazione diretta sotto ${base}`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(base);
    await expect(page.locator('h1')).toContainText('Andrea');
    await expect(page.locator('.social-links a')).toHaveCount(5);
    for (const route of ['photography', 'about', 'music', 'links']) {
      await page.locator(`nav [data-route="${route}"]`).click();
      await page.reload();
      await expect(page.locator(`nav [data-route="${route}"]`)).toHaveAttribute('aria-current', 'page');
      await expect(page.locator('h1')).toBeVisible();
      const images = await page.locator('img[src]').evaluateAll(elements => Promise.all(elements.filter(el => el.loading !== 'lazy').map(el => el.decode().then(() => true, () => false))));
      expect(images).not.toContain(false);
    }
    await page.goBack();
    await expect(page.locator('h1')).toContainText('Music');
    expect(errors).toEqual([]);
  });
}

for (const width of [320, 390, 768, 1366, 1920, 2560]) {
  test(`layout responsive ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['links', 'photography', 'about', 'music']) {
      await page.goto(`/#/${route}`);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      for (const link of await page.locator('nav a').all()) await expect(link).toBeInViewport();
    }
  });
}

test('lightbox: immagine reale, Escape, focus e contenimento', async ({ page }) => {
  await page.goto('/portfolio-test/#/photography');
  const count = await page.locator('[data-photo]').count();
  if (!count) {
    await expect(page.locator('.gallery-empty')).toBeVisible();
    return;
  }
  const trigger = page.locator('[data-photo]').first();
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.lightbox-image')).toHaveClass(/is-loaded/);
  if (count === 1) await expect(page.locator('.lightbox-controls')).toBeHidden();
  else await expect(page.locator('.lightbox-controls')).toBeVisible();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement.closest('dialog'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

async function galleryFixture(page, count) {
  await page.goto('http://127.0.0.1:5173/#/links');
  await expect(page.locator('.social-links a')).toHaveCount(5);
  await page.evaluate(async count => {
    const { renderPhotography, mountPhotography } = await import('/src/pages/photography.js');
    const items = Array.from({ length: count }, (_, index) => {
      const width = index % 2 ? 240 : 360;
      const height = index % 2 ? 360 : 240;
      const src = 'data:image/svg+xml;base64,' + btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${index % 2 ? '#718068' : '#a39780'}"/></svg>`);
      return { id: index, title: `Test ${index + 1}`, alt: `Test ${index + 1}`, src, full: src, width, height, variants: [{ src, width, height }] };
    });
    const main = document.querySelector('main');
    main.innerHTML = renderPhotography(items);
    mountPhotography(main, items);
  }, count);
}

for (const count of [0, 1, 5, 30]) {
  test(`gallery ${count} foto, proporzioni, tastiera e touch`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await galleryFixture(page, count);
    await expect(page.locator('[data-photo]')).toHaveCount(count);
    if (!count) {
      await expect(page.locator('.gallery-empty')).toBeVisible();
      await expect(page.locator('dialog')).toHaveCount(0);
      return;
    }
    for (const width of count === 30 ? [390, 768, 1440] : [390]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      for (const image of await page.locator('.photo-button img').all()) {
        const ratio = await image.evaluate(el => {
          const rect = el.getBoundingClientRect();
          return { rendered: rect.width / rect.height, expected: Number(el.getAttribute('width')) / Number(el.getAttribute('height')) };
        });
        expect(ratio.rendered).toBeCloseTo(ratio.expected, 2);
      }
    }
    await page.locator('[data-photo="0"]').click();
    await expect(page.locator('.lightbox-caption')).toHaveText('Test 1');
    if (count > 1) {
      await page.keyboard.press('ArrowRight');
      await expect(page.locator('.lightbox-caption')).toHaveText('Test 2');
      await page.keyboard.press('ArrowLeft');
      await expect(page.locator('.lightbox-caption')).toHaveText('Test 1');
      await page.keyboard.press('ArrowLeft');
      await expect(page.locator('.lightbox-caption')).toHaveText(`Test ${count}`);
      await page.getByRole('button', { name: 'Fotografia successiva' }).click();
      await expect(page.locator('.lightbox-caption')).toHaveText('Test 1');
      await page.locator('.lightbox-stage').evaluate(target => {
        const start = new Touch({ identifier: 0, target, clientX: 300, clientY: 200 });
        const end = new Touch({ identifier: 0, target, clientX: 100, clientY: 210 });
        target.dispatchEvent(new TouchEvent('touchstart', { touches: [start], bubbles: true }));
        target.dispatchEvent(new TouchEvent('touchend', { changedTouches: [end], bubbles: true }));
      });
      await expect(page.locator('.lightbox-caption')).toHaveText('Test 2');
    }
    await page.getByRole('button', { name: 'Chiudi fotografia' }).click();
    await expect(page.locator('[data-photo="0"]')).toBeFocused();
  });
}

test('reduced motion, skip link e nessun URL placeholder attivo', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/about');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(await page.locator('.page-enter').evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await expect(page.locator('.project-links a')).toHaveCount(0);
  await expect(page.locator('.about-page')).toContainText('TODO:');
});

test('rotta sconosciuta e navigazione dopo chiusura della gallery', async ({ page }) => {
  await page.goto('/#/constructor');
  await expect(page.locator('h1')).toHaveText('Pagina non trovata.');
  await page.getByRole('link', { name: 'Torna a Links' }).click();
  await expect(page.locator('h1')).toContainText('Andrea');
  await page.locator('nav [data-route="photography"]').click();
  if (await page.locator('[data-photo]').count()) await page.locator('[data-photo]').first().click();
  await page.evaluate(() => { location.hash = '/about'; });
  await expect(page.locator('dialog')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveClass(/lightbox-open/);
  await expect(page.locator('h1')).toBeFocused();
});
