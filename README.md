# Andrea D'Aguanno — Portfolio

Portfolio statico con quattro sezioni: **Links**, **Photography**, **About / Resume**
e **Music**. JavaScript vanilla, CSS e Vite; nessun backend e nessun server Node
in produzione. La build è pronta per GitHub Pages.

La pagina Links conserva i cinque social originali, il ritratto, il video
“Walking around Prague” e il collegamento al sito di Nadia. La fotografia della
luna già presente nel repository inaugura la gallery. About contiene dati reali
già disponibili e placeholder `TODO:` per ciò che manca. Music è “Coming soon.”.

## Avvio locale

Installa **Node.js 22.12 o superiore** (consigliato Node 22 LTS, indicato anche in
`.nvmrc`). Dalla cartella del progetto:

```sh
npm ci
npm run dev
```

Apri l'indirizzo mostrato da Vite, normalmente `http://127.0.0.1:5173`.
Il comando prepara prima le immagini. Le modifiche al codice e alle fotografie
si aggiornano automaticamente: aggiungi, rimuovi o sostituisci i file e attendi
la preparazione delle copie responsive. Non occorre riavviare il server.
Non aprire `index.html` tramite `file://`.

In questo ambiente è stata scaricata anche una copia portatile di Node nella
cartella locale `.tools/`, ignorata da Git. Per usarla in PowerShell senza
installazioni di sistema:

```powershell
$portfolioNode = Get-ChildItem .tools -Directory -Filter 'node-*-win-x64' | Select-Object -First 1
$env:PATH = "$($portfolioNode.FullName);$env:PATH"
npm.cmd run dev
```

## Build e anteprima

```sh
npm run build
npm run preview
```

`npm run build` scansiona le fotografie, prepara copie responsive e manifest,
compila il sito in `dist/` e controlla gli asset. Pubblica **solo `dist/`**.
`npm run preview` serve quella build, normalmente su `http://127.0.0.1:4173`.
Non occorre caricare `node_modules`, sorgenti, archivi o originali fotografici.

## Aggiungere fotografie

1. Copia i file in **`src/assets/photos/`**.
2. Esegui `npm run build`, oppure fai commit e push sul branch di pubblicazione.
3. Le fotografie appaiono automaticamente, senza modificare HTML, JavaScript o JSON.

Formati supportati: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.tif`, `.tiff`, `.gif`
(anche con estensione maiuscola). Le GIF sono mostrate come immagini statiche
usando il primo fotogramma. Converti prima i file RAW/HEIC in un formato
supportato. Il README e i file non immagine vengono ignorati. Un'immagine corrotta
interrompe la build con il nome del file, invece di sparire silenziosamente.

I file sono ordinati per percorso con ordinamento numerico naturale. Un nome come
`01-luna-e-pale-eoliche.jpg` produce il titolo e il testo alternativo
“Luna e pale eoliche”. Usa nomi descrittivi: migliorano anche l'accessibilità.
Puoi aggiungere sottocartelle come `viaggi/`: vengono lette automaticamente e
registrate come metadato `category`, già disponibile per futuri filtri.

Gli originali restano intatti. La build corregge l'orientamento EXIF e genera
copie WebP a 480, 960, 1600, 2560 e 3840 px, senza ingrandire immagini piccole
né ritagliarle. I metadati EXIF non vengono pubblicati. Il browser sceglie una
copia adatta allo schermo con `srcset`; la lightbox usa la versione grande con
qualità 94. Risoluzioni e qualità si modificano in `scripts/photos.mjs`.

La gallery utilizza colonne masonry, con ordine dall'alto verso il basso in
ciascuna colonna. Mantiene il rapporto originale, riserva lo spazio prima del
caricamento e usa lazy loading. Gestisce 0, 1 o molte fotografie. La copertina
decorativa di Links usa la prima foto e può ritagliarla; se la cartella è vuota,
usa il ritratto. La gallery e la lightbox mostrano sempre le foto complete.

Lightbox: click/tap per aprire, pulsanti precedente/successiva, frecce della
tastiera, Home/End, Escape, chiusura sullo sfondo e swipe orizzontale. Con una sola
foto i controlli precedente/successiva sono nascosti. Il focus resta nel dialogo
e torna alla foto quando lo chiudi.

## Rimuovere fotografie

Elimina i file da `src/assets/photos/` e ricrea la build oppure fai commit e push.
Il manifest viene ricreato e le vecchie copie generate vengono rimosse.
Non modificare manualmente `src/generated/` o `public/generated/`: sono output
automatici, ignorati da Git. Per prepararli senza compilare: `npm run photos`.

## Modificare il profilo e i link

Apri **`src/data/portfolioData.js`**:

- `profile.intro`, `about`, `activities`: presentazione, biografia e attività.
- `experience`: array di ruoli con `role`, `company`, `period`, `description`.
- `projects`: progetti, descritti sotto.
- `skills`: array di competenze; `education`: formazione.
- `contactText`, `email`: contatti. Un'email vuota mostra un TODO.
- `socialLinks`: nomi, handle, icone e URL dei social.
- `featuredLinks`: video di Praga e sito di Nadia.

Cerca **`TODO:`** e sostituisci i placeholder con informazioni reali. Il riferimento
a UniMol proviene dalla vecchia bozza: periodo, percorso e stato vanno aggiornati.
Non sono state inventate esperienze, aziende, qualifiche o tecnologie.

## Aggiungere un progetto

Aggiungi un oggetto all'array `profile.projects` in `src/data/portfolioData.js`:

```js
{
  name: 'Nome del progetto',
  description: 'Descrizione del progetto e del tuo contributo.',
  technologies: ['Tecnologia utilizzata'],
  github: 'https://github.com/utente/repository',
  demo: '',
},
```

I valori sono un esempio da sostituire, non contenuti già attribuiti al profilo.
Le card si adattano al numero di progetti. Lascia `github` o `demo` vuoti quando
non esiste un URL: non vengono prodotti pulsanti finti. Per rimuovere una voce,
elimina l'oggetto corrispondente dall'array.

## Deploy GitHub Pages

Una tantum, su GitHub apri **Settings → Pages → Build and deployment → Source**
e seleziona **GitHub Actions**. Se l'ambiente `github-pages` ha restrizioni sui
branch, consenti il branch predefinito.

Il workflow `.github/workflows/deploy.yml`:

1. Esegue `npm ci`, lint e test del generatore fotografico.
2. Esegue la build, inclusa generazione manifest e immagini.
3. Esegue test browser su routing, proporzioni, lightbox e layout responsive.
4. Carica `dist/` e pubblica su Pages per i push al **branch predefinito**.

Le pull request e gli altri branch eseguono le verifiche senza pubblicare.
Il workflow può essere avviato anche da **Actions → Build and deploy portfolio →
Run workflow**, selezionando il branch predefinito.

Durante l'intervento il checkout locale era sul branch **`v.2`** e il riferimento
remoto al branch predefinito era **`master`**. Per pubblicare queste modifiche,
integrale nel branch predefinito e fai push, oppure imposta deliberatamente `v.2`
come branch predefinito nelle impostazioni GitHub. Un push solo a un branch di
lavoro esegue i controlli ma non cambia il sito pubblico.

```text
git push sul branch predefinito
  → installazione, lint e test
  → generazione automatica delle foto e build
  → verifiche browser
  → GitHub Pages aggiornato
