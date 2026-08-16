import { describe, test, expect, afterEach } from "bun:test";
import { geocode } from "../../src/api/geocoding.ts";
import { installFetchMock } from "../helpers.ts";

let restoreFetch: (() => void) | null = null;

afterEach(() => {
  restoreFetch?.();
  restoreFetch = null;
});

describe("geocode", () => {
  test("mapea results[0] a City", async () => {
    restoreFetch = installFetchMock(async () =>
      new Response(
        JSON.stringify({
          results: [{ name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada" }],
        }),
        { status: 200 }
      )
    );
    const city = await geocode("Ottawa");
    expect(city).toEqual({
      name: "Ottawa", latitude: 45.4, longitude: -75.7, country: "Canada",
    });
  });

  test("sin results → null", async () => {
    restoreFetch = installFetchMock(async () =>
      new Response(JSON.stringify({ results: [] }), { status: 200 })
    );
    expect(await geocode("nope")).toBeNull();
  });

  test("no-ok → throws", async () => {
    restoreFetch = installFetchMock(async () => new Response("err", { status: 500 }));
    await expect(geocode("x")).rejects.toThrow();
  });

  test("URL contiene name, count=1, language=es, format=json + encodeURIComponent", async () => {
    let url = "";
    restoreFetch = installFetchMock(async (input) => {
      url = String(input);
      return new Response(JSON.stringify({ results: [] }), { status: 200 });
    });
    await geocode("San José");
    expect(url).toContain("name=San%20Jos%C3%A9");
    expect(url).toContain("count=1");
    expect(url).toContain("language=es");
    expect(url).toContain("format=json");
  });
});