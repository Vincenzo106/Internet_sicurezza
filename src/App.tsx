import { useEffect, useState } from "react";

import { Home } from "./components/Home";
import { MistakeReview } from "./components/MistakeReview";
import { Quiz } from "./components/Quiz";
import { ResultPage } from "./components/ResultPage";
import { TopicTraining } from "./components/TopicTraining";
import { hardQuestionIds, questions, topicGroups } from "./data/questions";
import type {
  ActiveSession,
  AppView,
  MistakeRecord,
  QuizHistoryEntry,
  QuizSummary,
  SessionQuestionInsight,
  TrainingFilters,
} from "./types";
import {
  getExamQuestions,
  getHardExamQuestions,
  getQuestionsByIds,
  getQuestionsByTopic,
  getSmartMistakeQuestions,
  getSprintQuestions,
} from "./utils/quiz";
import {
  clearAllStudyData,
  clearMistakes,
  clearQuizHistory,
  getMistakes,
  getQuizHistory,
  saveMistakes,
  saveQuizResult,
} from "./utils/storage";

function App() {
  const [view, setView] = useState<AppView>("home");
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [latestSummary, setLatestSummary] = useState<QuizSummary | null>(null);
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);

  function refreshStorageState() {
    setHistory(getQuizHistory());
    setMistakes(getMistakes());
  }

  function buildQuestionInsights(questionIds: string[]) {
    return Object.fromEntries(
      mistakes
        .filter((mistake) => questionIds.includes(mistake.questionId))
        .map((mistake) => [
          mistake.questionId,
          {
            isCritical: mistake.isCritical,
            priorityScore: mistake.priorityScore,
            reviewType: mistake.reviewType,
            timesSkipped: mistake.timesSkipped,
            timesWrong: mistake.timesWrong,
          } satisfies SessionQuestionInsight,
        ]),
    );
  }

  useEffect(() => {
    refreshStorageState();
  }, []);

  function openHome() {
    setView("home");
    setActiveSession(null);
  }

  function startSession(session: ActiveSession) {
    setActiveSession(session);
    setView("quiz");
  }

  function handleStartExam() {
    startSession({
      mode: "exam",
      title: "Simulazione classica",
      description:
        "Quiz da 20 domande con blueprint 15 Internet + 5 Sicurezza, ordine casuale e possibilita di lasciare in bianco i dubbi forti senza perdere altri punti.",
      questions: getExamQuestions(questions),
    });
  }

  function handleStartRealExam(minutes: number) {
    startSession({
      mode: "real-exam",
      title: "Esame reale",
      description:
        "Stessa struttura dell'esame scritto, ma con timer attivo, salto domanda consentito e consegna automatica allo scadere.",
      questions: getExamQuestions(questions),
      config: {
        allowSkip: true,
        autoSubmitOnTimeout: true,
        requireAllAnswers: false,
        timeLimitSeconds: minutes * 60,
      },
    });
  }

  function handleStartHardExam() {
    startSession({
      mode: "hard-exam",
      title: "Domande cattive",
      description:
        "Set piu aggressivo: affermazioni false, differenze sottili tra protocolli, tranelli sui livelli e confronti da scritto vero.",
      questions: getHardExamQuestions(questions, hardQuestionIds),
      config: {
        allowSkip: true,
        requireAllAnswers: false,
      },
    });
  }

  function handleStartSprintJulySix() {
    startSession({
      mode: "sprint-july-6",
      title: "Sprint pre-esame",
      description:
        "Ripasso urgente da 20 domande: solo probabilita esame alta o media, 15 Internet + 5 Sicurezza e timer da 25 minuti.",
      questions: getSprintQuestions(questions),
      config: {
        allowSkip: true,
        autoSubmitOnTimeout: true,
        requireAllAnswers: false,
        timeLimitSeconds: 25 * 60,
      },
    });
  }

  function handleOpenTraining() {
    setView("training");
  }

  function handleOpenMistakes() {
    setView("mistakes");
  }

  function handleStartTraining(
    topics: string[],
    count: number,
    filters: TrainingFilters,
  ) {
    startSession({
      mode: "training",
      title: "Allenamento per argomento",
      description:
        "Feedback immediato, spiegazione dettagliata e studio guidato subito dopo la risposta.",
      questions: getQuestionsByTopic(questions, topics, count, filters),
      config: {
        showImmediateFeedback: true,
      },
    });
  }

  function handleStartMistakeReview() {
    const selectedQuestions = getSmartMistakeQuestions(questions, mistakes, 20);
    const selectedIds = selectedQuestions.map((question) => question.id);

    startSession({
      mode: "mistake-review",
      title: "Ripasso intelligente",
      description:
        "Le risposte sbagliate restano prioritarie, ma anche le domande saltate salgono se continui a lasciarle in bianco.",
      questions: selectedQuestions,
      config: {
        questionInsights: buildQuestionInsights(selectedIds),
        showImmediateFeedback: true,
      },
    });
  }

  function handleRetryWrongAnswers() {
    if (!latestSummary) {
      return;
    }

    const wrongIds = latestSummary.results
      .filter((result) => result.status === "wrong")
      .map((result) => result.question.id);

    if (wrongIds.length === 0) {
      return;
    }

    startSession({
      mode: "mistake-review",
      title: "Rifai solo le sbagliate",
      description:
        "Mini-sessione di recupero costruita direttamente sulle domande davvero sbagliate nell'ultima prova.",
      questions: getQuestionsByIds(questions, wrongIds),
      config: {
        questionInsights: buildQuestionInsights(wrongIds),
        showImmediateFeedback: true,
      },
    });
  }

  function handleComplete(summary: QuizSummary) {
    saveQuizResult(summary);
    saveMistakes(summary.results);
    refreshStorageState();
    setLatestSummary(summary);
    setView("result");
    setActiveSession(null);
  }

  function handleClearMistakes() {
    clearMistakes();
    refreshStorageState();
  }

  function handleClearQuizHistory() {
    if (!window.confirm("Vuoi davvero cancellare tutto lo storico quiz salvato in locale?")) {
      return;
    }

    clearQuizHistory();
    refreshStorageState();
  }

  function handleClearMistakesWithConfirm() {
    if (!window.confirm("Vuoi davvero cancellare tutti gli errori salvati in locale?")) {
      return;
    }

    handleClearMistakes();
  }

  function handleClearAllStudyData() {
    if (!window.confirm("Vuoi davvero cancellare storico quiz ed errori salvati?")) {
      return;
    }

    clearAllStudyData();
    refreshStorageState();
  }

  function handleRetryCurrentMode() {
    if (!latestSummary) {
      handleStartExam();
      return;
    }

    if (latestSummary.mode === "real-exam") {
      handleStartRealExam(
        latestSummary.timeLimitSeconds
          ? Math.max(1, Math.round(latestSummary.timeLimitSeconds / 60))
          : 30,
      );
      return;
    }

    if (latestSummary.mode === "hard-exam") {
      handleStartHardExam();
      return;
    }

    if (latestSummary.mode === "sprint-july-6") {
      handleStartSprintJulySix();
      return;
    }

    handleStartExam();
  }

  const averageScore =
    history.length === 0
      ? 0
      : Math.round(
          history.reduce((sum, entry) => sum + entry.percentage, 0) / history.length,
        );

  const mostMissedQuestions = mistakes
    .slice()
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, 3)
    .map((mistake) => ({
      label:
        mistake.question.length > 90
          ? `${mistake.question.slice(0, 87)}...`
          : mistake.question,
      meta: `${mistake.category} - ${mistake.topic}${
        mistake.reviewType === "skipped" ? " - saltata" : ""
      }${mistake.isCritical ? " - critica" : ""}`,
      count: mistake.reviewType === "wrong" ? mistake.timesWrong : mistake.timesSkipped,
    }));

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.12),transparent_20%),linear-gradient(180deg,#071019,#02060d)]">
      {view === "home" ? (
        <Home
          averageScore={averageScore}
          mostMissedQuestions={mostMissedQuestions}
          onOpenMistakes={handleOpenMistakes}
          onOpenTraining={handleOpenTraining}
          onClearAllData={handleClearAllStudyData}
          onClearMistakes={handleClearMistakesWithConfirm}
          onClearQuizHistory={handleClearQuizHistory}
          onStartExam={handleStartExam}
          onStartHardExam={handleStartHardExam}
          onStartRealExam={handleStartRealExam}
          onStartSprintJulySix={handleStartSprintJulySix}
          quizCount={history.length}
          totalMistakes={mistakes.length}
        />
      ) : null}

      {view === "training" ? (
        <TopicTraining
          onBack={openHome}
          onStart={handleStartTraining}
          questionBank={questions}
          topicGroups={topicGroups}
        />
      ) : null}

      {view === "mistakes" ? (
        <MistakeReview
          mistakes={mistakes}
          onBack={openHome}
          onClear={handleClearMistakes}
          onStart={handleStartMistakeReview}
        />
      ) : null}

      {view === "quiz" && activeSession ? (
        <Quiz onBack={openHome} onComplete={handleComplete} session={activeSession} />
      ) : null}

      {view === "result" && latestSummary ? (
        <ResultPage
          onBackHome={openHome}
          onRetryExam={handleRetryCurrentMode}
          onRetryWrongAnswers={handleRetryWrongAnswers}
          onReviewMistakes={handleOpenMistakes}
          summary={latestSummary}
        />
      ) : null}
    </div>
  );
}

export default App;
