import { http, HttpResponse } from "msw";

export const mockCountries = Array.from({ length: 20 }).map((_, i) => ({
  name: { common: `Country ${i}` },
  population: 1000 + i,
  region: i % 2 === 0 ? "Asia" : "Europe",
  capital: [`Capital ${i}`],
  flags: { png: "https://flagcdn.com/in.png" },
}));

export const handlers = [
  http.get("https://restcountries.com/v3.1/all", () => {
    return HttpResponse.json(mockCountries);
  }),
];
