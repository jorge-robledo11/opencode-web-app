import type { Config } from "../types/Config.ts";
import { getDailyForecast } from "../api/weather.ts";
import { findCityByName } from "../storage/citiesStorage.ts";
import { printError, printForecastDay, printPlain } from "../presentation/output.ts";
import { WEATHER_CODE, cityLabel, formatDayLabel } from "../utils/format.ts";

export async function getWeeklyForecast(config: Config): Promise<void> {
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
    const forecast = await getDailyForecast(city.latitude, city.longitude);
    printPlain(`Pronóstico 7 días — ${cityLabel(city)}:`);
    forecast.time.forEach((iso, i) => {
      const max = forecast.tempMax[i]?.toFixed(1) ?? "?";
      const min = forecast.tempMin[i]?.toFixed(1) ?? "?";
      const code = forecast.code[i];
      const desc = typeof code === "number" ? (WEATHER_CODE[code] ?? "—") : "—";
      printForecastDay(formatDayLabel(iso, i), max, min, desc);
    });
  } catch (e) {
    printError(`Error de red: ${(e as Error).message}`);
  }
}
