import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const currentFile = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(currentFile), "..");

function stripModuleSyntax(source) {
  return source
    .replace(/^import\s+.*?;\s*$/gmu, "")
    .replace(/^export\s+\{\s*hardQuestionIds\s*\};\s*$/gmu, "")
    .replace(/\bexport\s+const\b/g, "const")
    .replace(/\bexport\s+function\b/g, "function")
    .replace(/\bexport\s+type\b/g, "type");
}

async function loadQuestionData() {
  const questionAuditSource = await readFile(
    path.join(projectRoot, "src", "data", "questionAudit.ts"),
    "utf8",
  );
  const advancedQuestionsSource = await readFile(
    path.join(projectRoot, "src", "data", "advancedQuestions.ts"),
    "utf8",
  );
  const questionsSource = await readFile(
    path.join(projectRoot, "src", "data", "questions.ts"),
    "utf8",
  );

  const mergedSource = `
    ${stripModuleSyntax(questionAuditSource)}
    ${stripModuleSyntax(advancedQuestionsSource)}
    ${stripModuleSyntax(questionsSource)}
    (() => ({ questions, hardQuestionIds }))();
  `;

  const transpiled = ts.transpileModule(mergedSource, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText.replace(/^export\s*\{\};?\s*$/gmu, "");

  return vm.runInNewContext(transpiled, {});
}

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

  if (leftSet.size === 0 || rightSet.size === 0) {
    return 0;
  }

  let overlap = 0;

  for (const token of leftSet) {
    if (rightSet.has(token)) {
      overlap += 1;
    }
  }

  return (2 * overlap) / (leftSet.size + rightSet.size);
}

function buildCountMap(questions, key) {
  return questions.reduce((accumulator, question) => {
    const label = question[key];
    accumulator[label] = (accumulator[label] ?? 0) + 1;
    return accumulator;
  }, {});
}

function ensureWhyOthersCoverage(question) {
  if (!question.whyOthersAreWrong) {
    return false;
  }

  const wrongOptions = question.options.filter(
    (option) => option !== question.correctAnswer,
  );

  if (wrongOptions.length !== 3) {
    return false;
  }

  return wrongOptions.every((option) => {
    const reason = question.whyOthersAreWrong?.[option];
    return typeof reason === "string" && reason.trim().length > 0;
  });
}

function printGroupedCounts(questions) {
  const byCategory = buildCountMap(questions, "category");
  const byLikelihood = buildCountMap(questions, "examLikelihood");
  const bySourceType = buildCountMap(questions, "sourceType");

  console.log(
    `Domande totali: ${questions.length} | Internet: ${byCategory.Internet ?? 0} | Sicurezza: ${byCategory.Sicurezza ?? 0}`,
  );
  console.log(
    `Exam likelihood | alta: ${byLikelihood.alta ?? 0} | media: ${byLikelihood.media ?? 0} | bassa: ${byLikelihood.bassa ?? 0}`,
  );
  console.log(
    `Source type | storica: ${bySourceType.storica ?? 0} | simile: ${bySourceType.simile ?? 0} | generata: ${bySourceType.generata ?? 0}`,
  );
}

function validateQuestions(questions, hardQuestionIds) {
  const errors = [];
  const warnings = [];
  const validCategories = new Set(["Internet", "Sicurezza"]);
  const validDifficulties = new Set(["facile", "media", "difficile"]);
  const validLikelihoods = new Set(["alta", "media", "bassa"]);
  const validSourceTypes = new Set(["storica", "simile", "generata"]);
  const idMap = new Map();
  const exactQuestionMap = new Map();

  for (const question of questions) {
    if (idMap.has(question.id)) {
      errors.push(`ID duplicato: ${question.id}`);
    } else {
      idMap.set(question.id, question.question);
    }

    if (!Array.isArray(question.options) || question.options.length !== 4) {
      errors.push(`La domanda ${question.id} non ha esattamente 4 opzioni`);
    }

    if (!question.options.includes(question.correctAnswer)) {
      errors.push(`La risposta corretta di ${question.id} non è tra le opzioni`);
    }

    if (!validCategories.has(question.category)) {
      errors.push(`Categoria non valida in ${question.id}: ${question.category}`);
    }

    if (!validDifficulties.has(question.difficulty)) {
      errors.push(`Difficoltà non valida in ${question.id}: ${question.difficulty}`);
    }

    if (!validLikelihoods.has(question.examLikelihood)) {
      errors.push(
        `Exam likelihood non valida in ${question.id}: ${question.examLikelihood}`,
      );
    }

    if (!validSourceTypes.has(question.sourceType)) {
      errors.push(`Source type non valido in ${question.id}: ${question.sourceType}`);
    }

    if (typeof question.topic !== "string" || question.topic.trim().length === 0) {
      errors.push(`Topic vuoto in ${question.id}`);
    }

    if (typeof question.source !== "string" || question.source.trim().length === 0) {
      errors.push(`Source assente in ${question.id}`);
    }

    if (
      typeof question.explanation !== "string" ||
      question.explanation.trim().length < 200
    ) {
      errors.push(
        `Explanation troppo corta o assente in ${question.id} (${question.explanation?.trim().length ?? 0} caratteri)`,
      );
    }

    if (!ensureWhyOthersCoverage(question)) {
      errors.push(`whyOthersAreWrong incompleto o assente in ${question.id}`);
    }

    const normalizedQuestion = normalizeText(question.question);

    if (exactQuestionMap.has(normalizedQuestion)) {
      errors.push(
        `Domanda duplicata: ${question.id} è uguale a ${exactQuestionMap.get(
          normalizedQuestion,
        )}`,
      );
    } else {
      exactQuestionMap.set(normalizedQuestion, question.id);
    }
  }

  for (let outer = 0; outer < questions.length; outer += 1) {
    for (let inner = outer + 1; inner < questions.length; inner += 1) {
      const left = questions[outer];
      const right = questions[inner];

      if (left.topic !== right.topic || left.category !== right.category) {
        continue;
      }

      const similarity = diceSimilarity(left.question, right.question);

      if (similarity >= 0.985) {
        warnings.push(
          `Domande quasi identiche: ${left.id} e ${right.id} (similarità ${(similarity * 100).toFixed(1)}%)`,
        );
      }
    }
  }

  for (const hardId of hardQuestionIds) {
    if (!idMap.has(hardId)) {
      errors.push(`hardQuestionId inesistente: ${hardId}`);
    }
  }

  return { errors, warnings };
}

async function main() {
  const { questions, hardQuestionIds } = await loadQuestionData();
  const { errors, warnings } = validateQuestions(questions, hardQuestionIds);

  printGroupedCounts(questions);
  console.log(`Hard question set: ${hardQuestionIds.length} domande`);

  if (warnings.length > 0) {
    console.log("\nWarning:");
    for (const warning of warnings) {
      console.log(`- ${warning}`);
    }
  }

  if (errors.length > 0) {
    console.error("\nErrori di validazione:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("\nValidazione completata senza errori bloccanti.");
}

await main();
