import type { City } from "../types/City.ts";
import { paint } from "../utils/colors.ts";
import { cityLabel } from "../utils/format.ts";

export function printError(msg: string): void {
  console.log(paint("red", msg));
}

export function printSuccess(msg: string): void {
  console.log(paint("green", msg));
}

export function printPlain(msg: string): void {
  console.log(msg);
}

export function printCyan(msg: string): void {
  console.log(paint("cyan", msg));
}

export function printWeatherLine(label: string, tempText: string): void {
  console.log(`${label}: ${tempText}`);
}

export function printForecastDay(dayLabel: string, max: string, min: string, desc: string): void {
  console.log(`  ${dayLabel}: ${paint("yellow", `${max} / ${min} °C`)} — ${desc}`);
}

export function printCitiesList(cities: City[]): void {
  cities.forEach((c, i) => {
    console.log(`  ${i + 1}. ${cityLabel(c)}`);
  });
}
