import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import "../helpers.ts";
import {
  installPromptMock, installConsoleSpy, resetTestConfig,
} from "../helpers.ts";
import { removeCity } from "../../src/actions/removeCity.ts";
import type { Config } from "../../src/types/Config.ts";

function makeConfig(extra: Partial<Config> = {}): Config {
  return { cities: [], units: "C", ...extra };
}

const ottawa = { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" };

let restorePrompt: (() => void) | null = null;
let restoreConsole: (() => void) | null = null;

beforeEach(async () => {
  await resetTestConfig();
  const { restore: r } = installConsoleSpy();
  restoreConsole = r;
});

afterEach(() => {
  restorePrompt?.(); restorePrompt = null;
  restoreConsole?.(); restoreConsole = null;
});

describe("removeCity", () => {
  test("lista vacía → muestra error, no modifica", async () => {
    const cfg = makeConfig();
    await removeCity(cfg);
    expect(cfg.cities).toHaveLength(0);
  });

  test("happy path: elimina la ciudad y guarda", async () => {
    restorePrompt = installPromptMock(() => "1");
    const cfg = makeConfig({ cities: [ottawa] });
    await removeCity(cfg);
    expect(cfg.cities).toHaveLength(0);
  });

  test("elimina la default → limpia defaultCity", async () => {
    restorePrompt = installPromptMock(() => "1");
    const cfg = makeConfig({ cities: [ottawa], defaultCity: "Ottawa" });
    await removeCity(cfg);
    expect(cfg.defaultCity).toBeUndefined();
  });

  test("índice inválido → muestra error, no modifica", async () => {
    restorePrompt = installPromptMock(() => "9");
    const cfg = makeConfig({ cities: [ottawa] });
    await removeCity(cfg);
    expect(cfg.cities).toHaveLength(1);
  });
});