import { socialLinks, featuredLinks } from '../data/portfolioData';
import { icon } from '../components/icons';
import { assetUrl, escapeHtml, safeUrl, srcset } from '../utils/html';
import photos from '../generated/photos.json';

export function renderLinks() {
  const cover = photos[0];
  return `
    <div class="links-layout page-enter">
      <section class="links-intro" aria-labelledby="page-title">
        <div class="intro-kicker"><img class="avatar" src="${assetUrl('generated/media/portrait.webp')}" width="48" height="48" alt="Ritratto di Andrea"/><p class="eyebrow">Ciao, sono Andrea <span aria-hidden="true">↗</span></p></div>
        <h1 id="page-title" tabindex="-1">Andrea<br><em>D'Aguanno.</em></h1>
        <p class="intro-description">Fotografie, percorsi e cose da condividere.<br>Il mio piccolo spazio, sul web.</p>
        <div class="social-heading"><h2 class="eyebrow">Mi trovi qui</h2><span class="eyebrow muted">01 — 05</span></div>
        <ul class="social-links">${socialLinks.map(link => `
          <li><a href="${safeUrl(link.url)}" target="_blank" rel="noopener noreferrer">
            <span class="social-icon social-icon--${link.icon}">${icon(link.icon)}</span>
            <span class="social-name">${escapeHtml(link.name)}</span>
            <span class="social-handle">${escapeHtml(link.handle)}</span>${icon('arrow', 'link-arrow')}
            <span class="sr-only"> (si apre in una nuova scheda)</span>
          </a></li>`).join('')}</ul>
      </section>
      <section class="focus-grid" aria-label="Aree principali del portfolio">
        <article class="focus-card">
          <p class="eyebrow muted">01</p>
          <h2>Software Developer</h2>
          <p>Sviluppo applicazioni web complete, dal backend alle interfacce frontend, lavorando su architetture, API, database e integrazioni. Mi interessa costruire soluzioni solide, chiare e facilmente manutenibili.</p>
        </article>
        <article class="focus-card">
          <p class="eyebrow muted">02</p>
          <h2>Music</h2>
          <p>La musica è uno spazio di espressione e sperimentazione. Suono la chitarra, studio nuove tecniche e porto avanti progetti personali tra cover, registrazioni e contenuti musicali.</p>
        </article>
        <article class="focus-card">
          <p class="eyebrow muted">03</p>
          <h2>Photo &amp; Video</h2>
          <p>Fotografia e video sono il mio modo di raccontare luoghi, persone e momenti attraverso le immagini. Mi occupo di scatto, ripresa ed editing, cercando uno stile visivo personale e curato.</p>
        </article>
      </section>
      <a class="photo-feature" href="#/photography" aria-label="Esplora il portfolio Photography">
        <img src="${assetUrl(cover?.src ?? 'generated/media/portrait.webp')}"
          ${cover ? `srcset="${srcset(cover, 2560)}" sizes="(max-width: 700px) 92vw, (max-width: 1200px) 46vw, 660px"` : ''}
          width="${cover?.width ?? 640}" height="${cover?.height ?? 640}" alt="${escapeHtml(cover?.alt ?? 'Ritratto di Andrea')}" fetchpriority="high" />
        <div class="photo-feature-top"><span class="eyebrow">Attraverso l'obiettivo</span><span class="feature-dot" aria-hidden="true"></span></div>
        <div class="photo-feature-bottom"><p class="feature-title">Un altro<br><em>punto di vista.</em></p><span class="feature-link">Esplora Photography <span class="circle-arrow">${icon('arrow')}</span></span></div>
      </a>
    </div>
    <section class="elsewhere-section" aria-labelledby="elsewhere-title">
      <div class="section-heading"><h2 id="elsewhere-title">Da queste parti.</h2><span class="eyebrow muted">Altri link, altre storie</span></div>
      <div class="featured-links">
        <a class="feature-card video-card" href="${safeUrl(featuredLinks.video.url)}" target="_blank" rel="noopener noreferrer">
          <span class="video-symbol" aria-hidden="true">${icon('play')}</span>
          <span class="feature-card-copy"><span class="eyebrow muted">Un video su YouTube</span><span class="feature-card-title">${escapeHtml(featuredLinks.video.title)}</span><span class="feature-card-description">Guarda il video</span></span>${icon('arrow')}
          <span class="sr-only"> (si apre in una nuova scheda)</span>
        </a>
        <a class="feature-card nadia-card" href="${safeUrl(featuredLinks.nadia.url)}" target="_blank" rel="noopener noreferrer">
          <img src="${assetUrl('generated/media/nadia.webp')}" width="1901" height="1052" alt="" loading="lazy" decoding="async" />
          <span class="feature-card-copy"><span class="eyebrow muted">Un sito da visitare</span><span class="feature-card-title">${escapeHtml(featuredLinks.nadia.title)}</span><span class="feature-card-description">nadiadaguanno.com</span></span>${icon('arrow')}
          <span class="sr-only"> (si apre in una nuova scheda)</span>
        </a>
      </div>
    </section>`;
}
