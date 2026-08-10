import type {
  ActiveSession,
  BreakdownItem,
  Difficulty,
  DifficultyFilter,
  ExamLikelihoodFilter,
  MistakeRecord,
  PersonalizedWrongAnswerExplanation,
  Question,
  QuestionResult,
  QuizSummary,
  SourceTypeFilter,
  TrainingFilters,
  TopicMissStat,
} from "../types";

export const EXAM_BLUEPRINT = {
  Internet: 15,
  Sicurezza: 5,
} as const;

export const EXAM_TOTAL_QUESTIONS =
  EXAM_BLUEPRINT.Internet + EXAM_BLUEPRINT.Sicurezza;

export const EXAM_SCORING = {
  correct: 1.5,
  wrong: -0.5,
  unanswered: 0,
  maxScore: 30,
} as const;

const EXPLANATION_LABELS = [
  "Risposta corretta:",
  "Perché le altre sono sbagliate:",
  "Concetto da ricordare:",
  "Trucchetto da esame:",
] as const;

export function shuffleArray<T>(items: T[]): T[] {
  const cloned = [...items];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }

  return cloned;
}

export function randomizeOptions(question: Question): Question {
  return {
    ...question,
    options: shuffleArray(question.options),
  };
}

function matchesDifficulty(question: Question, difficultyFilter: DifficultyFilter) {
  return difficultyFilter === "tutte" || question.difficulty === difficultyFilter;
}

function matchesExamLikelihood(
  question: Question,
  examLikelihoodFilter: ExamLikelihoodFilter,
) {
  return (
    examLikelihoodFilter === "tutte" ||
    question.examLikelihood === examLikelihoodFilter
  );
}

function matchesSourceType(question: Question, sourceTypeFilter: SourceTypeFilter) {
  return sourceTypeFilter === "tutte" || question.sourceType === sourceTypeFilter;
}

function matchesQuestionFilters(
  question: Question,
  filters: Partial<TrainingFilters> = {},
) {
  return (
    matchesDifficulty(question, filters.difficulty ?? "tutte") &&
    matchesExamLikelihood(question, filters.examLikelihood ?? "tutte") &&
    matchesSourceType(question, filters.sourceType ?? "tutte")
  );
}

function pickQuestionsByBlueprint(
  availableQuestions: Question[],
  blueprint: typeof EXAM_BLUEPRINT,
) {
  const internetQuestions = shuffleArray(
    availableQuestions.filter((question) => question.category === "Internet"),
  )
    .slice(0, blueprint.Internet)
    .map(randomizeOptions);

  const securityQuestions = shuffleArray(
    availableQuestions.filter((question) => question.category === "Sicurezza"),
  )
    .slice(0, blueprint.Sicurezza)
    .map(randomizeOptions);

  return shuffleArray([...internetQuestions, ...securityQuestions]);
}

export function getExamQuestions(
  allQuestions: Question[],
  filters: Partial<TrainingFilters> = {},
): Question[] {
  return pickQuestionsByBlueprint(
    allQuestions.filter((question) => matchesQuestionFilters(question, filters)),
    EXAM_BLUEPRINT,
  );
}

export function getHardExamQuestions(
  allQuestions: Question[],
  hardQuestionIds: string[],
): Question[] {
  const hardIdSet = new Set(hardQuestionIds);
  const hardQuestions = allQuestions.filter((question) => hardIdSet.has(question.id));

  return pickQuestionsByBlueprint(hardQuestions, EXAM_BLUEPRINT);
}

export function getSprintQuestions(allQuestions: Question[]): Question[] {
  return pickQuestionsByBlueprint(
    allQuestions.filter(
      (question) =>
        question.examLikelihood === "alta" || question.examLikelihood === "media",
    ),
    EXAM_BLUEPRINT,
  );
}

export function getQuestionsByTopic(
  allQuestions: Question[],
  topics: string[],
  count?: number,
  filters: Partial<TrainingFilters> = {},
): Question[] {
  const filteredQuestions =
    topics.length === 0
      ? allQuestions.filter((question) => matchesQuestionFilters(question, filters))
      : allQuestions.filter(
          (question) =>
            topics.includes(question.topic) &&
            matchesQuestionFilters(question, filters),
        );

  const requested = typeof count === "number" ? count : filteredQuestions.length;

  return shuffleArray(filteredQuestions)
    .slice(0, requested)
    .map(randomizeOptions);
}

