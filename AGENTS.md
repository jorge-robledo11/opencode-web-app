# AGENTS.md

Bun CLI app (`02-weather`). Interactive Weather CLI from `README.md`, structured as a layered `src/` tree (see `references/file-system.md`).

- Runtime/package manager: **Bun** (`bun install`, `bun run`, `bun test`). Do not introduce npm/yarn/pnpm. Lockfile is `bun.lock`.
- Entry point: `src/index.ts`. Run with `bun run start` (= `bun run src/index.ts`). Typecheck: `./node_modules/.bin/tsc`.
- Layout (`src/`):
  - `actions/` — user-callable actions (`getWeather`, `getForecast`, `addCity`, `removeCity`, `setDefaultCity`, `listCities`, `toggleUnits`).
  - `presentation/` — CLI facade: `menu.ts` (render + option selection), `output.ts` (sole console facade), `input.ts` (sole prompt facade with validation).
  - `storage/` — `settingsStorage.ts` owns I/O of `~/.config/02-weather/config.json`; `citiesStorage.ts` holds city CRUD helpers.
  - `types/` — domain types (`City`, `Config`, `Units`, `DailyForecast`, `MenuOption`). API wire types stay local to `api/`.
  - `api/` — `geocoding.ts`, `weather.ts` (Open-Meteo).
  - `utils/` — `constants.ts` (URLs + paths), `colors.ts` (ANSI + `paint`), `format.ts` (`WEATHER_CODE`, `formatTemp`, `cityLabel`, `formatDayLabel`).
- TypeScript: `tsconfig.json` is the bun-init default with `noEmit: true` (bun transpiles), `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax` — type-only imports must use `import type`. Relative imports use `.ts` extensions.
- Persisted state (saved cities, default city, units) lives at `~/.config/02-weather/config.json`. `Bun.write` creates parent dirs; no mkdir needed.
- Public APIs called (no keys):
  - Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
  - Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
  - 7-day forecast: same endpoint with `daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=7&timezone=auto`.
- Open-Meteo returns °C; the app converts to °F only at display time when units are toggled (option 8).
- Menu option 6 is "Pronóstico 7 días (ciudad default)" — single-city 7-day forecast. Option 7 stays open.
- WMO weather codes (displayed in option 6) are mapped to Spanish labels in `WEATHER_CODE` (`utils/format.ts`). Extend the map if Open-Meteo adds codes that show as `—`.
- End goal in the README is a standalone executable. Bun's idiomatic build is `bun run build` (= `bun test && bun build --compile src/index.ts --outfile weather`) — only run when actually asked. The `bun test` prefix gates the build: if any test fails, the binary is **not** produced.

## Testing

- Runner: `bun test` (built-in, no extra deps). Config: `bunfig.toml` pins `root = "tests"` so `bun test` scans only `tests/`.
- Layout (`tests/`, mirrors `src/`):
  - `utils/` — `colors.test.ts`, `constants.test.ts`, `format.test.ts`.
  - `storage/` — `citiesStorage.test.ts`, `settingsStorage.test.ts`.
  - `api/` — `geocoding.test.ts`, `weather.test.ts` (mock `fetch`).
  - `presentation/` — `menu.test.ts`, `output.test.ts` (spy `console.log`), `input.test.ts` (mock `prompt`).
  - `actions/` — integration tests per action (`addCity`, `removeCity`, `setDefaultCity`, `toggleUnits`, `getDefaultWeather`, `getAllWeather`, `getWeeklyForecast`, `listCities`) using `tests/helpers.ts` utilities.
- `tests/helpers.ts` centralizes the test infrastructure:
  - Top-level `mock.module("../src/utils/constants.ts", ...)` redirects `CONFIG_PATH` to `tests/.tmp/config.json` so persistence tests never touch `~/.config/`. Other constant exports (`GEO_URL`, `FORECAST_URL`, `WEEKDAYS_ES`) are duplicated in the helper; `constants.test.ts` guards that the real values match.
  - `installFetchMock(impl)` / `installPromptMock(impl)` / `installConsoleSpy()` — each returns a `restore` fn to be called in `afterEach`.
  - `resetTestConfig()` — deletes the tmp config before each test.
- Scripts (`package.json`):
  - `bun test` — run the suite.
  - `bun test:watch` — watch mode.
  - `bun run build` — gated: runs `bun test && bun build --compile ...`.
- `tests/.tmp/` is git-ignored.
- Production code is **not** modified for testability.
