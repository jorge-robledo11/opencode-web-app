import type { Config } from "../types/Config.ts";
import { saveConfig } from "../storage/settingsStorage.ts";
import { printError, printSuccess, printCitiesList } from "../presentation/output.ts";
import { promptNumber } from "../presentation/input.ts";
import { cityLabel } from "../utils/format.ts";

export async function setDefaultCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades guardadas. Usa la opción 3 para agregar.");
    return;
  }
  printCitiesList(config.cities);
  const n = await promptNumber("Número para establecer como default: ", config.cities.length);
  if (n == null) {
    printError("Opción inválida.");
    return;
  }
  const city = config.cities[n - 1];
  if (!city) return;
  config.defaultCity = city.name;
  await saveConfig(config);
  printSuccess(`Ciudad default: ${cityLabel(city)}`);
}
