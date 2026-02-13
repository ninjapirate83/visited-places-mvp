import type { Place } from "@/app/types";

const usStates: Array<{ name: string; code: string }> = [
  { name: "Alabama", code: "AL" }, { name: "Alaska", code: "AK" }, { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" }, { name: "California", code: "CA" }, { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" }, { name: "Delaware", code: "DE" }, { name: "Florida", code: "FL" },
  { name: "Georgia", code: "GA" }, { name: "Hawaii", code: "HI" }, { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" }, { name: "Indiana", code: "IN" }, { name: "Iowa", code: "IA" },
  { name: "Kansas", code: "KS" }, { name: "Kentucky", code: "KY" }, { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" }, { name: "Maryland", code: "MD" }, { name: "Massachusetts", code: "MA" },
  { name: "Michigan", code: "MI" }, { name: "Minnesota", code: "MN" }, { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" }, { name: "Montana", code: "MT" }, { name: "Nebraska", code: "NE" },
  { name: "Nevada", code: "NV" }, { name: "New Hampshire", code: "NH" }, { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" }, { name: "New York", code: "NY" }, { name: "North Carolina", code: "NC" },
  { name: "North Dakota", code: "ND" }, { name: "Ohio", code: "OH" }, { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" }, { name: "Pennsylvania", code: "PA" }, { name: "Rhode Island", code: "RI" },
  { name: "South Carolina", code: "SC" }, { name: "South Dakota", code: "SD" }, { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" }, { name: "Utah", code: "UT" }, { name: "Vermont", code: "VT" },
  { name: "Virginia", code: "VA" }, { name: "Washington", code: "WA" }, { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" }, { name: "Wyoming", code: "WY" }
];

const countries: Array<{ name: string; code: string }> = [
  { name: "Australia", code: "AU" }, { name: "Brazil", code: "BR" }, { name: "Canada", code: "CA" },
  { name: "France", code: "FR" }, { name: "Germany", code: "DE" }, { name: "India", code: "IN" },
  { name: "Ireland", code: "IE" }, { name: "Italy", code: "IT" }, { name: "Japan", code: "JP" },
  { name: "Mexico", code: "MX" }, { name: "Netherlands", code: "NL" }, { name: "Portugal", code: "PT" },
  { name: "Spain", code: "ES" }, { name: "United Kingdom", code: "GB" }, { name: "United States", code: "US" }
];

export function seedPlaces(): Place[] {
  const nowNull = null as string | null;

  const statePlaces: Place[] = usStates.map((s) => ({
    id: `US_STATE:${s.code}`,
    name: s.name,
    type: "US_STATE",
    regionCode: s.code,
    visited: false,
    visitedAt: nowNull
  }));

  const countryPlaces: Place[] = countries
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      id: `COUNTRY:${c.code}`,
      name: c.name,
      type: "COUNTRY",
      regionCode: c.code,
      visited: false,
      visitedAt: nowNull
    }));

  return [...statePlaces, ...countryPlaces];
}

