#!/usr/bin/env node
/**
 * fetch-airbnb-prices.mjs — Fetch median nightly prices from InsideAirbnb
 *
 * Source: InsideAirbnb.com (CC BY 4.0 / CC0)
 * Uses summary listings.csv which contains per-listing price data.
 * Only "Entire home/apt" listings are used for median calculation.
 *
 * Output: data/sources/airbnb-prices.json
 *
 * Usage:
 *   node scripts/fetch-airbnb-prices.mjs
 *   node scripts/fetch-airbnb-prices.mjs --dry-run   # show URLs only
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { parse } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE_PATH = join(ROOT, "data/cities-source.json");
const OUTPUT_PATH = join(ROOT, "data/sources/airbnb-prices.json");
const DRY_RUN = process.argv.includes("--dry-run");

// ═══════════════════════════════════════════════════════════════
// City → InsideAirbnb URL mapping
// cityId matches data/cities-source.json id
// localCurrency: the currency Airbnb prices are listed in
// Dates are from the latest available data on insideairbnb.com/get-the-data/
// ═══════════════════════════════════════════════════════════════
const AIRBNB_MAPPING = {
  // United States (prices in USD)
  1:   { slug: "new-york-city",  country: "united-states", region: "ny", date: "2026-02-13", cur: "USD" },
  11:  { slug: "los-angeles",    country: "united-states", region: "ca", date: "2025-12-04", cur: "USD" },
  12:  { slug: "san-francisco",  country: "united-states", region: "ca", date: "2025-12-04", cur: "USD" },
  13:  { slug: "chicago",        country: "united-states", region: "il", date: "2025-09-22", cur: "USD" },
  37:  { slug: "seattle",        country: "united-states", region: "wa", date: "2025-09-25", cur: "USD" },
  36:  { slug: "boston",          country: "united-states", region: "ma", date: "2025-12-27", cur: "USD" },
  35:  { slug: "washington-dc",  country: "united-states", region: "dc", date: "2025-09-22", cur: "USD" },
  38:  { slug: "denver",         country: "united-states", region: "co", date: "2025-09-29", cur: "USD" },
  39:  { slug: "austin",         country: "united-states", region: "tx", date: "2025-09-16", cur: "USD" },
  97:  { slug: "portland",       country: "united-states", region: "or", date: "2025-12-04", cur: "USD" },
  98:  { slug: "san-diego",      country: "united-states", region: "ca", date: "2025-09-25", cur: "USD" },
  133: { slug: "santa-clara-county", country: "united-states", region: "ca", date: "2025-12-28", cur: "USD" },

  // Canada (prices in CAD)
  9:   { slug: "toronto",       country: "canada", region: "on", date: "2026-01-16", cur: "CAD" },
  40:  { slug: "vancouver",     country: "canada", region: "bc", date: "2026-01-18", cur: "CAD" },
  41:  { slug: "montreal",      country: "canada", region: "qc", date: "2025-12-22", cur: "CAD" },
  135: { slug: "ottawa",        country: "canada", region: "on", date: "2025-09-22", cur: "CAD" },

  // United Kingdom (prices in GBP)
  2:   { slug: "london",        country: "united-kingdom", region: "england", date: "2025-09-14", cur: "GBP" },

  // France (prices in EUR)
  8:   { slug: "paris",         country: "france",   region: "ile-de-france",   date: "2025-09-12", cur: "EUR" },

  // Germany (prices in EUR)
  19:  { slug: "berlin",        country: "germany",  region: "be",  date: "2025-09-23", cur: "EUR" },
  18:  { slug: "munich",        country: "germany",  region: "by",  date: "2025-09-27", cur: "EUR" },

  // Netherlands (prices in EUR)
  15:  { slug: "amsterdam",     country: "the-netherlands", region: "north-holland", date: "2025-09-11", cur: "EUR" },

  // Japan (prices in JPY)
  3:   { slug: "tokyo",         country: "japan", region: "kantō",  date: "2025-09-29", cur: "JPY" },
  106: { slug: "osaka",         country: "japan", region: "kansai", date: "2025-09-29", cur: "JPY" },

  // Spain (prices in EUR)
  20:  { slug: "barcelona",     country: "spain", region: "catalonia",        date: "2025-12-14", cur: "EUR" },
  21:  { slug: "madrid",        country: "spain", region: "comunidad-de-madrid", date: "2025-09-14", cur: "EUR" },
  144: { slug: "valencia",      country: "spain", region: "valencia",         date: "2025-09-23", cur: "EUR" },

  // Italy (prices in EUR)
  22:  { slug: "milan",         country: "italy", region: "lombardy", date: "2025-09-22", cur: "EUR" },
  23:  { slug: "rome",          country: "italy", region: "lazio",    date: "2025-09-14", cur: "EUR" },

  // Portugal (prices in EUR)
  28:  { slug: "lisbon",        country: "portugal", region: "lisbon", date: "2025-12-25", cur: "EUR" },
  143: { slug: "porto",         country: "portugal", region: "norte",  date: "2025-12-25", cur: "EUR" },

  // Australia (prices in AUD)
  6:   { slug: "sydney",        country: "australia", region: "nsw", date: "2025-09-12", cur: "AUD" },
  42:  { slug: "melbourne",     country: "australia", region: "vic", date: "2025-09-12", cur: "AUD" },
  43:  { slug: "brisbane",      country: "australia", region: "qld", date: "2026-01-16", cur: "AUD" },

  // Singapore (prices in SGD)
  7:   { slug: "singapore",     country: "singapore", region: "singapore", date: "2025-09-28", cur: "SGD" },

  // Thailand (prices in THB)
  45:  { slug: "bangkok",       country: "thailand", region: "central-thailand", date: "2025-09-26", cur: "THB" },

  // Turkey (prices in TRY)
  30:  { slug: "istanbul",      country: "turkey", region: "marmara", date: "2025-09-29", cur: "TRY" },

  // Greece (prices in EUR)
  29:  { slug: "athens",        country: "greece", region: "attica", date: "2025-09-26", cur: "EUR" },

  // Austria (prices in EUR)
  25:  { slug: "vienna",        country: "austria", region: "vienna", date: "2025-09-14", cur: "EUR" },

  // Denmark (prices in DKK)
  122: { slug: "copenhagen",    country: "denmark", region: "hovedstaden", date: "2025-09-29", cur: "DKK" },

  // Czech Republic (prices in CZK)
  26:  { slug: "prague",        country: "czech-republic", region: "prague", date: "2025-09-23", cur: "CZK" },

  // Sweden (prices in SEK)
  121: { slug: "stockholm",     country: "sweden", region: "stockholms-län", date: "2025-09-29", cur: "SEK" },

  // Norway (prices in NOK)
  124: { slug: "oslo",          country: "norway", region: "oslo", date: "2025-09-29", cur: "NOK" },

  // Switzerland (prices in CHF)
  16:  { slug: "zurich",        country: "switzerland", region: "zürich", date: "2025-09-29", cur: "CHF" },
  17:  { slug: "geneva",        country: "switzerland", region: "geneva", date: "2025-09-28", cur: "CHF" },

  // Ireland (prices in EUR)
  93:  { slug: "dublin",        country: "ireland", region: "leinster", date: "2025-09-16", cur: "EUR" },

  // Belgium (prices in EUR)
  24:  { slug: "brussels",      country: "belgium", region: "brussels", date: "2025-09-23", cur: "EUR" },

  // Hungary (prices in HUF)
  90:  { slug: "budapest",      country: "hungary", region: "közép-magyarország", date: "2025-09-25", cur: "HUF" },

  // Latvia (prices in EUR)
  163: { slug: "riga",          country: "latvia", region: "riga", date: "2025-09-29", cur: "EUR" },

  // Mexico (prices in MXN)
  31:  { slug: "mexico-city",   country: "mexico", region: "distrito-federal", date: "2025-09-27", cur: "MXN" },

  // Brazil (prices in BRL)
  33:  { slug: "rio-de-janeiro", country: "brazil", region: "rj", date: "2025-09-26", cur: "BRL" },

  // Argentina (prices in ARS — but often listed in USD)
  62:  { slug: "buenos-aires",  country: "argentina", region: "ciudad-autónoma-de-buenos-aires", date: "2026-01-25", cur: "USD" },

  // South Africa (prices in ZAR)
  68:  { slug: "cape-town",     country: "south-africa", region: "wc", date: "2025-09-28", cur: "ZAR" },

  // Taiwan (prices in TWD)
  61:  { slug: "taipei",        country: "taiwan", region: "northern-taiwan", date: "2025-09-30", cur: "TWD" },

  // Hong Kong (prices in HKD)
  10:  { slug: "hong-kong",     country: "china", region: "hong-kong", date: "2025-09-23", cur: "HKD" },
};

// ═══════════════════════════════════════════════════════════════
// CSV parser (minimal, handles quoted fields)
// ═══════════════════════════════════════════════════════════════
function parseCSVRow(line) {
  const fields = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { current += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { fields.push(current); current = ""; }
      else { current += ch; }
    }
  }
  fields.push(current);
  return fields;
}

// ═══════════════════════════════════════════════════════════════
// Fetch and parse a single city's Airbnb data
// ═══════════════════════════════════════════════════════════════
async function fetchCityAirbnb(cityId, mapping) {
  const url = `http://data.insideairbnb.com/${mapping.country}/${mapping.region}/${mapping.slug}/${mapping.date}/visualisations/listings.csv`;

  if (DRY_RUN) {
    console.log(`  [${cityId}] ${url}`);
    return null;
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) {
      console.log(`  [${cityId}] ${mapping.slug}: HTTP ${res.status}`);
      return null;
    }

    const text = await res.text();
    const lines = text.split("\n").filter(l => l.trim());
    if (lines.length < 2) return null;

    const headers = parseCSVRow(lines[0]);
    const priceIdx = headers.indexOf("price");
    const roomTypeIdx = headers.indexOf("room_type");

    if (priceIdx === -1) {
      console.log(`  [${cityId}] ${mapping.slug}: no price column`);
      return null;
    }

    const prices = [];
    for (let i = 1; i < lines.length; i++) {
      const fields = parseCSVRow(lines[i]);
      const price = parseFloat(fields[priceIdx]);
      const roomType = fields[roomTypeIdx] || "";
      if (!isNaN(price) && price > 0 && roomType === "Entire home/apt") {
        prices.push(price);
      }
    }

    if (prices.length < 10) {
      console.log(`  [${cityId}] ${mapping.slug}: only ${prices.length} listings with price`);
      return null;
    }

    prices.sort((a, b) => a - b);
    const median = prices[Math.floor(prices.length / 2)];
    const p25 = prices[Math.floor(prices.length * 0.25)];
    const p75 = prices[Math.floor(prices.length * 0.75)];

    console.log(`  [${cityId}] ${mapping.slug}: ${prices.length} listings, median=${median} ${mapping.cur}`);
    return {
      medianNightly: Math.round(median),
      localCurrency: mapping.cur,
      listingCount: prices.length,
      p25: Math.round(p25),
      p75: Math.round(p75),
      dataDate: mapping.date,
      url,
    };
  } catch (err) {
    console.log(`  [${cityId}] ${mapping.slug}: ${err.message}`);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log("═══ InsideAirbnb Price Fetcher ═══\n");

  // Load city names for display
  const sourceData = JSON.parse(readFileSync(SOURCE_PATH, "utf-8"));
  const cityNames = {};
  for (const c of sourceData.cities) {
    cityNames[c.id] = c.name;
  }

  const results = {};
  const ids = Object.keys(AIRBNB_MAPPING).map(Number).sort((a, b) => a - b);

  console.log(`Fetching ${ids.length} cities...\n`);

  // Fetch sequentially to be respectful of the server
  for (const id of ids) {
    const mapping = AIRBNB_MAPPING[id];
    const result = await fetchCityAirbnb(id, mapping);
    if (result) {
      results[id] = result;
    }
    // Rate limiting: 500ms between requests
    if (!DRY_RUN) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (DRY_RUN) {
    console.log("\nDry run complete.");
    return;
  }

  // Save results
  const outputDir = dirname(OUTPUT_PATH);
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  const output = {
    source: "InsideAirbnb.com",
    license: "CC BY 4.0 / CC0",
    fetchDate: new Date().toISOString().split("T")[0],
    description: "Median nightly price for 'Entire home/apt' listings",
    totalCities: ids.length,
    citiesWithData: Object.keys(results).length,
    data: results,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf-8");
  console.log(`\n✅ Saved ${Object.keys(results).length}/${ids.length} cities → ${OUTPUT_PATH}`);
}

main().catch(console.error);