export function getQuestionsByIds(
  allQuestions: Question[],
  questionIds: string[],
): Question[] {
  const idSet = new Set(questionIds);

  return shuffleArray(
    allQuestions.filter((question) => idSet.has(question.id)).map(randomizeOptions),
  );
}

export function getSmartMistakeQuestions(
  allQuestions: Question[],
  mistakes: MistakeRecord[],
  limit = 20,
): Question[] {
  const questionLookup = new Map(allQuestions.map((question) => [question.id, question]));
  const sortedMistakes = mistakes
    .slice()
    .sort((left, right) => {
      if (right.reviewType !== left.reviewType) {
        return left.reviewType === "wrong" ? -1 : 1;
      }

      if (right.isCritical !== left.isCritical) {
        return Number(right.isCritical) - Number(left.isCritical);
      }

      if (right.priorityScore !== left.priorityScore) {
        return right.priorityScore - left.priorityScore;
      }

      return right.lastWrongAt.localeCompare(left.lastWrongAt);
    });

  const selectedMistakes = sortedMistakes.slice(0, limit);

  return selectedMistakes
    .map((mistake) => questionLookup.get(mistake.questionId))
    .filter((question): question is Question => Boolean(question))
    .map(randomizeOptions);
}

function normalizeSelectedAnswer(selectedAnswer: string | null | undefined) {
  return typeof selectedAnswer === "string" ? selectedAnswer : null;
}

function extractExplanationSection(
  explanation: string,
  label: (typeof EXPLANATION_LABELS)[number],
) {
  const startIndex = explanation.indexOf(label);

  if (startIndex === -1) {
    return "";
  }

  const contentStart = startIndex + label.length;
  const nextIndexCandidates = EXPLANATION_LABELS.filter((item) => item !== label)
    .map((item) => explanation.indexOf(item, contentStart))
    .filter((index) => index !== -1);

  const endIndex =
    nextIndexCandidates.length > 0
      ? Math.min(...nextIndexCandidates)
      : explanation.length;

  return explanation.slice(contentStart, endIndex).trim();
}

export function getPersonalizedWrongAnswerExplanation(
  question: Question,
  selectedAnswer: string | null,
): PersonalizedWrongAnswerExplanation {
  const whyCorrectAnswerIsRight =
    extractExplanationSection(question.explanation, "Risposta corretta:") ||
    question.explanation;
  const conceptToReview =
    question.studyGuide?.conceptToReview ||
    extractExplanationSection(question.explanation, "Concetto da ricordare:") ||
    `Ripassa ${question.topic}.`;
  const examTrick =
    question.studyGuide?.memoryTrick ||
    extractExplanationSection(question.explanation, "Trucchetto da esame:") ||
    "Se sei molto incerto, elimina prima le opzioni che spostano il concetto su un livello o protocollo diverso.";
  const similarExamQuestion =
    question.studyGuide?.similarExamQuestion ||
    "Quale affermazione descrive correttamente lo stesso concetto senza confonderlo con protocolli vicini?";

  const whyYourAnswerIsWrong =
    selectedAnswer === null
      ? `Hai lasciato la domanda senza risposta. Non hai perso punti, ma hai lasciato scoperto un concetto che all'esame può comunque ricomparire in forma molto simile.`
      : question.whyOthersAreWrong?.[selectedAnswer]
        ? `Hai scelto "${selectedAnswer}". ${question.whyOthersAreWrong[selectedAnswer]}`
        : `Hai scelto "${selectedAnswer}", ma questa opzione non soddisfa ciò che la domanda chiedeva davvero e ti porta fuori dal focus corretto del topic ${question.topic}.`;

  return {
    generalExplanation: question.explanation,
    whyYourAnswerIsWrong,
    whyCorrectAnswerIsRight: `La risposta corretta è "${question.correctAnswer}". ${whyCorrectAnswerIsRight}`,
    conceptToReview,
    examTrick,
    similarExamQuestion,
  };
}

