import type { Config } from "../types/Config.ts";
import { printCitiesList } from "../presentation/output.ts";

export async function listCities(config: Config): Promise<void> {
  printCitiesList(config.cities);
}
