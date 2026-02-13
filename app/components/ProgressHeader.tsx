"use client";

export function ProgressHeader({
  title,
  visited,
  total,
  accent,
  onOpenMap
}: {
  title: string;
  visited: number;
  total: number;
  accent: "us" | "world";
  onOpenMap: () => void;
}) {
  const pct = total === 0 ? 0 : Math.round((visited / total) * 100);
  const accentVar = accent === "us" ? "var(--accent-us)" : "var(--accent-world)";

  return (
    <button
      onClick={onOpenMap}
      className="w-full rounded-2xl border border-[var(--line)] bg-white p-5 text-left shadow-sm"
    >
      <div className="flex items-baseline justify-between">
        <div className="text-base font-medium">{title}</div>
        <div className="text-sm text-[var(--muted)]">
          {visited} / {total}
        </div>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-[var(--card)]">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, background: accentVar }}
        />
      </div>

      <div className="mt-2 text-sm text-[var(--muted)]">{pct}% visited • Tap to view map</div>
    </button>
  );
}

