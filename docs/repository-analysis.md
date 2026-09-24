# Analisi prima dell'intervento

## Struttura iniziale

- `index.html`: Linktree personale in italiano con ritratto, cinque link social,
  sfondo video, overlay promozionale per “Walking around Prague”, immagine/link
  a nadiadaguanno.com e iframe YouTube.
- `css/reset.css`, `css/style.css`, `css/Moon.svg`: reset, stili scuri e sfondo.
- `js/main.js`: gestione di un menu tramite `data-target`, non usato dall'HTML.
- `js/disapper_banner.js`: chiusura dell'overlay promozionale.
- `img/`: ritratto, icone, loghi, screenshot, una fotografia della luna in PNG
  da circa 28 MB e un video MP4 da circa 21 MB.
- `VERSION_2/`: bozza “Paradigm Shift” di HTML5 UP con HTML, CSS compilato, Sass,
  jQuery, Responsive Tools e Font Awesome. La maggior parte dei testi e delle
  foto appartiene al template. Crediti e licenza CCA 3.0 inclusi.
- `.gitignore`: lista generica Visual Studio; README di una riga.
- Nessun package manager, bundler, test o workflow GitHub Actions configurato.
- Remote: `AndreaDagg/AndreaDagg.github.io`; branch locale durante l'intervento:
  `v.2`; riferimento remoto al branch predefinito: `master`.

Non è stato possibile dedurre dai soli file la configurazione attiva nelle
Settings di GitHub Pages; va selezionata la sorgente GitHub Actions.

## Contenuti conservati

Nome, ritratto, tutti e cinque gli URL social esatti, titolo e URL del video di
Praga, collegamento e immagine del sito di Nadia. La fotografia originale
`img/DSC_0031_e.png` è stata spostata senza conversione in
`src/assets/photos/01-luna-e-pale-eoliche.png`.

La precedente indicazione di studi in sicurezza software presso UniMol è
segnalata come informazione storica da verificare, non come qualifica attuale.
Non sono state ricavate competenze o esperienze da screenshot e nomi di file.

L'HTML originale è conservato senza modifiche in `docs/archive/links-original.html`;
CSS, JavaScript, altri media e `VERSION_2` rimangono nel repository come archivio.
L'HTML archiviato è una copia del sorgente, non una pagina pubblicata autonoma.

## Scelta architetturale

JavaScript vanilla a moduli, CSS suddiviso per area e Vite per sviluppo/build.
React e jQuery non sono necessari per quattro sezioni e una lightbox.
I moduli attivi risiedono in `src/`; solo gli asset usati vengono pubblicati.

Il video a pieno schermo e l'overlay sono sostituiti da una fotografia e da un
link discreto al video originale: nessun download automatico dell'MP4 né iframe
di terze parti al caricamento. La palette scura, il ritratto, gli accenti social
e la struttura di raccolta link restano riconoscibili.

Routing hash (`#/links`, `#/photography`, `#/about`, `#/music`), base relativa
`./`: la stessa build funziona in root, sotto un repository e su custom domain,
senza fallback server o regole 404. Il browser scarica solo file statici.

Sharp viene usato esclusivamente in Node durante la preparazione degli asset:
scansione ricorsiva, ordinamento naturale, titoli da filename, orientamento
EXIF, copie WebP fino a 3840 px, dimensioni e manifest generati automaticamente.
La gallery masonry CSS mostra le foto integrali; solo la cover decorativa di
Links usa un ritaglio. Le sottocartelle diventano metadati di categoria, senza
introdurre un sistema di filtri prematuro.

Font di sistema: nessun font remoto da scaricare. Lightbox con `dialog` nativo,
focus confinato, ripristino del focus, frecce, Home/End, Escape e swipe.

Riferimenti: [base relativa Vite](https://vite.dev/guide/build#relative-base),
[deploy Vite su Pages](https://vite.dev/guide/static-deploy#github-pages),
[Sharp](https://sharp.pixelplumbing.com/).

## Verifiche eseguite

- Installazione dipendenze completata e lockfile npm generato.
- ESLint e build di produzione completati senza errori.
- 6 test Node superati: scansione, aggiunta/rimozione, orientamento EXIF,
  titoli, nomi speciali, categorie, file corrotti.
- 15 test browser superati in Chrome: quattro sezioni, reload e cronologia,
  root e sottocartella su server statico senza fallback, gallery con 0/1/5/30
  immagini, proporzioni, focus, tastiera, swipe e reduced motion.
- Layout controllati a 320, 390, 768, 1366, 1920 e 2560 px; gallery di 30 foto
  controllata anche a 768 e 1440 px.
- Screenshot desktop delle quattro sezioni e screenshot mobile di Links
  ispezionati visivamente.
- Fotografia originale verificata tramite hash: nessuna modifica ai byte.
- Build iniziale: 12 file, circa 392 KB inclusi tutti i tagli fotografici;
  JavaScript circa 5,9 KiB gzip, CSS circa 4 KiB gzip.

La pubblicazione remota non è stata eseguita: la configurazione GitHub Pages
deve essere abilitata nelle impostazioni del repository e queste modifiche
devono raggiungere il branch predefinito. I controlli locali non verificano
permessi e impostazioni dell'account GitHub.