function buildQuestionResult(
  question: Question,
  selectedAnswer: string | null | undefined,
): QuestionResult {
  const normalizedAnswer = normalizeSelectedAnswer(selectedAnswer);

  if (normalizedAnswer === null) {
    return {
      question,
      selectedAnswer: null,
      isCorrect: false,
      status: "unanswered",
      points: EXAM_SCORING.unanswered,
      personalizedExplanation: getPersonalizedWrongAnswerExplanation(question, null),
    };
  }

  const isCorrect = normalizedAnswer === question.correctAnswer;

  return {
    question,
    selectedAnswer: normalizedAnswer,
    isCorrect,
    status: isCorrect ? "correct" : "wrong",
    points: isCorrect ? EXAM_SCORING.correct : EXAM_SCORING.wrong,
    personalizedExplanation: isCorrect
      ? undefined
      : getPersonalizedWrongAnswerExplanation(question, normalizedAnswer),
  };
}

export function calculateExamGrade(
  answers: Record<string, string | null | undefined>,
  questions: Question[],
) {
  const results = questions.map((question) =>
    buildQuestionResult(question, answers[question.id]),
  );
  const correctCount = results.filter((result) => result.status === "correct").length;
  const wrongCount = results.filter((result) => result.status === "wrong").length;
  const unansweredCount = results.filter(
    (result) => result.status === "unanswered",
  ).length;
  const rawScore = results.reduce((sum, result) => sum + result.points, 0);
  const finalScore = Math.max(0, rawScore);
  const maxScore = EXAM_SCORING.maxScore;
  const percentage = Math.round((finalScore / maxScore) * 100);

  return {
    correctCount,
    wrongCount,
    unansweredCount,
    rawScore,
    finalScore,
    maxScore,
    percentage,
    results,
  };
}

export function calculateScore(
  questions: Question[],
  answers: Record<string, string | null | undefined>,
) {
  const grade = calculateExamGrade(answers, questions);

  return {
    score: grade.correctCount,
    total: questions.length,
    percentage: grade.percentage,
    results: grade.results,
    correctCount: grade.correctCount,
    wrongCount: grade.wrongCount,
    unansweredCount: grade.unansweredCount,
    rawScore: grade.rawScore,
    finalScore: grade.finalScore,
    maxScore: grade.maxScore,
  };
}

