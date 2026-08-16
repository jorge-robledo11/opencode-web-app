import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import "../helpers.ts";
import { installFetchMock, installConsoleSpy } from "../helpers.ts";
import { getWeeklyForecast } from "../../src/actions/getForecast.ts";
import type { Config } from "../../src/types/Config.ts";

function makeConfig(extra: Partial<Config> = {}): Config {
  return { cities: [], units: "C", ...extra };
}

const ottawa = { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" };

let spy: ReturnType<typeof installConsoleSpy>["spy"] | null = null;
let restoreFetch: (() => void) | null = null;
let restoreConsole: (() => void) | null = null;

beforeEach(() => {
  const cs = installConsoleSpy();
  spy = cs.spy;
  restoreConsole = cs.restore;
});

afterEach(() => {
  restoreFetch?.(); restoreFetch = null;
  restoreConsole?.(); restoreConsole = null;
  spy = null;
});

function output(): string {
  return spy?.mock.calls.map((c: unknown[]) => c[0]).join("\n") ?? "";
}

describe("getWeeklyForecast", () => {
  test("sin default → muestra error", async () => {
    await getWeeklyForecast(makeConfig());
    expect(output()).toContain("No hay ciudad por defecto");
  });

  test("fetch ok → header + días con descripción", async () => {
    restoreFetch = installFetchMock(async () =>
      new Response(
        JSON.stringify({
          daily: {
            time: ["2026-08-16", "2026-08-17"],
            temperature_2m_max: [25.1, 26.0],
            temperature_2m_min: [15.2, 16.0],
            weather_code: [0, 1],
          },
        }),
        { status: 200 }
      )
    );
    await getWeeklyForecast(makeConfig({ cities: [ottawa], defaultCity: "Ottawa" }));
    const out = output();
    expect(out).toContain("Pronóstico 7 días");
    expect(out).toContain("Ottawa, Canada");
    expect(out).toContain("Despejado");
    expect(out).toContain("25.1 / 15.2 °C");
  });

  test("fetch throws → muestra error de red", async () => {
    restoreFetch = installFetchMock(async () => {
      throw new Error("net");
    });
    await getWeeklyForecast(makeConfig({ cities: [ottawa], defaultCity: "Ottawa" }));
    expect(output()).toContain("Error de red");
  });
});