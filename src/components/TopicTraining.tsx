import { useState } from "react";

import type {
  DifficultyFilter,
  ExamLikelihoodFilter,
  Question,
  SourceTypeFilter,
  TopicGroup,
  TrainingFilters,
} from "../types";

type TopicTrainingProps = {
  onBack: () => void;
  onStart: (topics: string[], count: number, filters: TrainingFilters) => void;
  questionBank: Question[];
  topicGroups: TopicGroup[];
};

const questionCountOptions = [5, 10, 20, 30];
const difficultyOptions: DifficultyFilter[] = ["tutte", "facile", "media", "difficile"];
const examLikelihoodOptions: ExamLikelihoodFilter[] = [
  "tutte",
  "alta",
  "media",
  "bassa",
];
const sourceTypeOptions: SourceTypeFilter[] = [
  "tutte",
  "storica",
  "simile",
  "generata",
];

export function TopicTraining({
  onBack,
  onStart,
  questionBank,
  topicGroups,
}: TopicTrainingProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("tutte");
  const [examLikelihoodFilter, setExamLikelihoodFilter] =
    useState<ExamLikelihoodFilter>("tutte");
  const [sourceTypeFilter, setSourceTypeFilter] = useState<SourceTypeFilter>("tutte");

  function toggleTopic(topic: string) {
    setSelectedTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  }

  function toggleGroup(topics: string[]) {
    const everyTopicSelected = topics.every((topic) => selectedTopics.includes(topic));

    setSelectedTopics((current) => {
      if (everyTopicSelected) {
        return current.filter((topic) => !topics.includes(topic));
      }

      return Array.from(new Set([...current, ...topics]));
    });
  }

  const availableQuestionCount =
    selectedTopics.length === 0
      ? 0
      : questionBank.filter(
          (question) =>
            selectedTopics.includes(question.topic) &&
            (difficultyFilter === "tutte" || question.difficulty === difficultyFilter) &&
            (examLikelihoodFilter === "tutte" ||
              question.examLikelihood === examLikelihoodFilter) &&
            (sourceTypeFilter === "tutte" ||
              question.sourceType === sourceTypeFilter),
        ).length;

  const selectedCount = Math.min(questionCount, availableQuestionCount);

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sky-200/75">
              Modalità allenamento
            </p>
            <h2 className="mt-3 font-['Bahnschrift','Segoe_UI_Variable_Display','Trebuchet_MS',sans-serif] text-3xl font-semibold text-white">
              Scegli gli argomenti da martellare
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Puoi combinare Internet e Sicurezza, limitare difficoltà, probabilità
              d&apos;esame e origine delle domande, così da allenarti prima sulle
              uscite storiche o sui concetti più probabili.
            </p>
          </div>

          <button className="action-tertiary" onClick={onBack} type="button">
            Torna alla home
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            {topicGroups.map((group) => {
              const isGroupSelected = group.topics.every((topic) =>
                selectedTopics.includes(topic),
              );

              return (
                <section
                  className="rounded-[1.5rem] border border-white/8 bg-slate-900/60 p-5"
                  key={group.title}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                        {group.category}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-white">{group.title}</h3>
                    </div>
                    <button
                      className="rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-300/40 hover:text-white"
                      onClick={() => toggleGroup(group.topics)}
                      type="button"
                    >
                      {isGroupSelected ? "Deseleziona gruppo" : "Seleziona gruppo"}
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {group.topics.map((topic) => {
                      const selected = selectedTopics.includes(topic);

                      return (
                        <button
                          className={
                            selected
                              ? "rounded-full border border-sky-300/30 bg-sky-400/15 px-4 py-2 text-sm font-medium text-sky-100 transition"
                              : "rounded-full border border-white/10 bg-slate-950/40 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-white/25 hover:text-white"
                          }
                          key={topic}
                          onClick={() => toggleTopic(topic)}
                          type="button"
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="rounded-[1.5rem] border border-amber-400/15 bg-amber-300/5 p-5">
            <h3 className="text-xl font-semibold text-white">Configurazione prova</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Se scegli più domande di quante ne esistono negli argomenti selezionati,
              il simulatore userà tutte quelle disponibili.
            </p>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Filtro difficoltà
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {difficultyOptions.map((value) => {
                  const selected = difficultyFilter === value;

                  return (
                    <button
                      className={
                        selected
                          ? "rounded-2xl border border-cyan-300/35 bg-cyan-300/15 px-4 py-3 text-sm font-semibold text-cyan-50"
                          : "rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
                      }
                      key={value}
                      onClick={() => setDifficultyFilter(value)}
                      type="button"
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Probabilità esame
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {examLikelihoodOptions.map((value) => {
                  const selected = examLikelihoodFilter === value;

                  return (
                    <button
                      className={
                        selected
                          ? "rounded-2xl border border-emerald-300/35 bg-emerald-300/15 px-4 py-3 text-sm font-semibold text-emerald-50"
                          : "rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
                      }
                      key={value}
                      onClick={() => setExamLikelihoodFilter(value)}
                      type="button"
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Origine domande
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {sourceTypeOptions.map((value) => {
                  const selected = sourceTypeFilter === value;

                  return (
                    <button
                      className={
                        selected
                          ? "rounded-2xl border border-fuchsia-300/35 bg-fuchsia-300/15 px-4 py-3 text-sm font-semibold text-fuchsia-50"
                          : "rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
                      }
                      key={value}
                      onClick={() => setSourceTypeFilter(value)}
                      type="button"
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                Quante domande vuoi fare?
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {questionCountOptions.map((value) => {
                  const selected = questionCount === value;

                  return (
                    <button
                      className={
                        selected
                          ? "rounded-2xl border border-amber-300/35 bg-amber-300/15 px-4 py-3 text-base font-semibold text-amber-100"
                          : "rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-base font-semibold text-slate-200 transition hover:border-white/20 hover:text-white"
                      }
                      key={value}
                      onClick={() => setQuestionCount(value)}
                      type="button"
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/8 bg-slate-950/40 p-4 text-sm leading-7 text-slate-300">
              <p>
                Argomenti selezionati:{" "}
                <span className="font-semibold text-white">{selectedTopics.length}</span>
              </p>
              <p>
                Difficoltà:{" "}
                <span className="font-semibold text-white">{difficultyFilter}</span>
              </p>
              <p>
                Probabilità esame:{" "}
                <span className="font-semibold text-white">{examLikelihoodFilter}</span>
              </p>
              <p>
                Origine:{" "}
                <span className="font-semibold text-white">{sourceTypeFilter}</span>
              </p>
              <p>
                Domande disponibili:{" "}
                <span className="font-semibold text-white">{availableQuestionCount}</span>
              </p>
              <p>
                Domande che partiranno davvero:{" "}
                <span className="font-semibold text-white">{selectedCount}</span>
              </p>
            </div>

            <button
              className="action-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
              disabled={selectedTopics.length === 0 || availableQuestionCount === 0}
              onClick={() =>
                onStart(selectedTopics, questionCount, {
                  difficulty: difficultyFilter,
                  examLikelihood: examLikelihoodFilter,
                  sourceType: sourceTypeFilter,
                })
              }
              type="button"
            >
              Avvia allenamento
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
