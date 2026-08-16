import { describe, test, expect } from "bun:test";
import {
  findCityByName, hasCity, addCity, removeCityByIndex,
} from "../../src/storage/citiesStorage.ts";
import type { Config } from "../../src/types/Config.ts";
import type { City } from "../../src/types/City.ts";

const ottawa: City = { name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" };
const toronto: City = { name: "Toronto", latitude: 43.7, longitude: -79.4, country: "Canada" };
const ottawaMx: City = { name: "Ottawa", latitude: 19.4, longitude: -99.1, country: "Mexico" };

function makeConfig(extra: Partial<Config> = {}): Config {
  return { cities: [], units: "C", ...extra };
}

describe("findCityByName", () => {
  test("encuentra por nombre", () => {
    const c = makeConfig({ cities: [ottawa, toronto] });
    expect(findCityByName(c, "Toronto")).toBe(toronto);
  });
  test("devuelve undefined si no existe", () => {
    expect(findCityByName(makeConfig(), "X")).toBeUndefined();
  });
});

describe("hasCity", () => {
  test("true cuando coincide nombre y país", () => {
    expect(hasCity(makeConfig({ cities: [ottawa] }), ottawa)).toBe(true);
  });
  test("false cuando mismo nombre pero distinto país", () => {
    expect(hasCity(makeConfig({ cities: [ottawa] }), ottawaMx)).toBe(false);
  });
  test("false cuando la lista está vacía", () => {
    expect(hasCity(makeConfig(), ottawa)).toBe(false);
  });
});

describe("addCity", () => {
  test("añade al final del array", () => {
    const c = makeConfig();
    addCity(c, ottawa);
    addCity(c, toronto);
    expect(c.cities).toEqual([ottawa, toronto]);
  });
});

describe("removeCityByIndex", () => {
  test("elimina por índice y devuelve la ciudad", () => {
    const c = makeConfig({ cities: [ottawa, toronto] });
    const removed = removeCityByIndex(c, 0);
    expect(removed).toBe(ottawa);
    expect(c.cities).toEqual([toronto]);
  });
  test("limpia defaultCity cuando coincide con la eliminada", () => {
    const c = makeConfig({ cities: [ottawa], defaultCity: "Ottawa" });
    removeCityByIndex(c, 0);
    expect(c.defaultCity).toBeUndefined();
  });
  test("no limpia defaultCity cuando el nombre no coincide", () => {
    const c = makeConfig({ cities: [ottawa, toronto], defaultCity: "Toronto" });
    removeCityByIndex(c, 0);
    expect(c.defaultCity).toBe("Toronto");
  });
});