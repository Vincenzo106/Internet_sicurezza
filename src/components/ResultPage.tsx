import {
  formatDuration,
  formatScoreValue,
  getResultMessage,
} from "../utils/quiz";
import type { BreakdownItem, QuestionResult, QuizSummary } from "../types";

type ResultPageProps = {
  summary: QuizSummary;
  onBackHome: () => void;
  onRetryExam: () => void;
  onRetryWrongAnswers: () => void;
  onReviewMistakes: () => void;
};

function BreakdownList({
  items,
  emptyLabel,
}: {
  items: BreakdownItem[];
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/12 bg-slate-950/35 p-4 text-sm leading-7 text-slate-300">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          className="rounded-2xl border border-white/8 bg-slate-950/45 p-4"
          key={item.label}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-white">{item.label}</p>
            <p className="text-sm text-slate-300">Accuratezza {item.accuracy}%</p>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Corrette {item.correct} - Sbagliate {item.wrong} - Vuote {item.unanswered} -
            Totale {item.total}
          </p>
        </div>
      ))}
    </div>
  );
}

function ResultBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
      {label}
    </span>
  );
}

function renderMetaBadges(result: QuestionResult) {
  return (
    <div className="flex flex-wrap gap-2">
      <ResultBadge label={result.question.category} />
      <ResultBadge label={result.question.topic} />
      <ResultBadge label={result.question.difficulty} />
      <ResultBadge label={`probabilità ${result.question.examLikelihood}`} />
      <ResultBadge label={result.question.sourceType} />
    </div>
  );
}

