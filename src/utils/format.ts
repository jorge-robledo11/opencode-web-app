import type { City } from "../types/City.ts";
import type { Units } from "../types/Config.ts";
import { paint } from "./colors.ts";
import { WEEKDAYS_ES } from "./constants.ts";

export const WEATHER_CODE: Record<number, string> = {
  0: "Despejado",
  1: "Principalmente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna",
  55: "Llovizna densa",
  61: "Lluvia ligera",
  63: "Lluvia",
  65: "Lluvia fuerte",
  71: "Nieve ligera",
  73: "Nieve",
  75: "Nieve fuerte",
  80: "Chubascos ligeros",
  81: "Chubascos",
  82: "Chubascos fuertes",
  95: "Tormenta",
  96: "Tormenta con granizo ligero",
  99: "Tormenta con granizo fuerte",
};

export function formatTemp(celsius: number, units: Units): string {
  const text = units === "F"
    ? `${((celsius * 9) / 5 + 32).toFixed(1)} °F`
    : `${celsius.toFixed(1)} °C`;
  return paint("yellow", text);
}

export function cityLabel(city: City): string {
  return city.country ? `${city.name}, ${city.country}` : city.name;
}

export function formatDayLabel(iso: string, index: number): string {
  const date = new Date(`${iso}T00:00:00`);
  const day = WEEKDAYS_ES[date.getDay()] ?? "";
  const dom = date.getDate().toString().padStart(2, "0");
  return index === 0 ? `Hoy (${day} ${dom})` : `${day} ${dom}`;
}
