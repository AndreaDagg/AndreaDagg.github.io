import { profile, socialLinks } from '../data/portfolioData.js';
import { icon } from '../components/icons.js';
import { assetUrl, escapeHtml as e, safeUrl } from '../utils/html.js';

const tags = values => `<ul class="tags">${values.map(value => `<li>${e(value)}</li>`).join('')}</ul>`;
const externalLink = (url, label) => safeUrl(url) ? `<a class="text-link" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ${icon('arrow')}<span class="sr-only"> (nuova scheda)</span></a>` : '';

const aboutTabs = [
  { key: 'full-stack', label: 'Software Developer' },
  { key: 'photo-video', label: 'Photo & Video' },
  { key: 'music', label: 'Music' },
];

function renderDeveloperPanel() {
  return `
    <div class="about-profile-panel">
      <p class="about-bio-lead">Sviluppo applicazioni web complete, dal backend alle interfacce frontend, lavorando su architetture, API, database e integrazioni. Mi interessa costruire soluzioni solide, chiare e facilmente manutenibili.</p>
      <div class="about-metrics">
        <article class="about-metric"><p class="eyebrow muted">Stack</p><h3>JavaScript · TypeScript · Node.js · SQL</h3></article>
        <article class="about-metric"><p class="eyebrow muted">Focus</p><h3>Frontend, backend e automazioni</h3></article>
        <article class="about-metric"><p class="eyebrow muted">Approccio</p><h3>Progetti chiari, scalabili e facili da mantenere</h3></article>
      </div>
      <div class="about-split">
        <article class="about-card"><p class="eyebrow muted">Tecnologie</p>${tags(profile.skills)}</article>
        <article class="about-card"><p class="eyebrow muted">Software Developer</p>${profile.experience.map(item => `<div class="about-entry"><p class="eyebrow muted">${e(item.period)}</p><h3>${e(item.role)}</h3><p class="entry-organization">${e(item.company)}</p><p>${e(item.description)}</p></div>`).join('')}</article>
      </div>
      <article class="about-card">
        <p class="eyebrow muted">Progetti</p>
        <div class="project-grid">${profile.projects.map((project, index) => `<article class="project-card"><span class="eyebrow muted">${String(index + 1).padStart(2, '0')}</span><h3>${e(project.name)}</h3><p>${e(project.description)}</p>${tags(project.technologies)}<div class="project-links">${externalLink(project.github, 'GitHub')}${externalLink(project.demo, 'Demo')}</div></article>`).join('')}</div>
      </article>
      <article class="about-card"><p class="eyebrow muted">Formazione</p>${profile.education.map(item => `<div class="about-entry"><p class="eyebrow muted">${e(item.period)}</p><h3>${e(item.title)}</h3><p class="entry-organization">${e(item.institution)}</p><p>${e(item.description)}</p></div>`).join('')}</article>
    </div>
  `;
}

function renderPhotoPanel() {
  return `
    <div class="about-profile-panel">
      <p class="about-bio-lead">Fotografia e video sono il mio modo di raccontare luoghi, persone e momenti attraverso le immagini. Mi occupo di scatto, ripresa ed editing, cercando uno stile visivo personale e curato.</p>
      <div class="about-metrics">
        <article class="about-metric"><p class="eyebrow muted">Occhio</p><h3>Luoghi, persone, atmosfere</h3></article>
        <article class="about-metric"><p class="eyebrow muted">Linguaggio</p><h3>Fotografia e video narrativi</h3></article>
        <article class="about-metric"><p class="eyebrow muted">Focus</p><h3>Scatti autentici, senza forzature</h3></article>
      </div>
      <div class="about-split">
        <article class="about-card"><p class="eyebrow muted">Approccio</p><p>Mi piace raccontare ciò che vive tra il concreto e l’immaginario: un dettaglio, un gesto, una luce, un paesaggio in movimento.</p></article>
        <article class="about-card"><p class="eyebrow muted">Racconto visivo</p><p>Faccio foto e video che cercano ritmo, essenzialità e una sensazione immediata, senza perdere il punto di vista personale.</p></article>
      </div>
      <article class="about-card"><p class="eyebrow muted">Dove mi piace lavorare</p><p>Strade, città, paesaggi, interni, rituali quotidiani e momenti dal vivo. La mia camera va dove la storia si fa visibile.</p></article>
    </div>
  `;
}

