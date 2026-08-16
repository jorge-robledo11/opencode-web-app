import type { Config } from "./types/Config.ts";
import type { MenuOption } from "./types/MenuOption.ts";
import { loadConfig } from "./storage/settingsStorage.ts";
import { promptMenuChoice } from "./presentation/menu.ts";
import { printError } from "./presentation/output.ts";
import { getDefaultWeather, getAllWeather } from "./actions/getWeather.ts";
import { getWeeklyForecast } from "./actions/getForecast.ts";
import { addCity } from "./actions/addCity.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { toggleUnits } from "./actions/toggleUnits.ts";

async function main(): Promise<void> {
  const config = await loadConfig();
  while (true) {
    const options: MenuOption[] = [
      { key: "1", label: "Clima de ciudad default" },
      { key: "2", label: `Clima de todas las ciudades (${config.cities.length})` },
      { key: "3", label: "Buscar y agregar ciudad" },
      { key: "4", label: "Eliminar ciudad" },
      { key: "5", label: "Establecer ciudad default" },
      { key: "6", label: "Pronóstico 7 días (ciudad default)" },
      { key: "8", label: `Ajustes (°${config.units})` },
      { key: "9", label: "Salir" },
    ];
    const choice = await promptMenuChoice(options);
    if (choice == null) {
      printError("Opción inválida.");
      continue;
    }
    switch (choice) {
      case "1": await getDefaultWeather(config); break;
      case "2": await getAllWeather(config); break;
      case "3": await addCity(config); break;
      case "4": await removeCity(config); break;
      case "5": await setDefaultCity(config); break;
      case "6": await getWeeklyForecast(config); break;
      case "8": await toggleUnits(config); break;
      case "9": return;
      default: printError("Opción inválida.");
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
