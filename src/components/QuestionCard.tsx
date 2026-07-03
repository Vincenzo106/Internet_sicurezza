import type { Question, SessionQuestionInsight, UserAnswerStatus } from "../types";

type QuestionCardProps = {
  answerStatus: UserAnswerStatus;
  canReset: boolean;
  current: number;
  total: number;
  question: Question;
  questionInsight?: SessionQuestionInsight;
  selectedAnswer?: string | null;
  locked: boolean;
  onMarkUnanswered: () => void;
  onResetQuestion?: () => void;
  onSelectAnswer: (answer: string) => void;
  onToggleExplanation?: () => void;
  showFeedback: boolean;
  showExplanation: boolean;
};

export function QuestionCard({
  answerStatus,
  canReset,
  current,
  total,
  question,
  questionInsight,
  selectedAnswer,
  locked,
  onMarkUnanswered,
  onResetQuestion,
  onSelectAnswer,
  onToggleExplanation,
  showFeedback,
  showExplanation,
}: QuestionCardProps) {
  const answered = typeof selectedAnswer === "string";
  const answeredCorrectly = selectedAnswer === question.correctAnswer;
  const hasDecision = answerStatus !== "pending";

  function renderAnswerState() {
    if (answerStatus === "answered" && answered) {
      return (
        <div className="mt-5 rounded-[1.35rem] border border-sky-300/20 bg-sky-400/10 p-4 text-sm leading-7 text-sky-50">
          Hai scelto: <span className="font-semibold">{selectedAnswer}</span>
          {locked ? " La domanda ora è bloccata finché non premi \"Riprova domanda\"." : ""}
        </div>
      );
    }

    if (answerStatus === "unanswered") {
      return (
        <div className="mt-5 rounded-[1.35rem] border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-50">
          Hai scelto di non rispondere: questa domanda varrà 0 punti.
          {locked
            ? " La domanda ora è bloccata finché non premi \"Riprova domanda\"."
            : " Puoi comunque cambiare idea prima della consegna."}
        </div>
      );
    }

    return (
      <div className="mt-5 rounded-[1.35rem] border border-white/10 bg-slate-900/60 p-4 text-sm leading-7 text-slate-300">
        Domanda ancora da completare.
      </div>
    );
  }

  return (
    <article className="question-surface animate-[card-enter_220ms_ease-out] rounded-[2rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur sm:p-7">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Domanda {current}/{total}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="badge badge-blue">{question.category}</span>
            <span className="badge badge-amber">{question.topic}</span>
            <span className="badge badge-slate">{question.difficulty}</span>
            <span className="badge border-emerald-300/25 bg-emerald-400/10 text-emerald-100">
              probabilità {question.examLikelihood}
            </span>
            <span className="badge border-fuchsia-300/25 bg-fuchsia-400/10 text-fuchsia-100">
              {question.sourceType}
            </span>
            {questionInsight?.isCritical ? (
              <span className="badge border-rose-300/30 bg-rose-400/12 text-rose-100">
                domanda critica
              </span>
            ) : null}
          </div>
        </div>
        <div className="min-w-[180px]">
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 transition-all duration-300"
              style={{ width: `${(current / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <h2 className="mt-6 text-2xl font-semibold leading-10 text-white">
        {question.question}
      </h2>

      {renderAnswerState()}

      <div className="mt-6 space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = question.correctAnswer === option;
          const baseClasses =
            "w-full rounded-[1.35rem] border px-5 py-4 text-left text-base leading-7 transition duration-200";

          let visualState =
            "border-white/10 bg-slate-900/70 text-slate-200 hover:border-sky-300/30 hover:bg-slate-900";

          if (showFeedback && isCorrectOption) {
            visualState =
              "border-emerald-300/35 bg-emerald-400/12 text-emerald-50 shadow-[0_0_0_1px_rgba(110,231,183,0.12)]";
          } else if (showFeedback && isSelected && !isCorrectOption) {
            visualState =
              "border-rose-300/35 bg-rose-400/12 text-rose-50 shadow-[0_0_0_1px_rgba(251,113,133,0.12)]";
          } else if (isSelected) {
            visualState =
              "border-sky-300/35 bg-sky-400/10 text-white shadow-[0_0_0_1px_rgba(125,211,252,0.12)]";
          }

          return (
            <button
              className={`${baseClasses} ${visualState}`}
              disabled={locked}
              key={option}
              onClick={() => onSelectAnswer(option)}
              type="button"
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className={
            answerStatus === "unanswered"
              ? "rounded-[1.35rem] border border-amber-300/35 bg-amber-300/15 px-5 py-4 text-sm font-semibold text-amber-50"
              : "rounded-[1.35rem] border border-white/10 bg-slate-900/70 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:border-amber-300/35 hover:bg-amber-300/10 hover:text-amber-50"
          }
          disabled={locked}
          onClick={onMarkUnanswered}
          type="button"
        >
          Non rispondere
        </button>

        {canReset && onResetQuestion ? (
          <button className="action-secondary" onClick={onResetQuestion} type="button">
            Riprova domanda
          </button>
        ) : null}
      </div>

      {showFeedback && hasDecision ? (
        <div
          className={
            answerStatus === "unanswered"
              ? "mt-6 rounded-[1.35rem] border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-7 text-amber-50"
              : answeredCorrectly
                ? "mt-6 rounded-[1.35rem] border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-50"
                : "mt-6 rounded-[1.35rem] border border-rose-300/20 bg-rose-400/10 p-4 text-sm leading-7 text-rose-50"
          }
        >
          {answerStatus === "unanswered"
            ? "Domanda lasciata in bianco: non perdi punti, ma il concetto resta da consolidare."
            : answeredCorrectly
              ? "Risposta corretta. La domanda è bloccata per evitare spoiler e cambi di risposta dopo il feedback."
              : "Risposta sbagliata. La domanda è bloccata per evitare spoiler e cambi di risposta dopo il feedback."}
        </div>
      ) : null}

      {onToggleExplanation ? (
        <button
          className="action-tertiary mt-6"
          disabled={!hasDecision}
          onClick={onToggleExplanation}
          type="button"
        >
          {showExplanation ? "Nascondi spiegazione" : "Mostra spiegazione"}
        </button>
      ) : null}

      {showExplanation ? (
        <div className="mt-6 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[1.35rem] border border-white/10 bg-slate-900/60 p-5">
            <p className="text-xs uppercase tracking-[0.26em] text-sky-200/75">
              Spiegazione stile notebook
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-200">{question.explanation}</p>

            {question.whyOthersAreWrong ? (
              <div className="mt-5">
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">
                  Perché le altre opzioni sono sbagliate
                </p>
                <div className="mt-3 space-y-3">
                  {Object.entries(question.whyOthersAreWrong).map(([option, reason]) => (
                    <div
                      className="rounded-2xl border border-white/8 bg-slate-950/45 p-4"
                      key={option}
                    >
                      <p className="font-semibold text-white">{option}</p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {question.source ? (
              <p className="mt-5 text-sm text-slate-400">
                Riferimento: <span className="text-slate-200">{question.source}</span>
              </p>
            ) : null}
          </section>

          {question.studyGuide ? (
            <section className="rounded-[1.35rem] border border-amber-300/15 bg-amber-300/6 p-5">
              <p className="text-xs uppercase tracking-[0.26em] text-amber-200/75">
                Studio guidato
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Concetto da ripassare
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white">
                    {question.studyGuide.conceptToReview}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Mini-riassunto
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white">
                    {question.studyGuide.miniSummary}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Trucchetto per ricordarlo
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white">
                    {question.studyGuide.memoryTrick}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    Possibile domanda simile all'esame
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white">
                    {question.studyGuide.similarExamQuestion}
                  </p>
                </div>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
