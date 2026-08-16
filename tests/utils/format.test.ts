import { describe, test, expect } from "bun:test";
import { WEATHER_CODE, formatTemp, cityLabel, formatDayLabel } from "../../src/utils/format.ts";
import type { City } from "../../src/types/City.ts";

describe("formatTemp", () => {
  test("Celsius a °C", () => {
    const out = formatTemp(20, "C");
    expect(out).toContain("20.0 °C");
    expect(out).toContain("\x1b[33m");
  });
  test("Celsius a °F", () => {
    const out = formatTemp(100, "F");
    expect(out).toContain("212.0 °F");
  });
  test("-40 es igual en C y F", () => {
    expect(formatTemp(-40, "C")).toContain("-40.0 °C");
    expect(formatTemp(-40, "F")).toContain("-40.0 °F");
  });
});

describe("cityLabel", () => {
  const withCountry: City = { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" };
  const withoutCountry: City = { name: "Ottawa", latitude: 45.4, longitude: -75.7 };

  test("incluye el país cuando existe", () => {
    expect(cityLabel(withCountry)).toBe("Ottawa, Canada");
  });
  test("omite la coma cuando no hay país", () => {
    expect(cityLabel(withoutCountry)).toBe("Ottawa");
  });
});

describe("formatDayLabel", () => {
  test("índice 0 marca Hoy con día de la semana", () => {
    const label = formatDayLabel("2026-08-16", 0);
    expect(label.startsWith("Hoy (")).toBe(true);
    expect(label).toContain("16");
  });
  test("otros índices no usan 'Hoy'", () => {
    const label = formatDayLabel("2026-08-17", 1);
    expect(label.startsWith("Hoy")).toBe(false);
    expect(label).toContain("17");
  });
});

describe("WEATHER_CODE", () => {
  test("0 = Despejado", () => {
    expect(WEATHER_CODE[0]).toBe("Despejado");
  });
  test("65 = Lluvia fuerte", () => {
    expect(WEATHER_CODE[65]).toBe("Lluvia fuerte");
  });
});