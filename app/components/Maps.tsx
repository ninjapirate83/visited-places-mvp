"use client";

import type { PlaceType } from "@/app/types";

export function MapModal({
  open,
  onClose,
  type,
  visitedCount,
  totalCount
}: {
  open: boolean;
  onClose: () => void;
  type: PlaceType;
  visitedCount: number;
  totalCount: number;
}) {
  if (!open) return null;

  const accent = type === "US_STATE" ? "var(--accent-us)" : "var(--accent-world)";
  const title = type === "US_STATE" ? "US Map (placeholder)" : "World Map (placeholder)";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-2xl border border-[var(--line)] bg-white shadow-lg">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <div className="text-base font-medium">{title}</div>
            <div className="text-sm text-[var(--muted)]">
              {visitedCount} / {totalCount} visited
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm text-[var(--muted)] hover:text-black"
          >
            Close
          </button>
        </div>

        <div className="px-5 pb-5">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-4">
            <PlaceholderSVG accent={accent} label={type === "US_STATE" ? "USA" : "WORLD"} />
          </div>

          <div className="mt-3 text-xs text-[var(--muted)]">
            Placeholder only in v1. Next iteration can add real region highlighting via SVG paths.
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderSVG({ accent, label }: { accent: string; label: string }) {
  return (
    <svg viewBox="0 0 800 320" className="h-56 w-full" aria-label={`${label} placeholder map`}>
      <rect x="0" y="0" width="800" height="320" rx="28" fill="white" />
      <rect x="24" y="24" width="752" height="272" rx="22" fill="transparent" stroke="rgba(0,0,0,0.08)" />

      <circle cx="170" cy="160" r="70" fill={accent} opacity="0.55" />
      <circle cx="330" cy="130" r="45" fill={accent} opacity="0.35" />
      <circle cx="470" cy="190" r="60" fill={accent} opacity="0.45" />
      <circle cx="620" cy="140" r="40" fill={accent} opacity="0.30" />

      <text x="400" y="172" textAnchor="middle" fontSize="28" fill="rgba(0,0,0,0.65)" fontFamily="ui-sans-serif, system-ui">
        {label}
      </text>
      <text x="400" y="204" textAnchor="middle" fontSize="14" fill="rgba(0,0,0,0.45)" fontFamily="ui-sans-serif, system-ui">
        Map view placeholder
      </text>
    </svg>
  );
}