```

Non devi creare un branch `gh-pages` né committare `dist/`.

### Root, sottocartelle e custom domain

Vite usa **`base: './'`** e i link interni usano hash:
`#/links`, `#/photography`, `#/about`, `#/music`.
La stessa build funziona su:

- `https://username.github.io/`
- `https://username.github.io/nome-repository/`
- `https://dominio-personale.it/`

Ricaricare una sezione richiede sempre lo stesso `index.html`: nessun 404 sulle
rotte interne, nessun backend e nessuna pagina 404 di reindirizzamento.
Per un dominio personalizzato configura dominio e DNS nelle Settings di Pages;
non è necessario cambiare `base`. Puoi conservare il dominio anche in
`public/CNAME`, che verrà copiato nella build.

Riferimenti ufficiali: [base relativa di Vite](https://vite.dev/guide/build#relative-base)
e [GitHub Pages con Vite](https://vite.dev/guide/static-deploy#github-pages).

## Verifiche

```sh
npm run lint
npm test
npm run build
npm run test:browser
```

I test browser richiedono Chrome su Windows nel percorso standard oppure
Chromium di Playwright, installabile con `npx playwright install chromium`.
Su Linux/CI usa `npx playwright install --with-deps chromium`.

I test coprono cartelle vuote, una e molte immagini, aggiunta/rimozione,
orientamento, sottocartelle, nomi speciali, build servita in root e sotto
`/portfolio-test/`, reload delle quattro sezioni, focus, tastiera, swipe e
larghezze da 320 a 2560 px. Le immagini sintetiche dei test non vengono pubblicate.

## Struttura

```text
src/
  assets/photos/           Originali: aggiungi o rimuovi foto qui
  components/             Icone SVG e lightbox
  data/portfolioData.js    Profilo, progetti e link
  generated/              Manifest automatico, ignorato da Git
  pages/                  Links, Photography, About, Music
  styles/                 Stili comuni e delle singole sezioni
  utils/                  Escape HTML e risoluzione degli asset
  main.js                 Navigazione hash
public/
  generated/              Copie ottimizzate, ignorate da Git
  .nojekyll
scripts/                  Preparazione foto e controllo build
tests/                    Test Node e browser
.github/workflows/        Verifica e deploy automatici
docs/                     Analisi iniziale e copia HTML originale
img/, css/, js/           Asset e sorgenti storici conservati
VERSION_2/                Vecchia bozza HTML5 UP con licenza originale
index.html                Struttura comune del sito
vite.config.js            Build statica e base relativa
```

Nessuna libreria viene caricata da CDN; i font sono di sistema. Le animazioni
rispettano `prefers-reduced-motion`. Gli archivi e i media storici non utilizzati,
incluso il video di sfondo, non vengono copiati in `dist/`.

L'analisi e le decisioni di conservazione sono descritte in
[`docs/repository-analysis.md`](docs/repository-analysis.md).

