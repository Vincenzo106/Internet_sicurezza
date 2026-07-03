import type {
  MistakeRecord,
  QuestionResult,
  QuizHistoryEntry,
  QuizSummary,
  ReviewType,
  UserAnswer,
} from "../types";

const QUIZ_HISTORY_KEY = "internet-sicurezza-quiz-history";
const MISTAKES_KEY = "internet-sicurezza-mistakes";

function parseStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const rawValue = window.localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function computeMistakePriority(timesWrong: number, timesSkipped: number) {
  return timesWrong * 4 + timesSkipped * 2 + (timesWrong > 0 ? 2 : 0);
}

function isCriticalMistake(timesWrong: number, timesSkipped: number) {
  return timesWrong >= 3 || timesSkipped >= 4;
}

function deriveReviewType(timesWrong: number): ReviewType {
  return timesWrong > 0 ? "wrong" : "skipped";
}

function getRelevantTimestamp(record: MistakeRecord) {
  return record.reviewType === "wrong"
    ? record.lastWrongAt
    : (record.lastSkippedAt ?? record.lastWrongAt);
}

function sortMistakes(mistakes: MistakeRecord[]) {
  return mistakes.slice().sort((left, right) => {
    if (left.reviewType !== right.reviewType) {
      return left.reviewType === "wrong" ? -1 : 1;
    }

    if (right.isCritical !== left.isCritical) {
      return Number(right.isCritical) - Number(left.isCritical);
    }

    if (right.priorityScore !== left.priorityScore) {
      return right.priorityScore - left.priorityScore;
    }

    return getRelevantTimestamp(right).localeCompare(getRelevantTimestamp(left));
  });
}

function normalizeUserAnswers(entry: QuizHistoryEntry): UserAnswer[] {
  return Array.isArray(entry.answers)
    ? entry.answers.map((answer) => ({
        questionId: answer.questionId,
        selectedAnswer:
          typeof answer.selectedAnswer === "string" ? answer.selectedAnswer : null,
        status: answer.status === "answered" ? "answered" : "unanswered",
      }))
    : [];
}

function normalizeMistakeRecord(record: MistakeRecord): MistakeRecord {
  const timesWrong = typeof record.timesWrong === "number" ? record.timesWrong : 0;
  const timesSkipped =
    typeof record.timesSkipped === "number" ? record.timesSkipped : 0;
  const reviewType =
    record.reviewType ?? deriveReviewType(timesWrong);
  const priorityScore =
    typeof record.priorityScore === "number"
      ? record.priorityScore
      : computeMistakePriority(timesWrong, timesSkipped);
  const isCritical =
    typeof record.isCritical === "boolean"
      ? record.isCritical
      : isCriticalMistake(timesWrong, timesSkipped);

  return {
    ...record,
    isCritical,
    lastOutcome: record.lastOutcome ?? reviewType,
    lastSkippedAt: record.lastSkippedAt ?? record.lastWrongAt,
    lastUserAnswer:
      typeof record.lastUserAnswer === "string" ? record.lastUserAnswer : null,
    priorityScore,
    reviewType,
    timesSkipped,
    timesWrong,
  };
}

export function getQuizHistory(): QuizHistoryEntry[] {
  const history = parseStorage<QuizHistoryEntry[]>(QUIZ_HISTORY_KEY, []);

  return history.map((entry) => ({
    ...entry,
    answers: normalizeUserAnswers(entry),
    correctCount: entry.correctCount ?? entry.score ?? 0,
    wrongCount: entry.wrongCount ?? 0,
    rawScore:
      typeof entry.rawScore === "number"
        ? entry.rawScore
        : (entry.score ?? 0) * 1.5,
    finalScore:
      typeof entry.finalScore === "number"
        ? entry.finalScore
        : Math.max(0, (entry.score ?? 0) * 1.5),
    maxScore: entry.maxScore ?? 30,
    timeSpentSeconds: entry.timeSpentSeconds ?? 0,
    unansweredCount: entry.unansweredCount ?? 0,
  }));
}

