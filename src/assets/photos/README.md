# Fotografie

Aggiungi qui JPG, JPEG, PNG, WebP, AVIF, TIFF o GIF, anche in sottocartelle.
Le GIF vengono mostrate come immagini statiche (primo fotogramma).
Con `npm run dev` già avviato, le modifiche vengono rilevate automaticamente.
Per pubblicarle esegui `npm run build`, oppure fai commit e push.
Non serve modificare alcun manifest: viene rigenerato automaticamente.

I file sono ordinati per percorso, con ordinamento numerico naturale.
Esempio: `01-luce-del-mattino.jpg`, `02-ritratto.jpg`.
Il nome senza prefisso numerico diventa titolo e testo alternativo.
Le sottocartelle sono già registrate come categoria, senza filtri nell'interfaccia.

Gli originali non vengono modificati né pubblicati: la build produce copie WebP
responsive e una versione grande, senza ritagli. Per rimuovere una foto elimina
il file e ricrea la build. Le immagini generate precedenti vengono ripulite.
