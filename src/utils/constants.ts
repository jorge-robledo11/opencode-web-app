import { join } from "node:path";
import { homedir } from "node:os";

export const CONFIG_PATH = join(homedir(), ".config", "02-weather", "config.json");
export const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
export const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export const WEEKDAYS_ES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"] as const;
