export type Category = "Internet" | "Sicurezza";

export type Difficulty = "facile" | "media" | "difficile";

export type DifficultyFilter = Difficulty | "tutte";

export type ExamLikelihood = "alta" | "media" | "bassa";

export type ExamLikelihoodFilter = ExamLikelihood | "tutte";

export type SourceType = "storica" | "simile" | "generata";

export type SourceTypeFilter = SourceType | "tutte";

export type QuizMode =
  | "exam"
  | "real-exam"
  | "hard-exam"
  | "sprint-july-6"
  | "training"
  | "mistake-review";

export type StudyGuide = {
  conceptToReview: string;
  miniSummary: string;
  memoryTrick: string;
  similarExamQuestion: string;
};

export type UserAnswerStatus = "answered" | "unanswered" | "pending";

export type QuestionResultStatus = "correct" | "wrong" | "unanswered";

export type ReviewType = "wrong" | "skipped";

export type Question = {
  id: string;
  category: Category;
  topic: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  examLikelihood: ExamLikelihood;
  whyOthersAreWrong?: Record<string, string>;
  source?: string;
  sourceType: SourceType;
  studyGuide?: StudyGuide;
};

export type UserAnswer = {
  questionId: string;
  selectedAnswer: string | null;
  status: Exclude<UserAnswerStatus, "pending">;
};

export type PersonalizedWrongAnswerExplanation = {
  generalExplanation: string;
  whyYourAnswerIsWrong: string;
  whyCorrectAnswerIsRight: string;
  conceptToReview: string;
  examTrick: string;
  similarExamQuestion: string;
};

export type QuestionResult = {
  question: Question;
  selectedAnswer: string | null;
  isCorrect: boolean;
  status: QuestionResultStatus;
  points: number;
  personalizedExplanation?: PersonalizedWrongAnswerExplanation;
};

export type BreakdownItem = {
  label: string;
  correct: number;
  wrong: number;
  unanswered: number;
  total: number;
  accuracy: number;
};

export type TopicMissStat = {
  topic: string;
  wrong: number;
  unanswered: number;
  total: number;
  accuracy: number;
};

export type SessionQuestionInsight = {
  isCritical?: boolean;
  priorityScore?: number;
  reviewType?: ReviewType;
  timesSkipped?: number;
  timesWrong?: number;
};

export type SessionConfig = {
  allowSkip?: boolean;
  autoSubmitOnTimeout?: boolean;
  questionInsights?: Record<string, SessionQuestionInsight>;
  requireAllAnswers?: boolean;
  showImmediateFeedback?: boolean;
  timeLimitSeconds?: number;
};

export type QuizSummary = {
  mode: QuizMode;
  completedAt: string;
  startedAt: string;
  submittedAt: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  rawScore: number;
  finalScore: number;
  maxScore: number;
  total: number;
  percentage: number;
  autoSubmitted?: boolean;
  categoryBreakdown: BreakdownItem[];
  difficultyBreakdown: BreakdownItem[];
  immediateReviewTopics: string[];
  levelReached: string;
  mostMissedTopics: TopicMissStat[];
  results: QuestionResult[];
  strategySuggestion: string;
  timeLimitSeconds?: number;
  timeSpentSeconds: number;
  topicBreakdown: BreakdownItem[];
};

export type QuizHistoryEntry = {
  id: string;
  mode: QuizMode;
  completedAt: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  total: number;
  percentage: number;
  rawScore: number;
  finalScore: number;
  maxScore: number;
  timeSpentSeconds: number;
  unansweredCount: number;
  answers: UserAnswer[];
};

export type MistakeRecord = {
  questionId: string;
  question: string;
  category: Category;
  topic: string;
  explanation: string;
  source?: string;
  correctAnswer: string;
  isCritical: boolean;
  lastUserAnswer?: string | null;
  lastOutcome: ReviewType;
  reviewType: ReviewType;
  priorityScore: number;
  timesSkipped: number;
  timesWrong: number;
  lastSkippedAt?: string;
  lastWrongAt: string;
};

export type TopicGroup = {
  category: Category;
  title: string;
  topics: string[];
};

export type TrainingFilters = {
  difficulty: DifficultyFilter;
  examLikelihood: ExamLikelihoodFilter;
  sourceType: SourceTypeFilter;
};

export type ActiveSession = {
  config?: SessionConfig;
  description: string;
  mode: QuizMode;
  title: string;
  questions: Question[];
};

export type AppView = "home" | "training" | "mistakes" | "quiz" | "result";
