import type { Place, PlaceType } from "@/app/types";
import { seedPlaces } from "@/app/lib/data";

const KEY = "visited_places_v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadPlaces(): Place[] {
  if (!isBrowser()) return seedPlaces();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return seedPlaces();
    const parsed = JSON.parse(raw) as Place[];
    // Minimal validation: if empty or missing expected structure, reseed.
    if (!Array.isArray(parsed) || parsed.length < 10) return seedPlaces();
    return parsed;
  } catch {
    return seedPlaces();
  }
}

export function savePlaces(places: Place[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(places));
}

export function toggleVisited(places: Place[], id: string): Place[] {
  const next = places.map((p) => {
    if (p.id !== id) return p;
    const visited = !p.visited;
    return { ...p, visited, visitedAt: visited ? new Date().toISOString() : null };
  });
  savePlaces(next);
  return next;
}

export function byType(places: Place[], type: PlaceType): Place[] {
  return places
    .filter((p) => p.type === type)
    .sort((a, b) => a.name.localeCompare(b.name));
}

