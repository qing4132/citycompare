#!/usr/bin/env node
/**
 * Add raw homicide rate and GPI score to cities.json.
 * Source: unodc-homicide-2024.json (per 100k), gpi-2025.json (1-5 scale)
 */
import { readFileSync, writeFileSync } from "fs";

const unodc = JSON.parse(readFileSync("_archive/data_sources/unodc-homicide-2024.json", "utf8"));
const gpiData = JSON.parse(readFileSync("_archive/data_sources/gpi-2025.json", "utf8"));
const citiesPath = "public/data/cities.json";
const data = JSON.parse(readFileSync(citiesPath, "utf8"));

let updated = 0;
for (const city of data.cities) {
  const country = city.country;
  const hRate = unodc.countries[country] ?? null;
  const gpiScore = gpiData.countries[country] ?? null;
  city.homicideRate = hRate;
  city.gpiScore = gpiScore;
  updated++;
}

writeFileSync(citiesPath, JSON.stringify(data, null, 2) + "\n", "utf8");
console.log(`Done. Updated ${updated} cities with raw homicideRate + gpiScore.`);
