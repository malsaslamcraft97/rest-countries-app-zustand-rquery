import { http, HttpResponse } from "msw";

export const mockCountries = [
  {
    name: { common: "India" },
    population: 1400000000,
    region: "Asia",
    capital: ["New Delhi"],
    flags: { png: "https://flagcdn.com/in.png" },
  },
  {
    name: { common: "Germany" },
    population: 83000000,
    region: "Europe",
    capital: ["Berlin"],
    flags: { png: "https://flagcdn.com/de.png" },
  },
  {
    name: { common: "Brazil" },
    population: 210000000,
    region: "Americas",
    capital: ["Brasília"],
    flags: { png: "https://flagcdn.com/br.png" },
  },
];

export const handlers = [
  http.get("https://restcountries.com/v3.1/all", () => {
    return HttpResponse.json(mockCountries);
  }),
];
