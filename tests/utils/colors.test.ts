import { describe, test, expect } from "bun:test";
import { paint, ANSI } from "../../src/utils/colors.ts";

describe("paint", () => {
  test.each(["cyan", "yellow", "green", "red"] as const)(
    "envuelve con ANSI %s",
    (color) => {
      const out = paint(color, "hola");
      expect(out).toBe(`${ANSI[color]}hola${ANSI.reset}`);
    }
  );
});