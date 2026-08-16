import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import "../helpers.ts";
import { installFetchMock, installConsoleSpy } from "../helpers.ts";
import { getDefaultWeather } from "../../src/actions/getWeather.ts";
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

describe("getDefaultWeather", () => {
  test("sin default → muestra error, no llama fetch", async () => {
    await getDefaultWeather(makeConfig());
    expect(output()).toContain("No hay ciudad por defecto");
    expect(restoreFetch).toBeNull();
  });

  test("default no encontrada → muestra error", async () => {
    await getDefaultWeather(makeConfig({ cities: [ottawa], defaultCity: "Missing" }));
    expect(output()).toContain("no encontrada");
  });

  test("fetch ok → imprime ciudad y temperatura", async () => {
    restoreFetch = installFetchMock(async () =>
      new Response(JSON.stringify({ current: { temperature_2m: 18.5 } }), { status: 200 })
    );
    await getDefaultWeather(makeConfig({ cities: [ottawa], defaultCity: "Ottawa" }));
    expect(output()).toContain("Ottawa, Canada");
    expect(output()).toContain("18.5 °C");
  });

  test("fetch throws → muestra error de red", async () => {
    restoreFetch = installFetchMock(async () => {
      throw new Error("net");
    });
    await getDefaultWeather(makeConfig({ cities: [ottawa], defaultCity: "Ottawa" }));
    expect(output()).toContain("Error de red");
  });
});