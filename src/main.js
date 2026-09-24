import './styles/base.css';
import './styles/links.css';
import './styles/photography.css';
import './styles/about.css';
import { renderLinks } from './pages/links';
import { renderPhotography, mountPhotography } from './pages/photography';
import { renderAbout } from './pages/about';
import { renderMusic } from './pages/music';

const routes = {
  links: { title: 'Links', render: renderLinks },
  photography: { title: 'Photography', render: renderPhotography, mount: mountPhotography },
  about: { title: 'About', render: renderAbout },
  music: { title: 'Music', render: renderMusic },
};
const main = document.querySelector('main');
let cleanup;

function navigate(initial = false) {
  cleanup?.();
  const key = location.hash.replace(/^#\/?/, '').replace(/\/$/, '') || 'links';
  const route = Object.hasOwn(routes, key) ? routes[key] : undefined;
  document.querySelectorAll('[data-route]').forEach(link => {
    if (link.dataset.route === key) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  main.innerHTML = route ? route.render() : `<section class="music-page"><p class="eyebrow">404</p><h1 id="page-title" tabindex="-1">Pagina non trovata.</h1><a class="text-link" href="#/links">Torna a Links ↗</a></section>`;
  cleanup = route?.mount?.(main);
  document.title = `${route?.title ?? 'Pagina non trovata'} — Andrea D'Aguanno`;
  if (!initial) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.querySelector('h1').focus({ preventScroll: true });
    document.querySelector('#route-status').textContent = `Sezione ${route?.title ?? 'non trovata'}`;
  }
}

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  main.focus();
});
window.addEventListener('hashchange', () => navigate());
navigate(true);