function renderMusicPanel() {
  return `
    <div class="about-profile-panel">
      <p class="about-bio-lead">La musica è uno spazio di espressione e sperimentazione. Suono la chitarra, studio nuove tecniche e porto avanti progetti personali tra cover, registrazioni e contenuti musicali.</p>
      <div class="about-metrics">
        <article class="about-metric"><p class="eyebrow muted">Tono</p><h3>Intimo, riflessivo e ritmato</h3></article>
        <article class="about-metric"><p class="eyebrow muted">Interesse</p><h3>Ascolto, produzione e ricerca sonora</h3></article>
        <article class="about-metric"><p class="eyebrow muted">Passione</p><h3>Creare emozioni con suoni semplici</h3></article>
      </div>
      <div class="about-split">
        <article class="about-card"><p class="eyebrow muted">Come la vivo</p><p>La musica è per me un modo di osservare il mondo: ascoltare i dettagli, i silenzi, i passaggi di intensità.</p></article>
        <article class="about-card"><p class="eyebrow muted">Come la costruisco</p><p>Trovo interessanti le vibrazioni sottili, le trame minimaliste, i ritmi che lasciano spazio all’immaginazione.</p></article>
      </div>
      <article class="about-card"><p class="eyebrow muted">Il punto</p><p>Quando le cose si fanno sonore, diventano più concrete: mi aiuta a capire il tempo, il movimento e la memoria.</p></article>
    </div>
  `;
}

function renderAboutTabContent(key) {
  switch (key) {
    case 'photo-video':
      return renderPhotoPanel();
    case 'music':
      return renderMusicPanel();
    case 'full-stack':
    default:
      return renderDeveloperPanel();
  }
}

export function renderAbout() {
  return `<div class="about-page page-enter">
    <header class="about-heading"><div><p class="eyebrow accent">03 / About</p><h1 id="page-title" tabindex="-1">Dietro<br><em>le quinte.</em></h1><p class="about-name">${e(profile.name)}</p><p class="about-intro">${e(profile.intro)}</p></div><figure class="about-portrait"><img src="${assetUrl('generated/media/portrait.webp')}" width="640" height="640" alt="${e(profile.name)}"/><figcaption class="eyebrow">Qualcosa di me</figcaption></figure></header>
    <section class="about-selector" aria-label="Selezione del tema da approfondire">
      <p class="eyebrow accent">Interessi</p>
      <h2>Quale di queste cose vuoi approfondire?</h2>
      <div class="about-tabs" role="tablist" aria-label="Interessi principali">
        ${aboutTabs.map((tab, index) => `<button type="button" class="about-tab ${index === 0 ? 'is-active' : ''}" data-about-tab="${tab.key}" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}" aria-controls="about-panel">${tab.label}</button>`).join('')}
      </div>
    </section>
    <div id="about-panel" class="about-panel" data-about-panel>${renderAboutTabContent('full-stack')}</div>
    <section class="resume-section"><h2><span class="eyebrow muted">01</span>Parliamone.</h2><div class="resume-content"><p>${e(profile.contactText)}</p><div class="contact-links">${profile.email ? externalLink(`mailto:${profile.email}`, profile.email) : '<p class="muted">TODO: inserire indirizzo email</p>'}${socialLinks.filter(link => ['github', 'linkedin'].includes(link.icon)).map(link => externalLink(link.url, link.name)).join('')}</div></div></section>
  </div>`;
}

export function mountAbout(container) {
  const tabs = container.querySelectorAll('[data-about-tab]');
  const panel = container.querySelector('[data-about-panel]');
  if (!tabs.length || !panel) return () => {};

  const onClick = event => {
    const button = event.currentTarget;
    const key = button.dataset.aboutTab;
    const nextContent = renderAboutTabContent(key);

    tabs.forEach(tab => {
      const active = tab === button;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    panel.innerHTML = nextContent;
  };

  tabs.forEach(tab => tab.addEventListener('click', onClick));
  return () => tabs.forEach(tab => tab.removeEventListener('click', onClick));
}
