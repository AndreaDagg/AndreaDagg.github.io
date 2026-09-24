import { icon } from './icons';
import { assetUrl } from '../utils/html';

export function createLightbox(photos) {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Visualizzazione fotografia');
  dialog.innerHTML = `
    <div class="lightbox-toolbar"><p class="lightbox-counter" aria-live="polite"></p><button class="icon-button lightbox-close" aria-label="Chiudi fotografia">${icon('close')}</button></div>
    <div class="lightbox-stage"><p class="lightbox-status" role="status"></p><img class="lightbox-image" alt="" draggable="false" /></div>
    <div class="lightbox-bottom"><p class="lightbox-caption"></p><div class="lightbox-controls"><button class="icon-button lightbox-prev" aria-label="Fotografia precedente">${icon('left')}</button><button class="icon-button lightbox-next" aria-label="Fotografia successiva">${icon('right')}</button></div></div>`;
  document.body.append(dialog);
  const stage = dialog.querySelector('.lightbox-stage');
  const image = dialog.querySelector('.lightbox-image');
  const status = dialog.querySelector('.lightbox-status');
  let index = 0;
  let opener;
  let touch;

  function show(nextIndex) {
    index = (nextIndex + photos.length) % photos.length;
    const photo = photos[index];
    image.classList.remove('is-loaded');
    status.textContent = 'Caricamento…';
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    image.src = assetUrl(photo.full);
    dialog.querySelector('.lightbox-counter').textContent = `${String(index + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
    dialog.querySelector('.lightbox-caption').textContent = photo.title;
    dialog.querySelector('.lightbox-controls').hidden = photos.length < 2;
  }

  image.addEventListener('load', () => { image.classList.add('is-loaded'); status.textContent = ''; });
  image.addEventListener('error', () => { status.textContent = 'Impossibile caricare questa fotografia. Riprova tra poco.'; });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', event => { if (event.target === stage || event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const buttons = [...dialog.querySelectorAll('button')].filter(button => button.getClientRects().length);
      const first = buttons[0];
      const last = buttons.at(-1);
      if ((!event.shiftKey && document.activeElement === last) || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    }
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: photos.length - 1 };
      show(next[event.key]);
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('lightbox-open');
    opener?.focus({ preventScroll: true });
  });
  stage.addEventListener('touchstart', event => {
    touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touch) return;
    const dx = event.changedTouches[0].clientX - touch.x;
    const dy = event.changedTouches[0].clientY - touch.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
    touch = null;
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { touch = null; }, { passive: true });

  return {
    open(nextIndex, trigger) {
      if (!photos.length) return;
      opener = trigger;
      show(nextIndex);
      document.body.classList.add('lightbox-open');
      dialog.showModal();
    },
    destroy() {
      if (dialog.open) dialog.close();
      document.body.classList.remove('lightbox-open');
      dialog.remove();
    },
  };
}
