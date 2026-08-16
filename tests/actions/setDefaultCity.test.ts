import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import "../helpers.ts";
import {
  installPromptMock, installConsoleSpy, resetTestConfig,
} from "../helpers.ts";
import { setDefaultCity } from "../../src/actions/setDefaultCity.ts";
import type { Config } from "../../src/types/Config.ts";

function makeConfig(extra: Partial<Config> = {}): Config {
  return { cities: [], units: "C", ...extra };
}

const ottawa = { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" };
const toronto = { name: "Toronto", latitude: 43.7, longitude: -79.4, country: "Canada" };

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

describe("setDefaultCity", () => {
  test("lista vacía → muestra error", async () => {
    const cfg = makeConfig();
    await setDefaultCity(cfg);
    expect(cfg.defaultCity).toBeUndefined();
  });

  test("happy path: establece y guarda", async () => {
    restorePrompt = installPromptMock(() => "2");
    const cfg = makeConfig({ cities: [ottawa, toronto] });
    await setDefaultCity(cfg);
    expect(cfg.defaultCity).toBe("Toronto");
  });

  test("índice inválido → no modifica", async () => {
    restorePrompt = installPromptMock(() => "9");
    const cfg = makeConfig({ cities: [ottawa] });
    await setDefaultCity(cfg);
    expect(cfg.defaultCity).toBeUndefined();
  });
});