import type { City } from "./City.ts";

export type Units = "C" | "F";

export type Config = {
  defaultCity?: string;
  cities: City[];
  units: Units;
};
