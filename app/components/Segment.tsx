"use client";

import type { PlaceType } from "@/app/types";

export function Segment({
  value,
  onChange
}: {
  value: PlaceType;
  onChange: (v: PlaceType) => void;
}) {
  const items: Array<{ label: string; value: PlaceType }> = [
    { label: "US States", value: "US_STATE" },
    { label: "Countries", value: "COUNTRY" }
  ];

  return (
    <div className="inline-flex rounded-full border border-[var(--line)] bg-white p-1">
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            className={[
              "rounded-full px-4 py-2 text-sm transition",
              active ? "bg-[var(--card)] text-black" : "text-[var(--muted)] hover:text-black"
            ].join(" ")}
            aria-pressed={active}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

