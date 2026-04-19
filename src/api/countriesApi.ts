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

export async function fetchCountries(): Promise<Country[]> {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags",
  );

  if (!res.ok) {
    throw new Error("Failed to fetch countries");
  }

  return res.json();
}