export function saveQuizResult(summary: QuizSummary) {
  const history = getQuizHistory();

  const nextEntry: QuizHistoryEntry = {
    id: crypto.randomUUID(),
    mode: summary.mode,
    completedAt: summary.completedAt,
    score: summary.score,
    correctCount: summary.correctCount,
    wrongCount: summary.wrongCount,
    total: summary.total,
    percentage: summary.percentage,
    rawScore: summary.rawScore,
    finalScore: summary.finalScore,
    maxScore: summary.maxScore,
    timeSpentSeconds: summary.timeSpentSeconds,
    unansweredCount: summary.unansweredCount,
    answers: summary.results.map((result) => ({
      questionId: result.question.id,
      selectedAnswer: result.selectedAnswer,
      status: result.status === "correct" || result.status === "wrong"
        ? "answered"
        : "unanswered",
    })),
  };

  writeStorage(QUIZ_HISTORY_KEY, [nextEntry, ...history].slice(0, 100));
}

export function getMistakes(): MistakeRecord[] {
  const mistakes = parseStorage<MistakeRecord[]>(MISTAKES_KEY, []);

  return sortMistakes(mistakes.map(normalizeMistakeRecord));
}

export function updateQuestionMistakeCounter(result: QuestionResult) {
  if (result.status === "correct") {
    return;
  }

  const mistakes = getMistakes();
  const currentIndex = mistakes.findIndex(
    (record) => record.questionId === result.question.id,
  );
  const timestamp = new Date().toISOString();
  const isSkipped = result.status === "unanswered";

  if (currentIndex === -1) {
    const timesWrong = isSkipped ? 0 : 1;
    const timesSkipped = isSkipped ? 1 : 0;
    const reviewType = deriveReviewType(timesWrong);
    const record: MistakeRecord = {
      questionId: result.question.id,
      question: result.question.question,
      category: result.question.category,
      topic: result.question.topic,
      explanation: result.question.explanation,
      source: result.question.source,
      correctAnswer: result.question.correctAnswer,
      isCritical: isCriticalMistake(timesWrong, timesSkipped),
      lastOutcome: isSkipped ? "skipped" : "wrong",
      lastSkippedAt: isSkipped ? timestamp : undefined,
      lastUserAnswer: result.selectedAnswer,
      lastWrongAt: timestamp,
      priorityScore: computeMistakePriority(timesWrong, timesSkipped),
      reviewType,
      timesSkipped,
      timesWrong,
    };

    writeStorage(MISTAKES_KEY, sortMistakes([record, ...mistakes]));
    return;
  }

  const updatedMistakes = [...mistakes];
  const currentRecord = updatedMistakes[currentIndex];
  const nextTimesWrong = currentRecord.timesWrong + (isSkipped ? 0 : 1);
  const nextTimesSkipped = currentRecord.timesSkipped + (isSkipped ? 1 : 0);
  const reviewType = deriveReviewType(nextTimesWrong);

  updatedMistakes[currentIndex] = {
    ...currentRecord,
    explanation: result.question.explanation,
    source: result.question.source,
    correctAnswer: result.question.correctAnswer,
    topic: result.question.topic,
    question: result.question.question,
    category: result.question.category,
    isCritical: isCriticalMistake(nextTimesWrong, nextTimesSkipped),
    lastOutcome: isSkipped ? "skipped" : "wrong",
    lastSkippedAt: isSkipped ? timestamp : currentRecord.lastSkippedAt,
    lastUserAnswer: result.selectedAnswer,
    lastWrongAt: isSkipped ? currentRecord.lastWrongAt : timestamp,
    priorityScore: computeMistakePriority(nextTimesWrong, nextTimesSkipped),
    reviewType,
    timesSkipped: nextTimesSkipped,
    timesWrong: nextTimesWrong,
  };

  writeStorage(MISTAKES_KEY, sortMistakes(updatedMistakes));
}

export function saveMistakes(results: QuestionResult[]) {
  results
    .filter((result) => result.status === "wrong" || result.status === "unanswered")
    .forEach((result) => updateQuestionMistakeCounter(result));
}

export function clearMistakes() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(MISTAKES_KEY);
}

export function clearQuizHistory() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(QUIZ_HISTORY_KEY);
}

export function clearAllStudyData() {
  clearQuizHistory();
  clearMistakes();
}
