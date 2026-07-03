import type { MistakeRecord } from "../types";

type MistakeReviewProps = {
  mistakes: MistakeRecord[];
  onBack: () => void;
  onClear: () => void;
  onStart: () => void;
};

function MistakeSection({
  items,
  title,
  emptyLabel,
}: {
  items: MistakeRecord[];
  title: string;
  emptyLabel: string;
}) {
  return (
    <section>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      {items.length === 0 ? (
        <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/12 bg-slate-950/35 p-6 text-sm leading-7 text-slate-300">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {items.map((mistake) => (
            <article
              className="rounded-[1.5rem] border border-white/8 bg-slate-900/60 p-5"
              key={mistake.questionId}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
                  {mistake.category}
                </span>
                <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">
                  {mistake.topic}
                </span>
                <span className="rounded-full border border-white/12 bg-slate-950/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
                  {mistake.reviewType === "wrong" ? "errore vero" : "saltata"}
                </span>
                {mistake.isCritical ? (
                  <span className="rounded-full border border-rose-300/25 bg-rose-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-rose-100">
                    domanda critica
                  </span>
                ) : null}
              </div>

              <h4 className="mt-4 text-lg font-semibold leading-8 text-white">
                {mistake.question}
              </h4>

              <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/45 p-4 text-sm leading-7 text-slate-300">
                <p>
                  Errori veri:{" "}
                  <span className="font-semibold text-white">{mistake.timesWrong}</span>
                </p>
                <p>
                  Domande saltate:{" "}
                  <span className="font-semibold text-white">{mistake.timesSkipped}</span>
                </p>
                <p>
                  Priorità ripasso:{" "}
                  <span className="font-semibold text-white">{mistake.priorityScore}</span>
                </p>
                <p>
                  Ultimo evento:{" "}
                  <span className="font-semibold text-white">
                    {new Intl.DateTimeFormat("it-IT", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(
                      new Date(
                        mistake.reviewType === "wrong"
                          ? mistake.lastWrongAt
                          : (mistake.lastSkippedAt ?? mistake.lastWrongAt),
                      ),
                    )}
                  </span>
                </p>
                <p>
                  Risposta corretta:{" "}
                  <span className="font-semibold text-emerald-200">
                    {mistake.correctAnswer}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function MistakeReview({
  mistakes,
  onBack,
  onClear,
  onStart,
}: MistakeReviewProps) {
  const wrongMistakes = mistakes.filter((mistake) => mistake.reviewType === "wrong");
  const skippedMistakes = mistakes.filter((mistake) => mistake.reviewType === "skipped");

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-rose-200/75">
              Ripasso intelligente
            </p>
            <h2 className="mt-3 font-['Bahnschrift','Segoe_UI_Variable_Display','Trebuchet_MS',sans-serif] text-3xl font-semibold text-white">
              Errori veri e domande saltate da rimettere in riga
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Le risposte sbagliate hanno priorità più alta. Le domande saltate non
              ti tolgono punti, ma se continui a lasciarle in bianco diventano
              comunque critiche nel ripasso.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="action-tertiary" onClick={onBack} type="button">
              Torna alla home
            </button>
            <button
              className="rounded-full border border-rose-300/25 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:border-rose-200/40 hover:bg-rose-400/15 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={mistakes.length === 0}
              onClick={onClear}
              type="button"
            >
              Svuota archivio ripasso
            </button>
          </div>
        </div>

        {mistakes.length === 0 ? (
          <div className="mt-8 rounded-[1.5rem] border border-dashed border-white/12 bg-slate-950/35 p-8 text-center text-sm leading-7 text-slate-300">
            Non hai ancora materiale salvato per il ripasso. Dopo una simulazione qui
            compariranno sia gli errori veri sia le domande lasciate in bianco.
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-8">
              <MistakeSection
                emptyLabel="Nessun errore vero salvato al momento."
                items={wrongMistakes}
                title="Errori veri"
              />
              <MistakeSection
                emptyLabel="Nessuna domanda saltata salvata al momento."
                items={skippedMistakes}
                title="Domande saltate"
              />
            </div>

            <button className="action-primary mt-8" onClick={onStart} type="button">
              Rifai queste domande in ordine di priorità
            </button>
          </>
        )}
      </div>
    </section>
  );
}
