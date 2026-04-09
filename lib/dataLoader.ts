import { readFileSync } from "fs";
import { join } from "path";
import type { City } from "./types";

// Re-export shared utilities used by server pages
export { getCityEnName, getCountryEnName, getCityLocaleName, getCountryLocaleName } from "./clientUtils";

let _cities: City[] | null = null;

/** Load cities data from JSON file (server-side only, cached per process) */
export function loadCities(): City[] {
  if (_cities) return _cities;
  try {
    const filePath = join(process.cwd(), "public", "data", "cities.json");
    const raw = readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.cities || !Array.isArray(parsed.cities)) {
      throw new Error("Invalid cities.json: missing or non-array 'cities' field");
    }
    _cities = parsed.cities as City[];
    return _cities;
  } catch (err) {
    console.error("Failed to load cities.json:", err);
    return [];
  }
}

export function getCityById(id: number): City | undefined {
  return loadCities().find((c) => c.id === id);
}
