import { describe, test, expect } from "bun:test";
import { join } from "node:path";

const ENTRY = join(import.meta.dir, "..", "src", "index.ts");

describe("index entry (smoke)", () => {
  test("main() arranca, rinde menú y sale limpiamente al elegir opción 9", async () => {
    const proc = Bun.spawn([process.execPath, "run", ENTRY], {
      stdin: new Response("9\n").body,
      stdout: "pipe",
      stderr: "pipe",
    });
    const [exitCode, stdout, stderr] = await Promise.all([
      proc.exited,
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
    ]);
    expect(exitCode).toBe(0);
    const cleanStderr = stderr.replace(/warn: CPU lacks AVX support[\s\S]*?baseline\.zip\n?/, "");
    expect(cleanStderr).toBe("");
    expect(stdout).toContain("Salir");
  });
});