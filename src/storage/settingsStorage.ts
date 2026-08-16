import type { Config } from "../types/Config.ts";
import { CONFIG_PATH } from "../utils/constants.ts";

export async function loadConfig(): Promise<Config> {
  const file = Bun.file(CONFIG_PATH);
  if (!(await file.exists())) {
    return { cities: [], units: "C" };
  }
  try {
    const parsed = JSON.parse(await file.text()) as Partial<Config>;
    return {
      defaultCity: parsed.defaultCity,
      cities: Array.isArray(parsed.cities) ? parsed.cities : [],
      units: parsed.units === "F" ? "F" : "C",
    };
  } catch {
    return { cities: [], units: "C" };
  }
}

export async function saveConfig(config: Config): Promise<void> {
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}
