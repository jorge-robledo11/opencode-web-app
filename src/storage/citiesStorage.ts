import type { City } from "../types/City.ts";
import type { Config } from "../types/Config.ts";

export function findCityByName(config: Config, name: string): City | undefined {
  return config.cities.find((c) => c.name === name);
}

export function hasCity(config: Config, city: City): boolean {
  return config.cities.some(
    (c) => c.name === city.name && c.country === city.country
  );
}

export function addCity(config: Config, city: City): void {
  config.cities.push(city);
}

export function removeCityByIndex(config: Config, index: number): City | undefined {
  const removed = config.cities.splice(index, 1)[0];
  if (removed && config.defaultCity === removed.name) {
    config.defaultCity = undefined;
  }
  return removed;
}
