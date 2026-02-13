"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlaceType } from "../types";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

type MapKind = "US_STATE" | "COUNTRY";

/**
 * Multiple sources in case a CDN blocks/changes.
 * We fetch these ourselves and pass the parsed object to <Geographies>.
 */
const WORLD_SOURCES = [
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
  "https://unpkg.com/world-atlas@2/countries-110m.json"
];

const US_SOURCES = [
  "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
  "https://unpkg.com/us-atlas@3/states-10m.json"
];

/**
 * US TopoJSON uses numeric state FIPS codes. Map those to USPS codes (your data model).
 */
const FIPS_TO_USPS: Record<string, string> = {
  "1": "AL", "2": "AK", "4": "AZ", "5": "AR", "6": "CA", "8": "CO", "9": "CT", "10": "DE",
  "11": "DC", "12": "FL", "13": "GA", "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA",
  "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD", "25": "MA", "26": "MI", "27": "MN",
  "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ", "35": "NM",
  "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI",
  "45": "SC", "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA",
  "54": "WV", "55": "WI", "56": "WY"
};

/**
 * World TopoJSON countries-110m.json uses ISO 3166-1 numeric codes.
 * Your MVP list uses alpha-2. This maps only the current seeded countries.
 * (Expand later when you expand the dataset.)
 */
const ISO_NUMERIC_TO_ALPHA2: Record<string, string> = {
  "36": "AU",
  "76": "BR",
  "124": "CA",
  "250": "FR",
  "276": "DE",
  "356": "IN",
  "372": "IE",
  "380": "IT",
  "392": "JP",
  "484": "MX",
  "528": "NL",
  "620": "PT",
  "724": "ES",
  "826": "GB",
  "840": "US"
};

export function MapModal({
  open,
  onClose,
  type,
  visitedCount,
  totalCount,
  visitedRegionCodes
}: {
  open: boolean;
  onClose: () => void;
  type: PlaceType;
  visitedCount: number;
  totalCount: number;
  visitedRegionCodes: string[]; // USPS for states, alpha-2 for countries
}) {
  const [geoData, setGeoData] = useState<any | null>(null);
  const [geoSourceUsed, setGeoSourceUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const sources = type === "US_STATE" ? US_SOURCES : WORLD_SOURCES;

    async function load() {
      setGeoData(null);
      setGeoSourceUsed(null);
      setError(null);

      for (const url of sources) {
        try {
          const res = await fetch(url, { cache: "force-cache" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const json = await res.json();
          if (cancelled) return;
          setGeoData(json);
          setGeoSourceUsed(url);
          return;
        } catch (e: any) {
          // try next source
        }
      }

      if (!cancelled) {
        setError("Could not load map data. This is usually a network/CDN block.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [open, type]);

  if (!open) return null;

  const accent = type === "US_STATE" ? "var(--accent-us)" : "var(--accent-world)";
  const title = type === "US_STATE" ? "United States" : "World";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-2xl border border-[var(--line)] bg-white shadow-lg">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <div className="text-base font-medium">{title} Map</div>
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
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-3">
            {error ? (
              <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-center">
                <div className="text-sm">{error}</div>
                <div className="text-xs text-[var(--muted)]">
                  Try again on cellular vs Wi-Fi, or open the Vercel URL in Safari (not an in-app browser).
                </div>
              </div>
            ) : !geoData ? (
              <div className="flex h-[260px] items-center justify-center text-sm text-[var(--muted)]">
                Loading map…
              </div>
            ) : (
              <RealMap
                kind={type}
                geoData={geoData}
                accent={accent}
                visitedRegionCodes={visitedRegionCodes}
              />
            )}
          </div>

          <div className="mt-3 text-xs text-[var(--muted)]">
            {geoSourceUsed ? (
              <>Map data source: {new URL(geoSourceUsed).hostname}</>
            ) : (
              <>Tap a place in the list; the map reflects it.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RealMap({
  kind,
  geoData,
  accent,
  visitedRegionCodes
}: {
  kind: MapKind;
  geoData: any;
  accent: string;
  visitedRegionCodes: string[];
}) {
  const visitedSet = useMemo(() => new Set(visitedRegionCodes), [visitedRegionCodes]);

  const cfg =
    kind === "US_STATE"
      ? { projection: "geoAlbersUsa" as const, scale: 980, height: 320 }
      : { projection: "geoEqualEarth" as const, scale: 155, height: 320 };

  return (
    <div className="h-[260px] w-full">
      <ComposableMap
        projection={cfg.projection}
        width={980}
        height={cfg.height}
        style={{ width: "100%", height: "100%" }}
        projectionConfig={{ scale: cfg.scale }}
      >
        <Geographies geography={geoData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const id = String(geo.id);

              let code: string | null = null;
              if (kind === "US_STATE") {
                code = FIPS_TO_USPS[id] ?? null;
              } else {
                code = ISO_NUMERIC_TO_ALPHA2[id] ?? null;
              }

              const visited = code ? visitedSet.has(code) : false;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: visited ? accent : "rgba(0,0,0,0.03)",
                      stroke: "rgba(0,0,0,0.12)",
                      strokeWidth: 0.6,
                      outline: "none"
                    },
                    hover: {
                      fill: visited ? accent : "rgba(0,0,0,0.06)",
                      stroke: "rgba(0,0,0,0.16)",
                      strokeWidth: 0.8,
                      outline: "none"
                    },
                    pressed: {
                      fill: visited ? accent : "rgba(0,0,0,0.06)",
                      stroke: "rgba(0,0,0,0.16)",
                      strokeWidth: 0.8,
                      outline: "none"
                    }
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
