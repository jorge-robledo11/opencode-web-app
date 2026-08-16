import { describe, test, expect, afterEach } from "bun:test";
import { getCurrentTemperature, getDailyForecast } from "../../src/api/weather.ts";
import { installFetchMock } from "../helpers.ts";

let restoreFetch: (() => void) | null = null;

afterEach(() => {
  restoreFetch?.();
  restoreFetch = null;
});

describe("getCurrentTemperature", () => {
  test("parsea temperature_2m", async () => {
    restoreFetch = installFetchMock(async () =>
      new Response(JSON.stringify({ current: { temperature_2m: 20.5 } }), { status: 200 })
    );
    expect(await getCurrentTemperature(0, 0)).toBe(20.5);
  });

  test("temperature_2m ausente → throws", async () => {
    restoreFetch = installFetchMock(async () =>
      new Response(JSON.stringify({ current: {} }), { status: 200 })
    );
    await expect(getCurrentTemperature(0, 0)).rejects.toThrow();
  });

  test("no-ok → throws", async () => {
    restoreFetch = installFetchMock(async () => new Response("", { status: 500 }));
    await expect(getCurrentTemperature(0, 0)).rejects.toThrow();
  });
});

describe("getDailyForecast", () => {
  test("mapea daily a DailyForecast", async () => {
    restoreFetch = installFetchMock(async () =>
      new Response(
        JSON.stringify({
          daily: {
            time: ["2026-08-16"],
            temperature_2m_max: [25.1],
            temperature_2m_min: [15.2],
            weather_code: [0],
          },
        }),
        { status: 200 }
      )
    );
    const f = await getDailyForecast(0, 0);
    expect(f.time).toEqual(["2026-08-16"]);
    expect(f.tempMax).toEqual([25.1]);
    expect(f.tempMin).toEqual([15.2]);
    expect(f.code).toEqual([0]);
  });

  test("daily incompleto → throws", async () => {
    restoreFetch = installFetchMock(async () =>
      new Response(JSON.stringify({ daily: { time: ["x"] } }), { status: 200 })
    );
    await expect(getDailyForecast(0, 0)).rejects.toThrow();
  });

  test("no-ok → throws", async () => {
    restoreFetch = installFetchMock(async () => new Response("", { status: 500 }));
    await expect(getDailyForecast(0, 0)).rejects.toThrow();
  });
});