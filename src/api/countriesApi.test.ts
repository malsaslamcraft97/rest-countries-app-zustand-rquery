import { fetchCountries } from "./countriesApi";

describe("countriesApi", () => {
  it("returns countries in expected shape", async () => {
    const data = await fetchCountries();

    expect(data.length).toBeGreaterThan(0);

    const country = data[0];

    expect(country).toMatchObject({
      name: { common: expect.any(String) },
      population: expect.any(Number),
      region: expect.any(String),
      flags: { png: expect.any(String) },
    });
  });

  it("throws error when both APIs fail", async () => {
    const { server } = await import("../mocks/server");
    const { http, HttpResponse } = await import("msw");

    server.use(
      http.get("https://restcountries.com/v3.1/all", () => {
        return new HttpResponse(null, { status: 500 });
      }),
      http.get(
        "https://raw.githubusercontent.com/mledoze/countries/master/countries.json",
        () => {
          return new HttpResponse(null, { status: 500 });
        },
      ),
    );

    await expect(fetchCountries()).rejects.toThrow();
  });
});
