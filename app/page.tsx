
"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlaceType } from "@/app/types";
import { Segment } from "@/app/components/Segment";
import { ProgressHeader } from "@/app/components/ProgressHeader";
import { PlaceList } from "@/app/components/PlaceList";
import { MapModal } from "@/app/components/Maps";
import { byType, loadPlaces, toggleVisited } from "@/app/lib/storage";

export default function Page() {
  const [type, setType] = useState<PlaceType>("US_STATE");
  const [places, setPlaces] = useState(() => loadPlaces());
  const [mapOpen, setMapOpen] = useState(false);

  // Ensure client-side load (in case SSR fallback ever changes)
  useEffect(() => {
    setPlaces(loadPlaces());
  }, []);

  const current = useMemo(() => byType(places, type), [places, type]);
  const visitedCount = useMemo(() => current.filter((p) => p.visited).length, [current]);
  const totalCount = current.length;

  const accent = type === "US_STATE" ? "us" : "world";
  const title = type === "US_STATE" ? "US States" : "Countries";

  return (
    <main>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Visited Places</h1>
      </div>

      <div className="mt-6">
        <Segment value={type} onChange={setType} />
      </div>

      <div className="mt-6">
        <ProgressHeader
          title={title}
          visited={visitedCount}
          total={totalCount}
          accent={accent}
          onOpenMap={() => setMapOpen(true)}
        />
      </div>

      <PlaceList
        places={current}
        accent={accent}
        onToggle={(id) => setPlaces((prev) => toggleVisited(prev, id))}
      />

      <div className="mt-6 text-xs text-[var(--muted)]">
        Local-only MVP. Data is stored in this browser via localStorage.
      </div>

      <MapModal
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        type={type}
        visitedCount={visitedCount}
        totalCount={totalCount}
      />
    </main>
  );
}
