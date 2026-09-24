import { profile, socialLinks } from '../data/portfolioData';
import { icon } from '../components/icons';
import { assetUrl, escapeHtml as e, safeUrl } from '../utils/html';

const tags = values => `<ul class="tags">${values.map(value => `<li>${e(value)}</li>`).join('')}</ul>`;
const externalLink = (url, label) => safeUrl(url) ? `<a class="text-link" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${e(label)} ${icon('arrow')}<span class="sr-only"> (nuova scheda)</span></a>` : '';

function section(number, title, content) {
  return `<section class="resume-section"><h2><span class="eyebrow muted">${number}</span>${title}</h2><div class="resume-content">${content}</div></section>`;
}

export function renderAbout() {
  return `<div class="about-page page-enter">
    <header class="about-heading"><div><p class="eyebrow accent">03 / About & Resume</p><h1 id="page-title" tabindex="-1">Dietro<br><em>le quinte.</em></h1><p class="about-name">${e(profile.name)}</p><p class="about-intro">${e(profile.intro)}</p></div><figure class="about-portrait"><img src="${assetUrl('generated/media/portrait.webp')}" width="640" height="640" alt="${e(profile.name)}"/><figcaption class="eyebrow">Qualcosa di me</figcaption></figure></header>
    ${section('01', 'About me', `<p class="resume-lead">${e(profile.about)}</p>`)}
    ${section('02', 'Cosa faccio', profile.activities.map(item => `<article class="resume-entry"><h3>${e(item.title)}</h3><p>${e(item.description)}</p></article>`).join(''))}
    ${section('03', 'Esperienza', profile.experience.map(item => `<article class="resume-entry"><p class="eyebrow muted">${e(item.period)}</p><h3>${e(item.role)}</h3><p class="entry-organization">${e(item.company)}</p><p>${e(item.description)}</p></article>`).join(''))}
    ${section('04', 'Progetti', `<div class="project-grid">${profile.projects.map((project, index) => `<article class="project-card"><span class="eyebrow muted">${String(index + 1).padStart(2, '0')}</span><h3>${e(project.name)}</h3><p>${e(project.description)}</p>${tags(project.technologies)}<div class="project-links">${externalLink(project.github, 'GitHub')}${externalLink(project.demo, 'Demo')}</div></article>`).join('')}</div>`)}
    ${section('05', 'Tecnologie & skills', tags(profile.skills))}
    ${section('06', 'Formazione', profile.education.map(item => `<article class="resume-entry"><p class="eyebrow muted">${e(item.period)}</p><h3>${e(item.title)}</h3><p class="entry-organization">${e(item.institution)}</p><p>${e(item.description)}</p></article>`).join(''))}
    ${section('07', 'Parliamone.', `<p>${e(profile.contactText)}</p><div class="contact-links">${profile.email ? externalLink(`mailto:${profile.email}`, profile.email) : '<p class="muted">TODO: inserire indirizzo email</p>'}${socialLinks.filter(link => ['github', 'linkedin'].includes(link.icon)).map(link => externalLink(link.url, link.name)).join('')}</div>`)}
  </div>`;
}
