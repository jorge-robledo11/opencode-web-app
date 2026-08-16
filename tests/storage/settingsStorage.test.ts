import { describe, test, expect, beforeEach } from "bun:test";
import "../helpers.ts";
import {
  resetTestConfig, TEST_CONFIG_PATH, TEST_CONFIG_DIR,
} from "../helpers.ts";
import { loadConfig, saveConfig } from "../../src/storage/settingsStorage.ts";
import type { Config } from "../../src/types/Config.ts";

describe("settingsStorage", () => {
  beforeEach(async () => {
    await resetTestConfig();
  });

  test("archivo inexistente → defaults", async () => {
    const cfg = await loadConfig();
    expect(cfg).toEqual({ cities: [], units: "C" });
  });

  test("round-trip save/load", async () => {
    const cfg: Config = {
      defaultCity: "Ottawa",
      cities: [{ name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" }],
      units: "F",
    };
    await saveConfig(cfg);
    const loaded = await loadConfig();
    expect(loaded).toEqual(cfg);
    expect(TEST_CONFIG_PATH.endsWith("tests/.tmp/config.json")).toBe(true);
  });

  test("JSON corrupto → defaults", async () => {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(TEST_CONFIG_PATH, "{esto no es json");
    const cfg = await loadConfig();
    expect(cfg).toEqual({ cities: [], units: "C" });
  });

  test("parcial sin cities → defaults + respeta units", async () => {
    const { writeFile } = await import("node:fs/promises");
    await writeFile(TEST_CONFIG_PATH, JSON.stringify({ units: "F" }));
    const cfg = await loadConfig();
    expect(cfg.cities).toEqual([]);
    expect(cfg.units).toBe("F");
  });

  test("TEST_CONFIG_DIR existe bajo tests/.tmp", () => {
    expect(TEST_CONFIG_DIR.endsWith("tests/.tmp")).toBe(true);
  });
});