import { useState } from "react";

import { StatsCard } from "./StatsCard";

type HomeProps = {
  quizCount: number;
  averageScore: number;
  totalMistakes: number;
  mostMissedQuestions: Array<{ label: string; meta: string; count: number }>;
  onClearAllData: () => void;
  onClearMistakes: () => void;
  onClearQuizHistory: () => void;
  onStartExam: () => void;
  onStartHardExam: () => void;
  onStartRealExam: (minutes: number) => void;
  onStartSprintJulySix: () => void;
  onOpenTraining: () => void;
  onOpenMistakes: () => void;
};

const realExamMinuteOptions = [20, 30, 45, 60];

export function Home({
  quizCount,
  averageScore,
  totalMistakes,
  mostMissedQuestions,
  onClearAllData,
  onClearMistakes,
  onClearQuizHistory,
  onStartExam,
  onStartHardExam,
  onStartRealExam,
  onStartSprintJulySix,
  onOpenTraining,
  onOpenMistakes,
}: HomeProps) {
  const [realExamMinutes, setRealExamMinutes] = useState(30);

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(14,24,38,0.92),rgba(8,15,23,0.88))] p-6 shadow-[0_30px_120px_rgba(2,8,23,0.45)] backdrop-blur sm:p-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
              Esame scritto - 20 domande - modalità locale
            </p>
            <h1 className="mt-6 max-w-3xl font-['Bahnschrift','Segoe_UI_Variable_Display','Trebuchet_MS',sans-serif] text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Simulatore Internet e Sicurezza
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Simulazioni, allenamento mirato, domande cattive e ripasso intelligente
              restano tutti attivi. Adesso hai anche regole di punteggio più chiare e
              strumenti per ripulire i dati locali quando vuoi ripartire da zero.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <button className="action-primary" onClick={onStartExam} type="button">
                Simulazione classica
              </button>
              <button
                className="action-primary"
                onClick={() => onStartRealExam(realExamMinutes)}
                type="button"
              >
                Esame reale
              </button>
              <button
                className="action-primary"
                onClick={onStartSprintJulySix}
                type="button"
              >
                Sprint 6 luglio
              </button>
              <button className="action-secondary" onClick={onStartHardExam} type="button">
                Domande cattive
              </button>
              <button className="action-secondary" onClick={onOpenTraining} type="button">
                Allenamento per argomento
              </button>
              <button className="action-secondary" onClick={onOpenMistakes} type="button">
                Ripasso intelligente
              </button>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-cyan-300/12 bg-slate-950/45 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">
                    Configurazione esame reale
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    Timer configurabile, consegna automatica allo scadere e report
                    finale con tempo usato, domande vuote e argomenti più sbagliati.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {realExamMinuteOptions.map((minutes) => {
                    const selected = realExamMinutes === minutes;

                    return (
                      <button
                        className={
                          selected
                            ? "rounded-full border border-cyan-300/35 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-50"
                            : "rounded-full border border-white/10 bg-slate-900/65 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/25 hover:text-white"
                        }
                        key={minutes}
                        onClick={() => setRealExamMinutes(minutes)}
                        type="button"
                      >
                        {minutes} min
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-emerald-300/12 bg-emerald-400/6 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-200/70">
                Regole punteggio
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4 text-sm text-slate-200">
                  <p className="font-semibold text-emerald-100">Corretta</p>
                  <p className="mt-2">+1.5</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4 text-sm text-slate-200">
                  <p className="font-semibold text-rose-100">Sbagliata</p>
                  <p className="mt-2">-0.5</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4 text-sm text-slate-200">
                  <p className="font-semibold text-amber-100">Non risposta</p>
                  <p className="mt-2">0</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-slate-950/45 p-4 text-sm text-slate-200">
                  <p className="font-semibold text-white">Massimo</p>
                  <p className="mt-2">30/30</p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatsCard
                hint="Tutte le sessioni completate in locale vengono salvate nello storico."
                label="Quiz fatti"
                value={String(quizCount)}
              />
              <StatsCard
                hint="Media percentuale sul punteggio massimo delle prove registrate."
                label="Media punteggio"
                value={`${averageScore}%`}
              />
              <StatsCard
                hint="Numero totale di errori o domande saltate ancora presenti nel ripasso."
                label="Errori salvati"
                value={String(totalMistakes)}
              />
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300">
                Gestione dati locali
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Utile se vuoi ripartire con uno storico pulito o eliminare dati più
                vecchi e incompleti salvati nel localStorage.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="action-secondary" onClick={onClearQuizHistory} type="button">
                  Cancella storico quiz
                </button>
                <button className="action-secondary" onClick={onClearMistakes} type="button">
                  Cancella errori salvati
                </button>
                <button className="action-tertiary" onClick={onClearAllData} type="button">
                  Cancella tutto
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-amber-400/15 bg-amber-300/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-amber-200/80">
              Errori più frequenti
            </p>
            <div className="mt-6 space-y-4">
              {mostMissedQuestions.length > 0 ? (
                mostMissedQuestions.map((item, index) => (
                  <div
                    className="rounded-2xl border border-white/8 bg-slate-950/45 p-4"
                    key={`${item.label}-${index}`}
                  >
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                      Top {index + 1}
                    </p>
                    <p className="mt-2 text-base font-semibold leading-7 text-white">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">{item.meta}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Ricomparsa {item.count} {item.count === 1 ? "volta" : "volte"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/12 bg-slate-950/35 p-6 text-sm leading-7 text-slate-300">
                  Qui compariranno le domande che ti fanno più inciampare. Per ora
                  l&apos;archivio è vuoto: ottimo segnale oppure devi ancora iniziare.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
