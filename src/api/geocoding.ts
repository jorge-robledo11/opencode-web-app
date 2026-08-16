import type { City } from "../types/City.ts";
import { GEO_URL } from "../utils/constants.ts";

type GeoResponse = {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
  }>;
};

export async function geocode(name: string): Promise<City | null> {
  const url = `${GEO_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as GeoResponse;
  const r = data.results?.[0];
  if (!r) return null;
  return {
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
  };
}
