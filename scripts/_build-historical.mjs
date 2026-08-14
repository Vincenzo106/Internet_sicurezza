// Costruisce src/data/historicalQuestions.ts a partire dai blocchi JSON estratti dal PDF
// del simulatore storico. Script di supporto una tantum: non fa parte della build.
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const currentFile = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(currentFile), "..");
const chunkDir = process.argv[2];

const INTERNET_TOPICS = new Set([
  "Introduzione a Internet",
  "ISP, router, switch, modem, access point",
  "Client-server e P2P",
  "HTTP/HTTPS",
  "DNS",
  "SMTP, POP3, IMAP",
  "TCP e UDP",
  "porte e socket",
  "affidabilità TCP",
  "sliding window",
  "congestion control",
  "IP, indirizzamento, subnet, CIDR",
  "forwarding e routing",
  "NAT",
  "DHCP",
  "livello collegamento",
  "Ethernet",
  "MAC address",
  "ARP",
  "switch",
  "Wi-Fi e reti mobili",
]);

const SECURITY_TOPICS = new Set([
  "concetti base CIA: confidenzialità, integrità, disponibilità",
  "crittografia simmetrica",
  "crittografia asimmetrica",
  "RSA",
  "Diffie-Hellman",
  "hash",
  "HMAC",
  "firma digitale",
  "certificati e PKI",
  "HTTPS/TLS",
  "autenticazione",
  "Kerberos",
  "VPN",
  "IPsec",
  "attacchi principali",
]);

const DIFFICULTIES = new Set(["facile", "media", "difficile"]);

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trigramSet(value) {
  const normalized = `  ${normalizeText(value)}  `;
  const tokens = new Set();
  for (let index = 0; index < normalized.length - 2; index += 1) {
    tokens.add(normalized.slice(index, index + 3));
  }
  return tokens;
}

function diceSimilarity(left, right) {
  const leftSet = trigramSet(left);
  const rightSet = trigramSet(right);
  if (leftSet.size === 0 || rightSet.size === 0) return 0;
  let overlap = 0;
  for (const token of leftSet) if (rightSet.has(token)) overlap += 1;
  return (2 * overlap) / (leftSet.size + rightSet.size);
}

// ---- carica la banca dati esistente per il confronto duplicati ----
function stripModuleSyntax(source) {
  return source
    .replace(/^import\s+.*?;\s*$/gmu, "")
    .replace(/^export\s+\{\s*hardQuestionIds\s*\};\s*$/gmu, "")
    .replace(/\bexport\s+const\b/g, "const")
    .replace(/\bexport\s+function\b/g, "function")
    .replace(/\bexport\s+type\b/g, "type");
}

async function loadExistingQuestions() {
  const files = [
    "questionAudit.ts",
    "advancedQuestions.ts",
    "securityExtraQuestions.ts",
    "questions.ts",
  ];
  const sources = [];
  for (const file of files) {
    sources.push(
      stripModuleSyntax(
        await readFile(path.join(projectRoot, "src", "data", file), "utf8"),
      ),
    );
  }
  const merged = `${sources.join("\n")}\n(() => questions)();`;
  const transpiled = ts
    .transpileModule(merged, { compilerOptions: { target: ts.ScriptTarget.ES2022 } })
    .outputText.replace(/^export\s*\{\};?\s*$/gmu, "");
  return vm.runInNewContext(transpiled, {});
}

function tsString(value) {
  return JSON.stringify(value);
}

