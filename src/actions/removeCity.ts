import type { Config } from "../types/Config.ts";
import { removeCityByIndex } from "../storage/citiesStorage.ts";
import { saveConfig } from "../storage/settingsStorage.ts";
import { printError, printSuccess, printCitiesList } from "../presentation/output.ts";
import { promptNumber } from "../presentation/input.ts";

export async function removeCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    printError("No hay ciudades guardadas.");
    return;
  }
  printCitiesList(config.cities);
  const n = await promptNumber("Número a eliminar: ", config.cities.length);
  if (n == null) {
    printError("Opción inválida.");
    return;
  }
  const removed = removeCityByIndex(config, n - 1);
  await saveConfig(config);
  printSuccess(`Eliminada: ${removed?.name ?? ""}`);
}
