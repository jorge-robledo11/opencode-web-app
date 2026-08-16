import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import "../helpers.ts";
import { installFetchMock, installConsoleSpy } from "../helpers.ts";
import { getAllWeather } from "../../src/actions/getWeather.ts";
import type { Config } from "../../src/types/Config.ts";

function makeConfig(extra: Partial<Config> = {}): Config {
  return { cities: [], units: "C", ...extra };
}

const ottawa = { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" };
const toronto = { name: "Toronto", latitude: 43.7, longitude: -79.4, country: "Canada" };

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

describe("getAllWeather", () => {
  test("lista vacía → muestra error", async () => {
    await getAllWeather(makeConfig());
    expect(output()).toContain("No hay ciudades guardadas");
  });

  test("todas ok → imprime una línea por ciudad", async () => {
    restoreFetch = installFetchMock(async () =>
      new Response(JSON.stringify({ current: { temperature_2m: 10 } }), { status: 200 })
    );
    await getAllWeather(makeConfig({ cities: [ottawa, toronto] }));
    const out = output();
    expect(out).toContain("Ottawa, Canada");
    expect(out).toContain("Toronto, Canada");
  });

  test("fetch throws para una ciudad → imprime error para esa", async () => {
    restoreFetch = installFetchMock(async () => {
      throw new Error("net");
    });
    await getAllWeather(makeConfig({ cities: [ottawa] }));
    expect(output()).toContain("Error de red");
    expect(output()).toContain("Ottawa, Canada");
  });
});