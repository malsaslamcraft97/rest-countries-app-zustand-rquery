export type Country = {
  name: {
    common: string;
  };
  population: number;
  region: string;
  capital?: string[];
  flags: {
    png: string;
  };
};

const PRIMARY =
  "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags";

const FALLBACK =
  "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

function mapFallbackCountry(c: any): Country {
  return {
    name: {
      common: c.name?.common || "Unknown",
    },
    population: c.population ?? 0,
    region: c.region || "Unknown",
    capital: c.capital ? [c.capital].flat() : [],
    flags: {
      png: c.flags?.png || c.flags?.svg || "",
    },
  };
}

export async function fetchCountries(): Promise<Country[]> {
  try {
    const res = await fetch(PRIMARY);
    if (!res.ok) throw new Error("Primary failed");

    return await res.json();
  } catch (err) {
    console.warn("Primary API failed, using fallback");

    const res = await fetch(FALLBACK);
    if (!res.ok) {
      throw new Error("Both APIs failed");
    }

    const data = await res.json();
    return data.map(mapFallbackCountry);
  }
}
