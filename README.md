# Simulatore Internet e Sicurezza

Applicazione locale in `React + Vite + TypeScript + Tailwind CSS` per esercitarsi all'esame scritto di Internet e Sicurezza con simulazioni, allenamento per argomento, ripasso intelligente ed esiti dettagliati.

## Requisiti

- `Node.js` installato
- `npm`

## Installazione

```bash
npm install
```

Se PowerShell blocca `npm`, usa:

```bash
npm.cmd install
```

## Avvio in locale

```bash
npm run dev
```

Se PowerShell blocca `npm`, usa:

```bash
npm.cmd run dev
```

Link locale predefinito:

```text
http://localhost:5173
```

## Build e preview

Build di produzione:

```bash
npm run build
```

Preview della build:

```bash
npm run preview
```

## Controlli progetto

Validazione banca domande:

```bash
npm run validate:questions
```

Lint:

```bash
npm run lint
```

## Sito online

L'applicazione è pubblicata su GitHub Pages ed è utilizzabile da qualsiasi browser, su PC, tablet e smartphone:

```text
https://vincenzo106.github.io/Internet_sicurezza/
```

Non serve installare nulla: basta aprire il link. Su smartphone puoi aggiungerla alla schermata Home dal menu del browser per averla come un'app.

### Come si aggiorna il sito

Il deployment è automatico. Ogni push sul branch `main` fa partire il workflow [.github/workflows/deploy.yml](./.github/workflows/deploy.yml), che valida le domande, esegue lint e build e ripubblica il sito:

```bash
git add .
git commit -m "Aggiorna domande"
git push
```

Dopo un paio di minuti il sito online è aggiornato. Lo stato del deploy si vede nella tab `Actions` del repository. È anche possibile lanciare il deploy manualmente da `Actions` con il pulsante `Run workflow`.

### Nota sul percorso base

Su GitHub Pages il sito è servito da una sottocartella (`/Internet_sicurezza/`), non dalla radice del dominio. Per questo [vite.config.ts](./vite.config.ts) legge la variabile d'ambiente `VITE_BASE_PATH`, che il workflow imposta automaticamente. In locale la variabile non è impostata e il percorso base resta `/`, quindi `npm run dev` funziona come sempre.

Se rinomini il repository o lo forki, non devi cambiare nulla: il percorso viene ricavato in automatico dal nome del repository.

## Dati salvati nel browser

Storico, errori e statistiche vivono nel `localStorage` del browser che stai usando. Questo significa che i progressi fatti sul telefono non compaiono sul PC e viceversa: ogni dispositivo ha il proprio archivio.

## Dove modificare le domande

- [src/data/questions.ts](./src/data/questions.ts) — banca dati base
- [src/data/advancedQuestions.ts](./src/data/advancedQuestions.ts) — set "Domande cattive"
- [src/data/securityExtraQuestions.ts](./src/data/securityExtraQuestions.ts) — domande extra di Sicurezza

## Dati locali e progressi

Storico quiz, errori, domande saltate e ripasso intelligente vengono salvati nel browser tramite `localStorage`.

Questo significa che:

- ogni utente ha i propri dati locali separati;
- i progressi non vengono inviati online;
- se cambi browser o cancelli i dati locali, perdi lo storico salvato su quel browser.

## Materiali didattici

La cartella `materials/` contiene PDF e appunti usati come riferimento per la banca dati domande e per l'impostazione teorica del simulatore.

Nota importante:

> Se si pubblica il repository come pubblico, verificare di avere il diritto di condividere questi materiali. In caso di dubbio, usare un repository privato o rimuovere la cartella `materials/`.

## Come scaricarlo da GitHub

### Metodo ZIP

1. Apri il repository su GitHub.
2. Premi `Code`.
3. Premi `Download ZIP`.
4. Estrai la cartella.
5. Apri il terminale dentro la cartella.
6. Esegui `npm install`.
7. Esegui `npm run dev`.

### Metodo Git

1. Installa Git.
2. Esegui `git clone URL_DEL_REPOSITORY`.
3. Entra nella cartella del progetto.
4. Esegui `npm install`.
5. Esegui `npm run dev`.

## Script disponibili

In [package.json](./package.json) trovi questi script principali:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run validate:questions`

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS

Nessun backend, nessun deploy online obbligatorio, nessuna API esterna.
