"use client";

import type { Place } from "@/app/types";

export function PlaceList({
  places,
  accent,
  onToggle
}: {
  places: Place[];
  accent: "us" | "world";
  onToggle: (id: string) => void;
}) {
  const accentVar = accent === "us" ? "var(--accent-us)" : "var(--accent-world)";

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
      <ul className="divide-y divide-[var(--line)]">
        {places.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => onToggle(p.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="min-w-0">
                <div className="truncate text-base">{p.name}</div>
                <div className="mt-0.5 text-xs text-[var(--muted)]">{p.regionCode}</div>
              </div>

              <div className="ml-4 flex items-center gap-3">
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border"
                  style={{
                    borderColor: p.visited ? accentVar : "var(--line)",
                    background: p.visited ? accentVar : "transparent"
                  }}
                  aria-label={p.visited ? "Visited" : "Not visited"}
                >
                  <span className={p.visited ? "text-black" : "text-[var(--muted)]"} style={{ fontSize: 12 }}>
                    {p.visited ? "✓" : "○"}
                  </span>
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

