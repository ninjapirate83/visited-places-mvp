"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlaceType } from "../types";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

type MapKind = "US_STATE" | "COUNTRY";

const WORLD_TOPOJSON_URL = "https://unpkg.com/world-atlas@2/countries-110m.json";
const US_TOPOJSON_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

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
 * World TopoJSON uses ISO 3166-1 numeric codes.
 * Your MVP country list currently uses alpha-2 codes.
 * This mapping highlights visited countries from your current dataset.
 * Expand this map if/when you expand the country list.
 */
const ISO_NUMERIC_TO_ALPHA2: Record<string, string> = {
  "36": "AU",   // Australia
  "76": "BR",   // Brazil
  "124": "CA",  // Canada
  "250": "FR",  // France
  "276": "DE",  // Germany
  "356": "IN",  // India
  "372": "IE",  // Ireland
  "380": "IT",  // Italy
  "392": "JP",  // Japan
  "484": "MX",  // Mexico
  "528": "NL",  // Netherlands
  "620": "PT",  // Portugal
  "724": "ES",  // Spain
  "826": "GB",  // United Kingdom
  "840": "US"   // United States
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
  const [geoUrl, setGeoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setGeoUrl(type === "US_STATE" ? US_TOPOJSON_URL : WORLD_TOPOJSON_URL);
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
            {geoUrl ? (
              <RealMap
                kind={type}
                geoUrl={geoUrl}
                accent={accent}
                visitedRegionCodes={visitedRegionCodes}
              />
            ) : (
              <div className="flex h-56 items-center justify-center text-sm text-[var(--muted)]">
                Loading…
              </div>
            )}
          </div>

          <div className="mt-3 text-xs text-[var(--muted)]">
            Tap a state/country in the list to toggle visited; the map reflects it.
          </div>
        </div>
      </div>
    </div>
  );
}

function RealMap({
  kind,
  geoUrl,
  accent,
  visitedRegionCodes
}: {
  kind: MapKind;
  geoUrl: string;
  accent: string;
  visitedRegionCodes: string[];
}) {
  const visitedSet = useMemo(() => new Set(visitedRegionCodes), [visitedRegionCodes]);

  // View configs tuned for calm, minimal presentation
  const cfg =
    kind === "US_STATE"
      ? { projection: "geoAlbersUsa" as const, scale: 950, translate: [490, 275] as [number, number], height: 320 }
      : { projection: "geoEqualEarth" as const, scale: 145, translate: [490, 250] as [number, number], height: 320 };

  return (
    <ComposableMap
      projection={cfg.projection}
      width={980}
      height={cfg.height}
      style={{ width: "100%", height: "auto" }}
      projectionConfig={{ scale: cfg.scale, center: [0, 0] as [number, number] }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const id = String(geo.id);

            let code: string | null = null;
            if (kind === "US_STATE") {
              // US topo has numeric FIPS; map to USPS
              code = FIPS_TO_USPS[id] ?? null;
            } else {
              // World topo has ISO numeric; map to alpha-2 (for your current dataset)
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
                    stroke: "rgba(0,0,0,0.10)",
                    strokeWidth: 0.6,
                    outline: "none"
                  },
                  hover: {
                    fill: visited ? accent : "rgba(0,0,0,0.06)",
                    stroke: "rgba(0,0,0,0.14)",
                    strokeWidth: 0.8,
                    outline: "none"
                  },
                  pressed: {
                    fill: visited ? accent : "rgba(0,0,0,0.06)",
                    stroke: "rgba(0,0,0,0.14)",
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
  );
}
