import type { DailyForecast } from "../types/Weather.ts";
import { FORECAST_URL } from "../utils/constants.ts";

type ForecastResponse = {
  current?: { temperature_2m?: number };
};

type DailyForecastResponse = {
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    weather_code?: number[];
  };
};

export async function getCurrentTemperature(lat: number, lon: number): Promise<number> {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as ForecastResponse;
  const t = data.current?.temperature_2m;
  if (typeof t !== "number") throw new Error("no temperature in response");
  return t;
}

export async function getDailyForecast(lat: number, lon: number): Promise<DailyForecast> {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=7&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as DailyForecastResponse;
  const d = data.daily;
  if (!d || !d.time || !d.temperature_2m_max || !d.temperature_2m_min || !d.weather_code) {
    throw new Error("no daily forecast in response");
  }
  return {
    time: d.time,
    tempMax: d.temperature_2m_max,
    tempMin: d.temperature_2m_min,
    code: d.weather_code,
  };
}
