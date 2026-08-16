import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import "../helpers.ts";
import {
  installFetchMock, installPromptMock, installConsoleSpy, resetTestConfig,
} from "../helpers.ts";
import { addCity } from "../../src/actions/addCity.ts";
import type { Config } from "../../src/types/Config.ts";

function makeConfig(extra: Partial<Config> = {}): Config {
  return { cities: [], units: "C", ...extra };
}

let restoreFetch: (() => void) | null = null;
let restorePrompt: (() => void) | null = null;
let restoreConsole: (() => void) | null = null;

beforeEach(async () => {
  await resetTestConfig();
  restoreFetch = installFetchMock(async () =>
    new Response(
      JSON.stringify({
        results: [{ name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" }],
      }),
      { status: 200 }
    )
  );
  restorePrompt = installPromptMock(() => "Ottawa");
  const { restore: r } = installConsoleSpy();
  restoreConsole = r;
});

afterEach(() => {
  restoreFetch?.(); restoreFetch = null;
  restorePrompt?.(); restorePrompt = null;
  restoreConsole?.(); restoreConsole = null;
});

describe("addCity", () => {
  test("happy path: geocode ok → guarda y muestra éxito", async () => {
    const cfg = makeConfig();
    await addCity(cfg);
    expect(cfg.cities).toHaveLength(1);
    expect(cfg.cities[0]?.name).toBe("Ottawa");
    expect(cfg.cities[0]?.country).toBe("Canada");
  });

  test("no encontrado: geocode null → no guarda, muestra error", async () => {
    restoreFetch?.();
    restoreFetch = installFetchMock(async () =>
      new Response(JSON.stringify({ results: [] }), { status: 200 })
    );
    const cfg = makeConfig();
    await addCity(cfg);
    expect(cfg.cities).toHaveLength(0);
  });

  test("duplicada: hasCity true → no guarda, muestra error", async () => {
    const cfg = makeConfig({
      cities: [{ name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" }],
    });
    await addCity(cfg);
    expect(cfg.cities).toHaveLength(1);
  });

  test("fetch throws → muestra error de red, no guarda", async () => {
    restoreFetch?.();
    restoreFetch = installFetchMock(async () => {
      throw new Error("boom");
    });
    const cfg = makeConfig();
    await addCity(cfg);
    expect(cfg.cities).toHaveLength(0);
  });
});