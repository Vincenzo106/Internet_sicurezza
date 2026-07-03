import { useEffect, useEffectEvent, useRef, useState } from "react";

import { buildQuizSummary, formatDuration } from "../utils/quiz";
import type { ActiveSession, QuizSummary, UserAnswerStatus } from "../types";
import { QuestionCard } from "./QuestionCard";

type QuizProps = {
  session: ActiveSession;
  onBack: () => void;
  onComplete: (summary: QuizSummary) => void;
};

export function Quiz({ session, onBack, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null | undefined>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<
    Record<string, boolean>
  >({});
  const [startedAt] = useState(() => Date.now());
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    session.config?.timeLimitSeconds ?? null,
  );
  const submittedRef = useRef(false);

  const currentQuestion = session.questions[currentIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isAssessmentMode =
    session.mode === "exam" ||
    session.mode === "real-exam" ||
    session.mode === "hard-exam" ||
    session.mode === "sprint-july-6";
  const showImmediateFeedback =
    session.config?.showImmediateFeedback ?? !isAssessmentMode;
  const allowSkip = session.config?.allowSkip ?? false;
  const requireAllAnswers = session.config?.requireAllAnswers ?? false;
  const timeLimitSeconds = session.config?.timeLimitSeconds ?? null;
  const hasTimer = timeLimitSeconds !== null;
  const isLastQuestion = currentIndex === session.questions.length - 1;

  function getAnswerStatus(questionId: string): UserAnswerStatus {
    const currentAnswer = answers[questionId];

    if (typeof currentAnswer === "string") {
      return "answered";
    }

    if (currentAnswer === null) {
      return "unanswered";
    }

    return "pending";
  }

  const currentAnswerStatus = currentQuestion
    ? getAnswerStatus(currentQuestion.id)
    : "pending";
  const currentQuestionLocked = showImmediateFeedback && currentAnswerStatus !== "pending";
  const answeredCount = session.questions.filter(
    (question) => getAnswerStatus(question.id) === "answered",
  ).length;
  const skippedCount = session.questions.filter(
    (question) => getAnswerStatus(question.id) === "unanswered",
  ).length;
  const pendingCount = Math.max(
    0,
    session.questions.length - answeredCount - skippedCount,
  );
  const completedCount = answeredCount + skippedCount;
  const hasDecision = currentAnswerStatus !== "pending";

  const finishSession = useEffectEvent((autoSubmitted = false) => {
    if (submittedRef.current) {
      return;
    }

    submittedRef.current = true;

    onComplete(
      buildQuizSummary(session, answers, startedAt, Date.now(), autoSubmitted),
    );
  });

  useEffect(() => {
    if (!hasTimer || timeLimitSeconds === null) {
      return;
    }

    const activeTimeLimitSeconds = timeLimitSeconds;

    function updateRemainingTime() {
      const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
      const nextRemainingSeconds = Math.max(
        0,
        activeTimeLimitSeconds - elapsedSeconds,
      );

      setRemainingSeconds(nextRemainingSeconds);

      if (nextRemainingSeconds <= 0) {
        finishSession(true);
      }
    }

    updateRemainingTime();

    const timerId = window.setInterval(updateRemainingTime, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [hasTimer, startedAt, timeLimitSeconds]);

  if (!currentQuestion) {
    return (
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-8 text-center backdrop-blur">
          <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
            Sessione vuota
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Nessuna domanda disponibile
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Questa modalità non ha domande sufficienti al momento.
          </p>
          <button className="action-primary mt-6" onClick={onBack} type="button">
            Torna indietro
          </button>
        </div>
      </section>
    );
  }

  function handleSelectAnswer(answer: string) {
    if (currentQuestionLocked) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: answer,
    }));
  }

  function handleMarkUnanswered() {
    if (currentQuestionLocked) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: null,
    }));
  }

  function handleResetQuestion() {
    setAnswers((current) => {
      const nextAnswers = { ...current };
      delete nextAnswers[currentQuestion.id];
      return nextAnswers;
    });

    setRevealedExplanations((current) => ({
      ...current,
      [currentQuestion.id]: false,
    }));
  }

  function handleToggleExplanation() {
    setRevealedExplanations((current) => ({
      ...current,
      [currentQuestion.id]: !current[currentQuestion.id],
    }));
  }

  function moveQuestion(direction: "prev" | "next") {
    setCurrentIndex((current) => {
      if (direction === "prev") {
        return Math.max(0, current - 1);
      }

      return Math.min(session.questions.length - 1, current + 1);
    });
  }

  function jumpToQuestion(nextIndex: number) {
    setCurrentIndex(nextIndex);
  }

  function handleSubmit(autoSubmitted = false) {
    if (requireAllAnswers && completedCount !== session.questions.length) {
      return;
    }

    finishSession(autoSubmitted);
  }

  const canMoveForward = allowSkip || hasDecision;
  const canSubmit = !requireAllAnswers || completedCount === session.questions.length;
  const assessmentLabel =
    session.mode === "real-exam"
      ? "Esame reale"
      : session.mode === "sprint-july-6"
        ? "Sprint 6 luglio"
      : session.mode === "hard-exam"
        ? "Domande cattive"
      : session.mode === "exam"
        ? "Simulazione esame"
      : session.mode === "mistake-review"
        ? "Ripasso intelligente"
      : "Allenamento per argomento";

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur sm:p-7">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-200/75">
              {assessmentLabel}
            </p>
            <h1 className="mt-3 font-['Bahnschrift','Segoe_UI_Variable_Display','Trebuchet_MS',sans-serif] text-3xl font-semibold text-white">
              {session.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              {session.description}
            </p>
          </div>

          <button className="action-tertiary" onClick={onBack} type="button">
            Esci da questa sessione
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-5">
          <div className="rounded-[1.5rem] border border-white/8 bg-slate-900/60 p-4 text-sm leading-7 text-slate-300">
            <p>
              Avanzamento:{" "}
              <span className="font-semibold text-white">
                {currentIndex + 1}/{session.questions.length}
              </span>
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/6 p-4 text-sm leading-7 text-emerald-50">
            <p>
              Risposte date:{" "}
              <span className="font-semibold text-white">{answeredCount}</span>
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-amber-300/15 bg-amber-300/6 p-4 text-sm leading-7 text-amber-50">
            <p>
              Non risposte:{" "}
              <span className="font-semibold text-white">{skippedCount}</span>
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/8 bg-slate-900/60 p-4 text-sm leading-7 text-slate-300">
            <p>
              Da completare:{" "}
              <span className="font-semibold text-white">{pendingCount}</span>
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/6 p-4 text-sm leading-7 text-cyan-50">
            <p className="font-semibold">
              {hasTimer
                ? `Tempo rimanente: ${formatDuration(remainingSeconds ?? 0)}`
                : `Tempo stimato in corso: ${formatDuration(
                    Math.floor((Date.now() - startedAt) / 1000),
                  )}`}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.22em] text-slate-400">
          <span>Verde = risposta data</span>
          <span>Ambra = non risposta</span>
          <span>Neutro = ancora da completare</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {session.questions.map((question, index) => {
            const isCurrent = index === currentIndex;
            const answerStatus = getAnswerStatus(question.id);

            const visualState =
              answerStatus === "answered"
                ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-100"
                : answerStatus === "unanswered"
                  ? "border-amber-300/25 bg-amber-300/10 text-amber-100"
                  : "border-white/10 bg-slate-950/45 text-slate-300 transition hover:border-white/25 hover:text-white";

            return (
              <button
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                  isCurrent
                    ? `ring-2 ring-sky-300/35 ${visualState}`
                    : visualState
                }`}
                key={question.id}
                onClick={() => jumpToQuestion(index)}
                type="button"
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <QuestionCard
            answerStatus={currentAnswerStatus}
            canReset={showImmediateFeedback && hasDecision}
            current={currentIndex + 1}
            locked={currentQuestionLocked}
            onMarkUnanswered={handleMarkUnanswered}
            onResetQuestion={handleResetQuestion}
            onSelectAnswer={handleSelectAnswer}
            onToggleExplanation={showImmediateFeedback ? handleToggleExplanation : undefined}
            question={currentQuestion}
            questionInsight={session.config?.questionInsights?.[currentQuestion.id]}
            selectedAnswer={selectedAnswer}
            showExplanation={Boolean(revealedExplanations[currentQuestion.id])}
            showFeedback={showImmediateFeedback && hasDecision}
            total={session.questions.length}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <button
            className="action-tertiary disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentIndex === 0}
            onClick={() => moveQuestion("prev")}
            type="button"
          >
            Domanda precedente
          </button>

          <div className="flex flex-wrap gap-3">
            {!isLastQuestion ? (
              <button
                className="action-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canMoveForward}
                onClick={() => moveQuestion("next")}
                type="button"
              >
                Prossima domanda
              </button>
            ) : (
              <button
                className="action-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={showImmediateFeedback ? !hasDecision : !canSubmit}
                onClick={() => handleSubmit(false)}
                type="button"
              >
                {showImmediateFeedback ? "Chiudi allenamento" : "Consegna"}
              </button>
            )}

            {!showImmediateFeedback ? (
              <button
                className="action-secondary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canSubmit}
                onClick={() => handleSubmit(false)}
                type="button"
              >
                Consegna ora
              </button>
            ) : null}
          </div>
        </div>

        {!showImmediateFeedback && requireAllAnswers && !canSubmit ? (
          <p className="mt-4 text-sm text-slate-400">
            In questa modalità devi almeno decidere se rispondere o lasciare in bianco
            ogni domanda prima della consegna.
          </p>
        ) : null}

        {!showImmediateFeedback ? (
          <p className="mt-4 text-sm text-slate-400">
            Le simulazioni esame, Esame reale, Sprint 6 luglio e Domande cattive non
            mostrano spiegazioni prima della consegna. Se una domanda resta in bianco
            vale 0 punti; se sbagli perdi 0.5.
          </p>
        ) : null}
      </div>
    </section>
  );
}
