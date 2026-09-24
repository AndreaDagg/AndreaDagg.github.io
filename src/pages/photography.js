import photos from '../generated/photos.json';
import { icon } from '../components/icons';
import { createLightbox } from '../components/lightbox';
import { assetUrl, escapeHtml, srcset } from '../utils/html';

export function renderPhotography(items = photos) {
  return `<section class="photography-page page-enter" aria-labelledby="page-title">
    <header class="page-heading"><div><p class="eyebrow accent">02 / Photography</p><h1 id="page-title" tabindex="-1">Searching, <em>someting to capture.</em></h1></div><p>Una raccolta di sguardi.<br>Luce, dettagli e ciò che resta.</p></header>
    <div class="gallery-heading"><span class="eyebrow">Archivio fotografico</span><span class="eyebrow muted">${String(items.length).padStart(2, '0')} ${items.length === 1 ? 'fotografia' : 'fotografie'}</span></div>
    ${items.length ? `<div class="photo-gallery ${items.length === 1 ? 'photo-gallery--single' : ''}">${items.map((photo, index) => `
      <figure class="photo-item"><button class="photo-button" data-photo="${index}" aria-label="Apri fotografia: ${escapeHtml(photo.title)}" aria-haspopup="dialog">
        <img src="${assetUrl(photo.src)}" srcset="${srcset(photo, 1600)}" sizes="${items.length === 1 ? '(max-width: 700px) 92vw, 900px' : '(max-width: 600px) 92vw, (max-width: 1000px) 45vw, (max-width: 1600px) 30vw, 460px'}" width="${photo.width}" height="${photo.height}" alt="${escapeHtml(photo.alt)}" loading="${index < 2 ? 'eager' : 'lazy'}" decoding="async" />
        <span class="photo-open" aria-hidden="true">${icon('plus')}</span>
      </button><figcaption><span>${escapeHtml(photo.title)}</span><span class="photo-number">${String(index + 1).padStart(2, '0')}</span></figcaption></figure>`).join('')}</div>` : `
      <div class="gallery-empty">${icon('camera')}<h2>Il prossimo scatto è in arrivo.</h2><p>Le fotografie troveranno presto spazio qui.</p></div>`}
    <p class="gallery-footnote">Un altro punto di vista. <span aria-hidden="true">↗</span></p>
  </section>`;
}

export function mountPhotography(container, items = photos) {
  if (!items.length) return () => {};
  const lightbox = createLightbox(items);
  const onClick = event => {
    const button = event.target.closest('[data-photo]');
    if (button) lightbox.open(Number(button.dataset.photo), button);
  };
  container.addEventListener('click', onClick);
  return () => { container.removeEventListener('click', onClick); lightbox.destroy(); };
}
