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
const ISO_NUMERIC_TO_ALPHA2: Record<string,_
