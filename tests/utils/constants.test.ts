import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const src = readFileSync(
  join(import.meta.dir, "..", "..", "src", "utils", "constants.ts"),
  "utf-8"
);

describe("constants (source)", () => {
  test("CONFIG_PATH apunta a ~/.config/02-weather/config.json", () => {
    expect(src).toContain('".config", "02-weather", "config.json"');
    expect(src).toMatch(/CONFIG_PATH\s*=\s*join\(homedir\(\)/);
  });
  test("GEO_URL es la API de geocoding de Open-Meteo", () => {
    expect(src).toContain('"https://geocoding-api.open-meteo.com/v1/search"');
  });
  test("FORECAST_URL es la API de forecast de Open-Meteo", () => {
    expect(src).toContain('"https://api.open-meteo.com/v1/forecast"');
  });
  test("WEEKDAYS_ES empieza en domingo y tiene 7 días", () => {
    expect(src).toContain('"dom"');
    expect(src).toContain('"sáb"');
    expect(src).toMatch(/WEEKDAYS_ES\s*=\s*\[/);
  });
});