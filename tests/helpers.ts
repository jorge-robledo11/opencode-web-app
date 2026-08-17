import { join } from "node:path";
import { mock, spyOn } from "bun:test";

export const TEST_CONFIG_DIR = join(import.meta.dir, ".tmp");
export const TEST_CONFIG_PATH = join(TEST_CONFIG_DIR, "config.json");

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

export async function resetTestConfig(): Promise<void> {
  const { unlink } = await import("node:fs/promises");
  try {
    await unlink(TEST_CONFIG_PATH);
  } catch {
  }
}
