import type { Config } from "../types/Config.ts";
import { getCurrentTemperature } from "../api/weather.ts";
import { findCityByName } from "../storage/citiesStorage.ts";
import { printError, printWeatherLine } from "../presentation/output.ts";
import { formatTemp, cityLabel } from "../utils/format.ts";

export async function getDefaultWeather(config: Config): Promise<void> {
  if (!config.defaultCity) {
    printError("No hay ciudad por defecto. Usa la opción 5 para establecer una.");
    return;
  }
  const city = findCityByName(config, config.defaultCity);
  if (!city) {
    printError(`Ciudad default "${config.defaultCity}" no encontrada. Restablece con la opción 5.`);
    return;
  }
  try {
    const temp = await getCurrentTemperature(city.latitude, city.longitude);
    printWeatherLine(cityLabel(city), formatTemp(temp, config.units));
  } catch (e) {
    printError(`Error de red: ${(e as Error).message}`);
  }
}

export async function getAllWeather(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades guardadas. Usa la opción 3 para agregar.");
    return;
  }
  for (const city of config.cities) {
    try {
      const temp = await getCurrentTemperature(city.latitude, city.longitude);
      printWeatherLine(cityLabel(city), formatTemp(temp, config.units));
    } catch (e) {
      printError(`${cityLabel(city)}: Error de red: ${(e as Error).message}`);
    }
  }
}
