import { describe, test, expect, afterEach } from "bun:test";
import { installPromptMock } from "../helpers.ts";
import {
  promptCityName, promptNumber, promptChoice,
} from "../../src/presentation/input.ts";

let restore: (() => void) | null = null;

afterEach(() => {
  restore?.();
  restore = null;
});

describe("promptCityName", () => {
  test("devuelve el nombre recortado", async () => {
    restore = installPromptMock(() => "  Ottawa  ");
    expect(await promptCityName()).toBe("Ottawa");
  });
  test("vacío → null", async () => {
    restore = installPromptMock(() => "");
    expect(await promptCityName()).toBeNull();
  });
});

describe("promptNumber", () => {
  test("entero válido dentro de rango", async () => {
    restore = installPromptMock(() => "2");
    expect(await promptNumber("?", 5)).toBe(2);
  });
  test("fuera de rango → null", async () => {
    restore = installPromptMock(() => "9");
    expect(await promptNumber("?", 3)).toBeNull();
  });
  test("no entero → null", async () => {
    restore = installPromptMock(() => "1.5");
    expect(await promptNumber("?", 5)).toBeNull();
  });
  test("menor que 1 → null", async () => {
    restore = installPromptMock(() => "0");
    expect(await promptNumber("?", 5)).toBeNull();
  });
});

describe("promptChoice", () => {
  test("devuelve la cadena", async () => {
    restore = installPromptMock(() => "5");
    expect(await promptChoice("?")).toBe("5");
  });
  test("cadena vacía se preserva (?? deja pasar '')", async () => {
    restore = installPromptMock(() => "");
    expect(await promptChoice("?")).toBe("");
  });
  test("null del prompt → null", async () => {
    restore = installPromptMock(() => null);
    expect(await promptChoice("?")).toBeNull();
  });
});