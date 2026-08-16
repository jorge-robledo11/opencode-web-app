import { homedir } from "node:os";
import { join } from "node:path";

const CONFIG_PATH = join(homedir(), ".config", "02-weather", "config.json");
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const ANSI = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
} as const;

function paint(color: keyof typeof ANSI, text: string): string {
  return `${ANSI[color]}${text}${ANSI.reset}`;
}

type City = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

type Config = {
  defaultCity?: string;
  cities: City[];
  units: "C" | "F";
};

type GeoResponse = {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
  }>;
};

type ForecastResponse = {
  current?: { temperature_2m?: number };
};

async function loadConfig(): Promise<Config> {
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

async function saveConfig(config: Config): Promise<void> {
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2));
}

async function geocode(name: string): Promise<City | null> {
  const url = `${GEO_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as GeoResponse;
  const r = data.results?.[0];
  if (!r) return null;
  return {
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
  };
}

async function currentTemp(lat: number, lon: number): Promise<number> {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as ForecastResponse;
  const t = data.current?.temperature_2m;
  if (typeof t !== "number") throw new Error("no temperature in response");
  return t;
}

function formatTemp(celsius: number, units: "C" | "F"): string {
  const text = units === "F"
    ? `${((celsius * 9) / 5 + 32).toFixed(1)} °F`
    : `${celsius.toFixed(1)} °C`;
  return paint("yellow", text);
}

function cityLabel(city: City): string {
  return city.country ? `${city.name}, ${city.country}` : city.name;
}

function renderMenu(config: Config): string {
  return `════════════════════════════════════════
         WEATHER CLI
════════════════════════════════════════
  1. Clima de ciudad default
  2. Clima de todas las ciudades (${config.cities.length})
  3. Buscar y agregar ciudad
  4. Eliminar ciudad
  5. Establecer ciudad default
  8. Ajustes (°${config.units})
  9. Salir
════════════════════════════════════════`;
}

function listCities(cities: City[]): void {
  cities.forEach((c, i) => {
    console.log(`  ${i + 1}. ${cityLabel(c)}`);
  });
}

async function showDefaultWeather(config: Config): Promise<void> {
  if (!config.defaultCity) {
    console.log(paint("red", "No hay ciudad por defecto. Usa la opción 5 para establecer una."));
    return;
  }
  const city = config.cities.find((c) => c.name === config.defaultCity);
  if (!city) {
    console.log(paint("red", `Ciudad default "${config.defaultCity}" no encontrada. Restablece con la opción 5.`));
    return;
  }
  try {
    const temp = await currentTemp(city.latitude, city.longitude);
    console.log(`${cityLabel(city)}: ${formatTemp(temp, config.units)}`);
  } catch (e) {
    console.log(paint("red", `Error de red: ${(e as Error).message}`));
  }
}

async function showAllWeather(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log(paint("red", "No hay ciudades guardadas. Usa la opción 3 para agregar."));
    return;
  }
  for (const city of config.cities) {
    try {
      const temp = await currentTemp(city.latitude, city.longitude);
      console.log(`${cityLabel(city)}: ${formatTemp(temp, config.units)}`);
    } catch (e) {
      console.log(paint("red", `${cityLabel(city)}: Error de red: ${(e as Error).message}`));
    }
  }
}

async function addCity(config: Config): Promise<void> {
  const name = prompt("Nombre de la ciudad: ");
  if (!name) return;
  try {
    const city = await geocode(name);
    if (!city) {
      console.log(paint("red", `No se encontró la ciudad: ${name}`));
      return;
    }
    const exists = config.cities.some(
      (c) => c.name === city.name && c.country === city.country
    );
    if (exists) {
      console.log(paint("red", `${cityLabel(city)} ya está guardada.`));
      return;
    }
    config.cities.push(city);
    await saveConfig(config);
    console.log(paint("green", `Agregada: ${cityLabel(city)}`));
  } catch (e) {
    console.log(paint("red", `Error de red: ${(e as Error).message}`));
  }
}

async function deleteCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log(paint("red", "No hay ciudades guardadas."));
    return;
  }
  listCities(config.cities);
  const idx = prompt("Número a eliminar: ");
  const n = Number(idx);
  if (!Number.isInteger(n) || n < 1 || n > config.cities.length) {
    console.log(paint("red", "Opción inválida."));
    return;
  }
  const removed = config.cities.splice(n - 1, 1)[0];
  if (removed && config.defaultCity === removed.name) {
    config.defaultCity = undefined;
  }
  await saveConfig(config);
  console.log(paint("green", `Eliminada: ${removed?.name ?? ""}`));
}

async function setDefaultCity(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log(paint("red", "No hay ciudades guardadas. Usa la opción 3 para agregar."));
    return;
  }
  listCities(config.cities);
  const idx = prompt("Número para establecer como default: ");
  const n = Number(idx);
  if (!Number.isInteger(n) || n < 1 || n > config.cities.length) {
    console.log(paint("red", "Opción inválida."));
    return;
  }
  const city = config.cities[n - 1];
  if (!city) return;
  config.defaultCity = city.name;
  await saveConfig(config);
  console.log(paint("green", `Ciudad default: ${cityLabel(city)}`));
}

async function toggleUnits(config: Config): Promise<void> {
  config.units = config.units === "C" ? "F" : "C";
  await saveConfig(config);
  console.log(paint("green", `Unidades: °${config.units}`));
}

async function main(): Promise<void> {
  const config = await loadConfig();
  while (true) {
    console.log(paint("cyan", renderMenu(config)));
    const choice = prompt(paint("cyan", "Selecciona una opción: "));
    switch (choice) {
      case "1":
        await showDefaultWeather(config);
        break;
      case "2":
        await showAllWeather(config);
        break;
      case "3":
        await addCity(config);
        break;
      case "4":
        await deleteCity(config);
        break;
      case "5":
        await setDefaultCity(config);
        break;
      case "8":
        await toggleUnits(config);
        break;
      case "9":
        return;
      default:
        console.log(paint("red", "Opción inválida."));
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});