function calculateAccuracy(correct: number, total: number) {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

function buildBreakdown(
  results: QuestionResult[],
  getLabel: (result: QuestionResult) => string,
): BreakdownItem[] {
  const buckets = new Map<string, BreakdownItem>();

  for (const result of results) {
    const label = getLabel(result);
    const currentBucket = buckets.get(label) ?? {
      label,
      correct: 0,
      wrong: 0,
      unanswered: 0,
      total: 0,
      accuracy: 0,
    };

    currentBucket.total += 1;

    if (result.status === "correct") {
      currentBucket.correct += 1;
    } else if (result.status === "wrong") {
      currentBucket.wrong += 1;
    } else {
      currentBucket.unanswered += 1;
    }

    currentBucket.accuracy = calculateAccuracy(
      currentBucket.correct,
      currentBucket.total,
    );

    buckets.set(label, currentBucket);
  }

  return [...buckets.values()].sort((left, right) => {
    if (right.wrong !== left.wrong) {
      return right.wrong - left.wrong;
    }

    if (right.unanswered !== left.unanswered) {
      return right.unanswered - left.unanswered;
    }

    if (right.total !== left.total) {
      return right.total - left.total;
    }

    return left.label.localeCompare(right.label, "it");
  });
}

function buildDifficultyBreakdown(results: QuestionResult[]) {
  const desiredOrder: Difficulty[] = ["difficile", "media", "facile"];
  const breakdown = buildBreakdown(results, (result) => result.question.difficulty);

  return breakdown.sort(
    (left, right) =>
      desiredOrder.indexOf(left.label as Difficulty) -
      desiredOrder.indexOf(right.label as Difficulty),
  );
}

function buildCategoryBreakdown(results: QuestionResult[]) {
  const desiredOrder = ["Internet", "Sicurezza"];
  const breakdown = buildBreakdown(results, (result) => result.question.category);

  return breakdown.sort(
    (left, right) => desiredOrder.indexOf(left.label) - desiredOrder.indexOf(right.label),
  );
}

function buildMostMissedTopics(results: QuestionResult[]): TopicMissStat[] {
  return buildBreakdown(results, (result) => result.question.topic)
    .filter((item) => item.wrong > 0 || item.unanswered > 0)
    .map((item) => ({
      topic: item.label,
      wrong: item.wrong,
      unanswered: item.unanswered,
      total: item.total,
      accuracy: item.accuracy,
    }))
    .sort((left, right) => {
      const leftWeight = left.wrong * 2 + left.unanswered;
      const rightWeight = right.wrong * 2 + right.unanswered;

      if (rightWeight !== leftWeight) {
        return rightWeight - leftWeight;
      }

      return left.topic.localeCompare(right.topic, "it");
    })
    .slice(0, 5);
}

export function getResultMessage(finalScore: number): string {
  if (finalScore >= 27) {
    return "Modalità boss finale: sei molto vicino all'esame";
  }

  if (finalScore >= 24) {
    return "Buono davvero, ma occhio ai tranelli";
  }

  if (finalScore >= 18) {
    return "Sufficiente, però serve consolidare";
  }

  if (finalScore >= 12) {
    return "Rischioso: devi ripassare gli argomenti deboli";
  }

  return "Allarme rosso: serve terapia d'urto";
}

function buildStrategySuggestion(
  wrongCount: number,
  unansweredCount: number,
  finalScore: number,
  mostMissedTopics: TopicMissStat[],
) {
  const topTopic = mostMissedTopics[0]?.topic;

  if (finalScore >= 24) {
    return `Stai entrando nella fascia buona: per alzare ancora il livello passa a Domande cattive o Sprint pre-esame e verifica se reggi meglio i tranelli sui topic ${topTopic ?? "più ricorrenti"}.`;
  }

  if (wrongCount >= 4 && wrongCount >= unansweredCount) {
    return `Hai perso più punti sulle risposte sbagliate che sulle omissioni: nella prossima simulazione usa più spesso "Non rispondere" quando hai un dubbio forte, soprattutto su ${topTopic ?? "gli argomenti dove sbagli di più"}.`;
  }

  if (unansweredCount >= 4) {
    return `Hai lasciato troppe domande in bianco: ripassa subito ${topTopic ?? "i topic saltati"} e rifai una prova corta cercando di trasformare almeno parte delle non risposte in risposte consapevoli.`;
  }

  if (topTopic) {
    return `Il punto debole più evidente è "${topTopic}": prima della prossima simulazione ripassalo in modo mirato e poi rifai le sbagliate per vedere se il ragionamento regge meglio.`;
  }

  return `La base c'è, ma la prossima simulazione deve confermare la tenuta: punta a ridurre prima gli errori concettuali e poi le esitazioni residue.`;
}

export function formatScoreValue(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

export function buildQuizSummary(
  session: ActiveSession,
  answers: Record<string, string | null | undefined>,
  startedAtMs: number,
  submittedAtMs: number,
  autoSubmitted = false,
): QuizSummary {
  const baseSummary = calculateScore(session.questions, answers);
  const topicBreakdown = buildBreakdown(
    baseSummary.results,
    (result) => result.question.topic,
  );
  const difficultyBreakdown = buildDifficultyBreakdown(baseSummary.results);
  const categoryBreakdown = buildCategoryBreakdown(baseSummary.results);
  const mostMissedTopics = buildMostMissedTopics(baseSummary.results);
  const timeSpentSeconds = Math.max(
    1,
    Math.round((submittedAtMs - startedAtMs) / 1000),
  );

  return {
    ...baseSummary,
    mode: session.mode,
    completedAt: new Date(submittedAtMs).toISOString(),
    startedAt: new Date(startedAtMs).toISOString(),
    submittedAt: new Date(submittedAtMs).toISOString(),
    autoSubmitted,
    categoryBreakdown,
    difficultyBreakdown,
    immediateReviewTopics: mostMissedTopics.slice(0, 3).map((item) => item.topic),
    levelReached: getResultMessage(baseSummary.finalScore),
    mostMissedTopics,
    strategySuggestion: buildStrategySuggestion(
      baseSummary.wrongCount,
      baseSummary.unansweredCount,
      baseSummary.finalScore,
      mostMissedTopics,
    ),
    timeLimitSeconds: session.config?.timeLimitSeconds,
    timeSpentSeconds,
    topicBreakdown,
  };
}

export function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  const hours = Math.floor(minutes / 60);
  const displayMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${displayMinutes.toString().padStart(2, "0")}m ${seconds
      .toString()
      .padStart(2, "0")}s`;
  }

  return `${displayMinutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
