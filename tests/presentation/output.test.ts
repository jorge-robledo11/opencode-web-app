import { describe, test, expect, afterEach } from "bun:test";
import { installConsoleSpy } from "../helpers.ts";
import {
  printError, printSuccess, printCyan, printWeatherLine, printForecastDay,
} from "../../src/presentation/output.ts";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

describe("printError", () => {
  test("pinta rojo y contiene el mensaje", () => {
    const { spy, restore: r } = installConsoleSpy();
    restore = r;
    printError("boom");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0]?.[0]).toContain("\x1b[31m");
    expect(spy.mock.calls[0]?.[0]).toContain("boom");
  });
});

describe("printSuccess", () => {
  test("pinta verde", () => {
    const { spy, restore: r } = installConsoleSpy();
    restore = r;
    printSuccess("ok");
    expect(spy.mock.calls[0]?.[0]).toContain("\x1b[32m");
  });
});

describe("printCyan", () => {
  test("pinta cyan", () => {
    const { spy, restore: r } = installConsoleSpy();
    restore = r;
    printCyan("x");
    expect(spy.mock.calls[0]?.[0]).toContain("\x1b[36m");
  });
});

describe("printWeatherLine", () => {
  test("concatena label y tempText con ': '", () => {
    const { spy, restore: r } = installConsoleSpy();
    restore = r;
    printWeatherLine("Ottawa", "20.0 °C");
    expect(spy.mock.calls[0]?.[0]).toBe("Ottawa: 20.0 °C");
  });
});

describe("printForecastDay", () => {
  test("incluye dayLabel, max/min °C pintados y descripción", () => {
    const { spy, restore: r } = installConsoleSpy();
    restore = r;
    printForecastDay("Hoy (dom 16)", "25.1", "15.2", "Despejado");
    const out = spy.mock.calls[0]?.[0] as string;
    expect(out).toContain("Hoy (dom 16)");
    expect(out).toContain("\x1b[33m");
    expect(out).toContain("25.1 / 15.2 °C");
    expect(out).toContain("Despejado");
  });
});