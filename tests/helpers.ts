import { join } from "node:path";
import { mock, spyOn } from "bun:test";

export const TEST_CONFIG_DIR = join(import.meta.dir, ".tmp");
export const TEST_CONFIG_PATH = join(TEST_CONFIG_DIR, "config.json");

const REAL_GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REAL_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const REAL_WEEKDAYS_ES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

mock.module("../src/utils/constants.ts", () => ({
  CONFIG_PATH: TEST_CONFIG_PATH,
  GEO_URL: REAL_GEO_URL,
  FORECAST_URL: REAL_FORECAST_URL,
  WEEKDAYS_ES: REAL_WEEKDAYS_ES,
}));

export async function resetTestConfig(): Promise<void> {
  const { unlink } = await import("node:fs/promises");
  try {
    await unlink(TEST_CONFIG_PATH);
  } catch {
  }
}

type FetchImpl = (input: any, init?: any) => Promise<Response>;

export function installFetchMock(impl: FetchImpl): () => void {
  const original = globalThis.fetch;
  (globalThis as { fetch: FetchImpl }).fetch = impl;
  return () => {
    (globalThis as { fetch: FetchImpl }).fetch = original;
  };
}

type PromptImpl = (promptText: string) => string | null;

export function installPromptMock(impl: PromptImpl): () => void {
  const original = (globalThis as { prompt?: PromptImpl }).prompt;
  (globalThis as { prompt?: PromptImpl }).prompt = impl;
  return () => {
    (globalThis as { prompt?: PromptImpl }).prompt = original;
  };
}

export function installConsoleSpy(): {
  spy: ReturnType<typeof spyOn>;
  restore: () => void;
} {
  const spy = spyOn(console, "log").mockImplementation(() => {});
  return {
    spy,
    restore: () => {
      spy.mockRestore();
    },
  };
}