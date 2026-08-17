import { join } from "node:path";
import { mock } from "bun:test";

const TEST_CONFIG_DIR = join(import.meta.dir, ".tmp");
export const TEST_CONFIG_PATH = join(TEST_CONFIG_DIR, "config.json");

const REAL_GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const REAL_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const REAL_WEEKDAYS_ES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

mock.module("../src/utils/constants.ts", () => ({
  CONFIG_PATH: TEST_CONFIG_PATH,
  GEO_URL: REAL_GEO_URL,
  FORECAST_URL: REAL_FORECAST_URL,
  WEEKDAYS_ES: REAL_WEEKDAYS_ES,
}));