export function ResultPage({
  summary,
  onBackHome,
  onRetryExam,
  onRetryWrongAnswers,
  onReviewMistakes,
}: ResultPageProps) {
  const wrongAnswers = summary.results.filter((result) => result.status === "wrong");
  const unansweredAnswers = summary.results.filter(
    (result) => result.status === "unanswered",
  );
  const correctAnswers = summary.results.filter((result) => result.status === "correct");
  const canRetryWrongAnswers = wrongAnswers.length > 0;

  function handleDownloadReport() {
    const report = {
      generatedAt: new Date().toISOString(),
      summary,
      stats: {
        immediateReviewTopics: summary.immediateReviewTopics,
        mostMissedTopics: summary.mostMissedTopics,
        topicBreakdown: summary.topicBreakdown,
        difficultyBreakdown: summary.difficultyBreakdown,
        categoryBreakdown: summary.categoryBreakdown,
        strategySuggestion: summary.strategySuggestion,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `report-${summary.mode}-${summary.completedAt.slice(0, 19)}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 backdrop-blur sm:p-8">
        <div className="grid gap-6 border-b border-white/10 pb-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(145deg,rgba(14,24,38,0.95),rgba(8,15,23,0.9))] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-200/75">
              Riepilogo finale
            </p>
            <h1 className="mt-3 font-['Bahnschrift','Segoe_UI_Variable_Display','Trebuchet_MS',sans-serif] text-4xl font-semibold text-white">
              Voto finale: {formatScoreValue(summary.finalScore)}/{summary.maxScore}
            </h1>
            <p className="mt-3 text-lg text-slate-200">{summary.percentage}% del punteggio massimo</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Punteggio grezzo: {formatScoreValue(summary.rawScore)} punti
            </p>
            <p className="mt-6 rounded-2xl border border-amber-300/15 bg-amber-300/8 p-4 text-base leading-7 text-amber-50">
              {summary.levelReached || getResultMessage(summary.finalScore)}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-slate-900/65 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Corrette</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-200">
                  {summary.correctCount}
                </p>
                <p className="mt-1 text-sm text-emerald-100">+1.5 ciascuna</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-900/65 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Sbagliate</p>
                <p className="mt-2 text-2xl font-semibold text-rose-200">
                  {summary.wrongCount}
                </p>
                <p className="mt-1 text-sm text-rose-100">-0.5 ciascuna</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-900/65 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Non risposte
                </p>
                <p className="mt-2 text-2xl font-semibold text-amber-100">
                  {summary.unansweredCount}
                </p>
                <p className="mt-1 text-sm text-amber-100">0 punti</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-900/65 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Tempo impiegato
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {formatDuration(summary.timeSpentSeconds)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-900/65 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Livello raggiunto
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {summary.levelReached}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-900/65 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  Strategia
                </p>
                <p className="mt-2 text-base font-semibold text-white">Prossima prova</p>
              </div>
            </div>

            {summary.autoSubmitted ? (
              <div className="mt-5 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm leading-7 text-rose-50">
                Timer scaduto: la consegna è partita automaticamente.
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="action-primary" onClick={onRetryExam} type="button">
                Nuova simulazione
              </button>
              <button
                className="action-secondary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!canRetryWrongAnswers}
                onClick={onRetryWrongAnswers}
                type="button"
              >
                Rifai solo le sbagliate
              </button>
              <button className="action-secondary" onClick={onReviewMistakes} type="button">
                Ripassa errori
              </button>
              <button className="action-secondary" onClick={handleDownloadReport} type="button">
                Scarica report JSON
              </button>
              <button className="action-tertiary" onClick={onBackHome} type="button">
                Torna alla home
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            <section className="rounded-[1.75rem] border border-cyan-300/12 bg-cyan-300/6 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/75">
                Strategia per la prossima simulazione
              </p>
              <p className="mt-4 text-sm leading-7 text-cyan-50">
                {summary.strategySuggestion}
              </p>
            </section>

            <section className="rounded-[1.75rem] border border-rose-300/12 bg-rose-400/6 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-rose-200/75">
                {summary.mode === "sprint-july-6"
                  ? "Devi ripassare questi 3 argomenti subito"
                  : "Argomenti da ripassare subito"}
              </p>
              {summary.immediateReviewTopics.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {summary.immediateReviewTopics.map((topic) => (
                    <span
                      className="rounded-full border border-rose-300/25 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-50"
                      key={topic}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Nessun argomento urgente: questa volta non hai lasciato punti su topic ripetuti.
                </p>
              )}
            </section>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-2">
          <section>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-200/75">
              Riepilogo per argomento
            </p>
            <div className="mt-5">
              <BreakdownList
                emptyLabel="Nessun riepilogo per argomento disponibile."
                items={summary.topicBreakdown}
              />
            </div>
          </section>

          <section>
            <p className="text-sm uppercase tracking-[0.28em] text-amber-200/75">
              Riepilogo per difficoltà
            </p>
            <div className="mt-5">
              <BreakdownList
                emptyLabel="Nessun riepilogo per difficoltà disponibile."
                items={summary.difficultyBreakdown}
              />
            </div>
          </section>
        </div>

        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.28em] text-rose-200/75">
            Dove hai perso punti
          </p>

          <div className="mt-5 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-rose-100">Risposte sbagliate</h2>
              {wrongAnswers.length > 0 ? (
                <div className="mt-4 space-y-5">
                  {wrongAnswers.map((result) => (
                    <article
                      className="rounded-[1.5rem] border border-rose-300/15 bg-rose-400/5 p-5"
                      key={result.question.id}
                    >
                      {renderMetaBadges(result)}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full border border-rose-300/30 bg-rose-400/12 px-3 py-1 font-semibold text-rose-100">
                          Penalità -0.5
                        </span>
                        {result.question.source ? (
                          <span className="text-slate-400">Fonte: {result.question.source}</span>
                        ) : null}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold leading-9 text-white">
                        {result.question.question}
                      </h3>
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4 text-sm leading-7 text-slate-200">
                          <p>
                            Risposta scelta:{" "}
                            <span className="font-semibold text-rose-200">
                              {result.selectedAnswer}
                            </span>
                          </p>
                          <p className="mt-2">
                            Risposta corretta:{" "}
                            <span className="font-semibold text-emerald-200">
                              {result.question.correctAnswer}
                            </span>
                          </p>
                        </div>
                        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/8 p-4 text-sm leading-7 text-amber-50">
                          <p>
                            <span className="font-semibold">Concetto da ripassare:</span>{" "}
                            {result.personalizedExplanation?.conceptToReview}
                          </p>
                          <p className="mt-2">
                            <span className="font-semibold">Trucchetto da esame:</span>{" "}
                            {result.personalizedExplanation?.examTrick}
                          </p>
                          <p className="mt-2">
                            <span className="font-semibold">Possibile domanda simile:</span>{" "}
                            {result.personalizedExplanation?.similarExamQuestion}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 lg:grid-cols-3">
                        <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-sky-200/75">
                            Spiegazione generale
                          </p>
                          <p className="mt-3 text-sm leading-7 text-slate-200">
                            {result.personalizedExplanation?.generalExplanation}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-rose-300/15 bg-rose-400/8 p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-rose-200/75">
                            Perché la tua risposta è sbagliata
                          </p>
                          <p className="mt-3 text-sm leading-7 text-rose-50">
                            {result.personalizedExplanation?.whyYourAnswerIsWrong}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/8 p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/75">
                            Perché la corretta è giusta
                          </p>
                          <p className="mt-3 text-sm leading-7 text-emerald-50">
                            {result.personalizedExplanation?.whyCorrectAnswerIsRight}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/8 p-6 text-sm leading-7 text-emerald-50">
                  Nessuna risposta sbagliata: qui non hai perso punti.
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold text-amber-100">Non risposte</h2>
              {unansweredAnswers.length > 0 ? (
                <div className="mt-4 space-y-5">
                  {unansweredAnswers.map((result) => (
                    <article
                      className="rounded-[1.5rem] border border-amber-300/15 bg-amber-300/6 p-5"
                      key={result.question.id}
                    >
                      {renderMetaBadges(result)}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full border border-amber-300/30 bg-amber-300/12 px-3 py-1 font-semibold text-amber-100">
                          0 punti
                        </span>
                        {result.question.source ? (
                          <span className="text-slate-400">Fonte: {result.question.source}</span>
                        ) : null}
                      </div>
                      <h3 className="mt-4 text-xl font-semibold leading-9 text-white">
                        {result.question.question}
                      </h3>
                      <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/45 p-4 text-sm leading-7 text-slate-200">
                        <p>
                          Risposta corretta:{" "}
                          <span className="font-semibold text-emerald-200">
                            {result.question.correctAnswer}
                          </span>
                        </p>
                        <p className="mt-2 text-amber-100">
                          Non hai perso punti, ma questo concetto va comunque ripassato.
                        </p>
                      </div>
                      <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-sky-200/75">
                            Spiegazione generale
                          </p>
                          <p className="mt-3 text-sm leading-7 text-slate-200">
                            {result.personalizedExplanation?.generalExplanation}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-amber-300/15 bg-amber-300/8 p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-amber-200/75">
                            Ripasso rapido
                          </p>
                          <p className="mt-3 text-sm leading-7 text-amber-50">
                            {result.personalizedExplanation?.whyYourAnswerIsWrong}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-amber-50">
                            <span className="font-semibold">Concetto da ripassare:</span>{" "}
                            {result.personalizedExplanation?.conceptToReview}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-amber-50">
                            <span className="font-semibold">Trucchetto da esame:</span>{" "}
                            {result.personalizedExplanation?.examTrick}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/8 p-6 text-sm leading-7 text-emerald-50">
                  Nessuna domanda lasciata in bianco in questa sessione.
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold text-emerald-100">Risposte corrette</h2>
              {correctAnswers.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {correctAnswers.map((result) => (
                    <article
                      className="rounded-[1.5rem] border border-emerald-300/15 bg-emerald-400/8 p-5"
                      key={result.question.id}
                    >
                      {renderMetaBadges(result)}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full border border-emerald-300/30 bg-emerald-400/12 px-3 py-1 font-semibold text-emerald-100">
                          +1.5 punti
                        </span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold leading-9 text-white">
                        {result.question.question}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-emerald-50">
                        Risposta giusta: {result.question.correctAnswer}
                      </p>
                      <details className="mt-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                        <summary className="cursor-pointer text-sm font-semibold text-white">
                          Apri spiegazione
                        </summary>
                        <p className="mt-3 text-sm leading-7 text-slate-200">
                          {result.question.explanation}
                        </p>
                      </details>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/12 bg-slate-950/35 p-6 text-sm leading-7 text-slate-300">
                  Nessuna risposta corretta in questa sessione.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
