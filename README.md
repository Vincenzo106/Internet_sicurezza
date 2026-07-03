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

## Dove modificare le domande

- [src/data/questions.ts](./src/data/questions.ts)
- [src/data/advancedQuestions.ts](./src/data/advancedQuestions.ts)

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
