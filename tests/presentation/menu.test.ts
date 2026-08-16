import { describe, test, expect } from "bun:test";
import { renderMenu } from "../../src/presentation/menu.ts";
import type { MenuOption } from "../../src/types/MenuOption.ts";

const opts: MenuOption[] = [
  { key: "1", label: "Clima" },
  { key: "9", label: "Salir" },
];

describe("renderMenu", () => {
  test("incluye el header WEATHER CLI", () => {
    expect(renderMenu(opts)).toContain("WEATHER CLI");
  });
  test("incluye cada opción en orden con '  key. label'", () => {
    const out = renderMenu(opts);
    expect(out).toContain("  1. Clima");
    expect(out).toContain("  9. Salir");
    const i1 = out.indexOf("  1. Clima");
    const i9 = out.indexOf("  9. Salir");
    expect(i1).toBeGreaterThan(-1);
    expect(i9).toBeGreaterThan(i1);
  });
  test("cierra con borde ═", () => {
    expect(renderMenu(opts).trimEnd().endsWith("═".repeat(32))).toBe(true);
  });
});