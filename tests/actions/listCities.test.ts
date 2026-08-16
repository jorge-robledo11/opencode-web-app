import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import "../helpers.ts";
import { installConsoleSpy } from "../helpers.ts";
import { listCities } from "../../src/actions/listCities.ts";
import type { Config } from "../../src/types/Config.ts";

function makeConfig(extra: Partial<Config> = {}): Config {
  return { cities: [], units: "C", ...extra };
}

const ottawa = { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" };

let spy: ReturnType<typeof installConsoleSpy>["spy"] | null = null;
let restoreConsole: (() => void) | null = null;

beforeEach(() => {
  const cs = installConsoleSpy();
  spy = cs.spy;
  restoreConsole = cs.restore;
});

afterEach(() => {
  restoreConsole?.();
  restoreConsole = null;
  spy = null;
});

function output(): string {
  return spy?.mock.calls.map((c: unknown[]) => c[0]).join("\n") ?? "";
}

describe("listCities", () => {
  test("imprime la lista numerada con cityLabel", async () => {
    await listCities(makeConfig({ cities: [ottawa] }));
    expect(output()).toContain("1. Ottawa, Canada");
  });

  test("lista vacía → no imprime nada", async () => {
    await listCities(makeConfig());
    expect(spy?.mock.calls.length ?? 0).toBe(0);
  });
});