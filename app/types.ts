export type PlaceType = "US_STATE" | "COUNTRY";

export type Place = {
  id: string;
  name: string;
  type: PlaceType;
  regionCode: string; // USPS code for states, ISO-like for countries in this MVP
  visited: boolean;
  visitedAt: string | null;
};
