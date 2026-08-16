# AGENTS.md

Bun CLI app (`02-weather`). Single entry point `index.ts` implements the interactive Weather CLI from `README.md`.

- Runtime/package manager: **Bun** (`bun install`, `bun run`, `bun test`). Do not introduce npm/yarn/pnpm. Lockfile is `bun.lock`.
- Run: `bun run index.ts` (or `bun index.ts`). Typecheck: `./node_modules/.bin/tsc` (no script wired in `package.json`).
- No `scripts` in `package.json`, no test files, no lint config. To test when added: `bun test`. To lint when added: `bun lint`.
- TypeScript: `tsconfig.json` is the bun-init default with `noEmit: true` (bun transpiles), `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax` — type-only imports must use `import type`.
- Persisted state (saved cities, default city, units) lives at `~/.config/02-weather/config.json`. `Bun.write` creates parent dirs; no mkdir needed.
- Public APIs called (no keys):
  - Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
  - Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
- Open-Meteo returns °C; the app converts to °F only at display time when units are toggled (option 8).
- Menu option 6 is "Pronóstico 7 días (ciudad default)" — single-city 7-day forecast via Open-Meteo `daily=` params (`temperature_2m_max`, `temperature_2m_min`, `weather_code`). Option 7 stays open.
- WMO weather codes (displayed in option 6) are mapped to Spanish labels in `WEATHER_CODE` (index.ts). Extend the map if Open-Meteo adds codes that show as `—`.
- End goal in the README is a standalone executable. Bun's idiomatic build is `bun build --compile index.ts --outfile weather` — only run this when actually asked.