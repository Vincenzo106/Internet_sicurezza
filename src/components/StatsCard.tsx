type StatsCardProps = {
  label: string;
  value: string;
  hint: string;
};

export function StatsCard({ label, value, hint }: StatsCardProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 shadow-[0_20px_80px_rgba(2,8,23,0.35)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.28em] text-sky-200/70">{label}</p>
      <p className="mt-4 font-['Bahnschrift','Segoe_UI_Variable_Display','Trebuchet_MS',sans-serif] text-3xl font-semibold text-white">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{hint}</p>
    </article>
  );
}