function serializeSeed(seed) {
  const wrongEntries = Object.entries(seed.whyOthersAreWrong)
    .map(([option, reason]) => `      ${tsString(option)}:\n        ${tsString(reason)},`)
    .join("\n");

  return [
    "  {",
    `    id: ${tsString(seed.id)},`,
    `    category: ${tsString(seed.category)},`,
    `    topic: ${tsString(seed.topic)},`,
    `    difficulty: ${tsString(seed.difficulty)},`,
    "    question:",
    `      ${tsString(seed.question)},`,
    "    options: [",
    ...seed.options.map((option) => `      ${tsString(option)},`),
    "    ],",
    "    correctAnswer:",
    `      ${tsString(seed.correctAnswer)},`,
    "    explanation:",
    `      ${tsString(seed.explanation)},`,
    "    whyOthersAreWrong: {",
    wrongEntries,
    "    },",
    `    source: "risposte_simulatore_internet.pdf",`,
    "    studyGuide: guide(",
    `      ${tsString(seed.conceptToReview)},`,
    `      ${tsString(seed.miniSummary)},`,
    `      ${tsString(seed.memoryTrick)},`,
    `      ${tsString(seed.similarExamQuestion)},`,
    "    ),",
    "  },",
  ].join("\n");
}

async function main() {
  if (!chunkDir) throw new Error("Passa la cartella dei chunk come primo argomento");

  const files = (await readdir(chunkDir)).filter((f) => /^chunk-\d+\.json$/.test(f)).sort();
  const seeds = [];
  const errors = [];
  const seenIds = new Map();

  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(await readFile(path.join(chunkDir, file), "utf8"));
    } catch (error) {
      errors.push(`${file}: JSON non valido (${error.message})`);
      continue;
    }
    if (!Array.isArray(parsed)) {
      errors.push(`${file}: non è un array`);
      continue;
    }

    for (const entry of parsed) {
      const id = entry?.id ?? "(senza id)";
      const where = `${file} / ${id}`;

      if (seenIds.has(entry.id)) {
        errors.push(`${where}: id duplicato (già in ${seenIds.get(entry.id)})`);
        continue;
      }
      if (!Array.isArray(entry.options) || entry.options.length !== 4) {
        errors.push(`${where}: non ha 4 opzioni`);
        continue;
      }
      if (new Set(entry.options).size !== 4) {
        errors.push(`${where}: opzioni duplicate`);
        continue;
      }
      if (!entry.options.includes(entry.correctAnswer)) {
        errors.push(`${where}: correctAnswer non presente tra le opzioni`);
        continue;
      }
      const validTopics = entry.category === "Sicurezza" ? SECURITY_TOPICS : INTERNET_TOPICS;
      if (entry.category !== "Internet" && entry.category !== "Sicurezza") {
        errors.push(`${where}: category non valida (${entry.category})`);
        continue;
      }
      if (!validTopics.has(entry.topic)) {
        errors.push(`${where}: topic non valido per ${entry.category} (${entry.topic})`);
        continue;
      }
      if (!DIFFICULTIES.has(entry.difficulty)) {
        errors.push(`${where}: difficoltà non valida (${entry.difficulty})`);
        continue;
      }
      const wrongOptions = entry.options.filter((o) => o !== entry.correctAnswer);
      const wrongKeys = Object.keys(entry.whyOthersAreWrong ?? {});
      if (
        wrongKeys.length !== 3 ||
        !wrongOptions.every((o) => typeof entry.whyOthersAreWrong[o] === "string")
      ) {
        errors.push(`${where}: whyOthersAreWrong non copre le 3 opzioni errate`);
        continue;
      }
      if (typeof entry.explanation !== "string" || entry.explanation.trim().length < 200) {
        errors.push(
          `${where}: explanation troppo corta (${entry.explanation?.trim().length ?? 0})`,
        );
        continue;
      }
      if (/^risposta corretta:/i.test(entry.explanation.trim())) {
        errors.push(`${where}: explanation inizia con l'etichetta "Risposta corretta:"`);
        continue;
      }
      for (const field of [
        "conceptToReview",
        "miniSummary",
        "memoryTrick",
        "similarExamQuestion",
      ]) {
        if (typeof entry[field] !== "string" || entry[field].trim().length === 0) {
          errors.push(`${where}: campo ${field} mancante`);
        }
      }

      seenIds.set(entry.id, file);
      seeds.push(entry);
    }
  }

  seeds.sort((a, b) => (a.originalNumber ?? 0) - (b.originalNumber ?? 0));

  // ---- duplicati interni ----
  const internalDupes = [];
  for (let i = 0; i < seeds.length; i += 1) {
    for (let j = i + 1; j < seeds.length; j += 1) {
      const similarity = diceSimilarity(seeds[i].question, seeds[j].question);
      if (similarity >= 0.9) {
        internalDupes.push(
          `${seeds[i].id} ~ ${seeds[j].id} (${(similarity * 100).toFixed(1)}%)`,
        );
      }
    }
  }

  // ---- duplicati verso la banca dati esistente ----
  const existing = await loadExistingQuestions();
  const overlaps = [];
  for (const seed of seeds) {
    for (const question of existing) {
      const similarity = diceSimilarity(seed.question, question.question);
      if (similarity >= 0.82) {
        overlaps.push({
          historical: seed.id,
          existing: question.id,
          sourceType: question.sourceType,
          similarity: Number((similarity * 100).toFixed(1)),
          text: seed.question.slice(0, 70),
        });
      }
    }
  }

  console.log(`Blocchi letti: ${files.length}`);
  console.log(`Domande storiche valide: ${seeds.length}`);
  const byCategory = {};
  const byDifficulty = {};
  const byTopic = {};
  for (const seed of seeds) {
    byCategory[seed.category] = (byCategory[seed.category] ?? 0) + 1;
    byDifficulty[seed.difficulty] = (byDifficulty[seed.difficulty] ?? 0) + 1;
    byTopic[seed.topic] = (byTopic[seed.topic] ?? 0) + 1;
  }
  console.log("Per categoria:", byCategory);
  console.log("Per difficoltà:", byDifficulty);
  console.log("Per argomento:", byTopic);

  const missing = [];
  for (let n = 1; n <= 182; n += 1) {
    if (!seeds.some((s) => s.originalNumber === n)) missing.push(n);
  }
  console.log(`\nNumeri originali assenti (${missing.length}): ${missing.join(", ") || "nessuno"}`);

  if (internalDupes.length > 0) {
    console.log(`\nDuplicati interni (${internalDupes.length}):`);
    for (const dupe of internalDupes) console.log(`  ${dupe}`);
  }

  if (overlaps.length > 0) {
    console.log(`\nSovrapposizioni con la banca dati esistente (${overlaps.length}):`);
    for (const overlap of overlaps) {
      console.log(
        `  ${overlap.historical} ~ ${overlap.existing} [${overlap.sourceType}] ${overlap.similarity}% | ${overlap.text}`,
      );
    }
  }

  if (errors.length > 0) {
    console.error(`\nERRORI DI VALIDAZIONE (${errors.length}):`);
    for (const error of errors) console.error(`  - ${error}`);
  }

  await writeFile(
    path.join(chunkDir, "overlaps.json"),
    JSON.stringify({ overlaps, internalDupes, missing, errors }, null, 2),
    "utf8",
  );

  const body = seeds.map(serializeSeed).join("\n");
  const output = `import type { Question, StudyGuide } from "../types";

import { applyQuestionAudit } from "./questionAudit";

/**
 * Domande realmente presenti nel simulatore d'esame storico, trascritte da
 * materials/risposte_simulatore_internet.pdf. Sono la parte piu' vicina allo
 * scritto vero: vengono marcate automaticamente come sourceType "storica".
 */
type HistoricalSeed = Omit<Question, "examLikelihood" | "sourceType">;

function guide(
  conceptToReview: string,
  miniSummary: string,
  memoryTrick: string,
  similarExamQuestion: string,
): StudyGuide {
  return { conceptToReview, miniSummary, memoryTrick, similarExamQuestion };
}

const historicalSeeds: HistoricalSeed[] = [
${body}
];

export const historicalQuestions: Question[] = historicalSeeds.map((seed) =>
  applyQuestionAudit(seed),
);
`;

  const target = path.join(projectRoot, "src", "data", "historicalQuestions.ts");
  await writeFile(target, output, "utf8");
  console.log(`\nScritto ${target} con ${seeds.length} domande.`);
}

await main();
