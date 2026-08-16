import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { join } from "node:path";
import { homedir } from "node:os";
import "../helpers.ts";
import {
  installConsoleSpy, resetTestConfig, TEST_CONFIG_PATH,
} from "../helpers.ts";
import { toggleUnits } from "../../src/actions/toggleUnits.ts";
import { loadConfig } from "../../src/storage/settingsStorage.ts";
import type { Config } from "../../src/types/Config.ts";

let restoreConsole: (() => void) | null = null;

beforeEach(async () => {
  await resetTestConfig();
  const { restore: r } = installConsoleSpy();
  restoreConsole = r;
});

afterEach(() => {
  restoreConsole?.();
  restoreConsole = null;
});

describe("toggleUnits", () => {
  test("C → F y persiste en disco", async () => {
    const cfg = await loadConfig();
    expect(cfg.units).toBe("C");
    await toggleUnits(cfg);
    expect(cfg.units).toBe("F");
    const reloaded = await loadConfig();
    expect(reloaded.units).toBe("F");
  });

  test("F → C y persiste en disco", async () => {
    const initial = await loadConfig();
    const cfg: Config = { ...initial, units: "F" };
    await toggleUnits(cfg);
    expect(cfg.units).toBe("C");
    const reloaded = await loadConfig();
    expect(reloaded.units).toBe("C");
  });

  test("persiste bajo tests/.tmp, no en ~/.config/02-weather", async () => {
    const prodPath = join(homedir(), ".config", "02-weather", "config.json");
    expect(TEST_CONFIG_PATH).not.toBe(prodPath);
    expect(TEST_CONFIG_PATH).toContain("tests/.tmp");
    const cfg = await loadConfig();
    await toggleUnits(cfg);
    const file = Bun.file(TEST_CONFIG_PATH);
    expect(await file.exists()).toBe(true);
  });
});