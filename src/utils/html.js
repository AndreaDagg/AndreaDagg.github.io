export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);

export function safeUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value, document.baseURI);
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? escapeHtml(url.href) : '';
  } catch { return ''; }
}

export function assetUrl(path) {
  const base = new URL(import.meta.env.BASE_URL, document.baseURI);
  return new URL(String(path).replace(/^\/+/, ''), base).href;
}

export function srcset(photo, maxWidth = Infinity) {
  const variants = photo.variants.filter(item => item.width <= maxWidth);
  return (variants.length ? variants : [photo.variants[0]])
    .map(item => `${escapeHtml(assetUrl(item.src))} ${item.width}w`).join(', ');
}
