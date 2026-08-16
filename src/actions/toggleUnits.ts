import type { Config } from "../types/Config.ts";
import { saveConfig } from "../storage/settingsStorage.ts";
import { printSuccess } from "../presentation/output.ts";

export async function toggleUnits(config: Config): Promise<void> {
  config.units = config.units === "C" ? "F" : "C";
  await saveConfig(config);
  printSuccess(`Unidades: °${config.units}`);
}
