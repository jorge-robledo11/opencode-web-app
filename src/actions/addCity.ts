import type { Config } from "../types/Config.ts";
import { geocode } from "../api/geocoding.ts";
import { addCity as addCityToConfig, hasCity } from "../storage/citiesStorage.ts";
import { saveConfig } from "../storage/settingsStorage.ts";
import { printError, printSuccess } from "../presentation/output.ts";
import { promptCityName } from "../presentation/input.ts";
import { cityLabel } from "../utils/format.ts";

export async function addCity(config: Config): Promise<void> {
  const name = await promptCityName();
  if (!name) return;
  try {
    const city = await geocode(name);
    if (!city) {
      printError(`No se encontró la ciudad: ${name}`);
      return;
    }
    if (hasCity(config, city)) {
      printError(`${cityLabel(city)} ya está guardada.`);
      return;
    }
    addCityToConfig(config, city);
    await saveConfig(config);
    printSuccess(`Agregada: ${cityLabel(city)}`);
  } catch (e) {
    printError(`Error de red: ${(e as Error).message}`);
  }
}
