#!/usr/bin/env node
/**
 * compute-cost-model.mjs — M12 Tiered Cost Estimation Model
 *
 * Replaces GDP-based national averages with a 4-tier model:
 *   Tier 1: US Regional Price Parities (19 US cities, BEA public domain)
 *   Tier 2: Eurostat PLI (European + TR/JP/CH cities, CC BY 4.0)
 *   Tier 3: Airbnb median nightly price (where available, CC BY 4.0)
 *   Tier 4: Income power law × continent ratio (fallback for remaining)
 *
 * Reads:  data/cities-source.json, data/sources/cost-model-inputs.json,
 *         data/sources/airbnb-prices.json (if exists)
 * Writes: Updates costModerate and monthlyRent in data/cities-source.json
 *
 * Usage:
 *   node scripts/compute-cost-model.mjs              # compute + write
 *   node scripts/compute-cost-model.mjs --dry-run    # show changes only
 *   node scripts/compute-cost-model.mjs --validate   # compare vs Numbeo archive
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE_PATH = join(ROOT, "data/cities-source.json");
const INPUTS_PATH = join(ROOT, "data/sources/cost-model-inputs.json");
const AIRBNB_PATH = join(ROOT, "data/sources/airbnb-prices.json");
const FX_PATH = join(ROOT, "public/data/exchange-rates.json");

const DRY_RUN = process.argv.includes("--dry-run");
const VALIDATE = process.argv.includes("--validate");

// ═══════════════════════════════════════════════════════════════
// Model coefficients — calibrated via log-linear regression against Numbeo
// ═══════════════════════════════════════════════════════════════

// Tier 1: US RPP → monthly cost (USD)
// cost = baseUSCost × (RPP / 100)
// Calibrated against 18 US cities with Numbeo city-page data
const US_BASE_COST = 3567; // USD/month (cost + rent, RPP=100)
const US_BASE_RENT = 2298; // USD/month (1BR center rent, RPP=100)

// Tier 2: Eurostat PLI → monthly cost (USD)
// cost = coefficient × PLI^exponent
// Calibrated against 40 Eurostat-covered cities with Numbeo data
const PLI_COEFFICIENT = 103.8;
const PLI_EXPONENT = 0.69;
const PLI_RENT_COEFFICIENT = 33.7;
const PLI_RENT_EXPONENT = 0.80;

// Tier 3: Airbnb median nightly (USD) → monthly cost
// cost = coefficient × airbnbUSD^exponent
const AIRBNB_COST_COEFFICIENT = 28.2;
const AIRBNB_COST_EXPONENT = 0.95;
const AIRBNB_RENT_COEFFICIENT = 2.6;
const AIRBNB_RENT_EXPONENT = 1.30;

// Tier 4: Income power law
// cost = coefficient × income^exponent × (continentRatio / 0.4)
// Calibrated against 83 remaining cities with Numbeo data
const INCOME_COST_COEFFICIENT = 14.15;
const INCOME_COST_EXPONENT = 0.61;
const INCOME_RENT_COEFFICIENT = 4.131;
const INCOME_RENT_EXPONENT = 0.68;

// ═══════════════════════════════════════════════════════════════
// Load data
// ═══════════════════════════════════════════════════════════════
console.log("═══ M12 Tiered Cost Model ═══\n");

const sourceData = JSON.parse(readFileSync(SOURCE_PATH, "utf-8"));
const inputs = JSON.parse(readFileSync(INPUTS_PATH, "utf-8"));
const airbnbData = existsSync(AIRBNB_PATH)
  ? JSON.parse(readFileSync(AIRBNB_PATH, "utf-8"))
  : { data: {} };
const fxRates = existsSync(FX_PATH)
  ? JSON.parse(readFileSync(FX_PATH, "utf-8")).rates
  : {};

// Supplemental FX rates for currencies missing from exchange-rates.json
const SUPPLEMENTAL_FX = { TWD: 32.5, KRW: 1380, ARS: 1050, CLP: 950, QAR: 3.64 };
for (const [k, v] of Object.entries(SUPPLEMENTAL_FX)) {
  if (!fxRates[k]) fxRates[k] = v;
}

const { eurostatPLI, usRPP, countryToISO, continentRatios } = inputs;

console.log(`Cities: ${sourceData.cities.length}`);
console.log(`Airbnb cities: ${Object.keys(airbnbData.data).length}`);
console.log(`US RPP cities: ${Object.keys(usRPP).length}`);
console.log(`Eurostat countries: ${Object.keys(eurostatPLI).length}`);
console.log(`FX rates: ${Object.keys(fxRates).length}\n`);

// ═══════════════════════════════════════════════════════════════
// Helper: compute median income from professions
// ═══════════════════════════════════════════════════════════════
function getMedianIncome(professions) {
  if (!professions) return 0;
  const sorted = Object.values(professions).sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

// ═══════════════════════════════════════════════════════════════
// Compute costs for each city
// ═══════════════════════════════════════════════════════════════
const results = [];
const tierCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };

for (const city of sourceData.cities) {
  const id = city.id;
  const name = city.name;
  const country = city.country;
  const continent = city.continent;
  const annualIncome = getMedianIncome(city.professions);
  const monthlyIncome = annualIncome / 12;

  let cost = null;
  let rent = null;
  let tier = 0;
  let tierSource = "";

  // ── Tier 1: US Regional Price Parities ──
  if (country === "美国" && usRPP[name] != null) {
    const rpp = usRPP[name];
    cost = Math.round(US_BASE_COST * (rpp / 100));
    rent = Math.round(US_BASE_RENT * (rpp / 100));
    tier = 1;
    tierSource = `RPP=${rpp}`;
  }

  // ── Tier 2: Eurostat PLI ──
  if (tier === 0) {
    const iso = countryToISO[country];
    if (iso && eurostatPLI[iso] != null) {
      const pli = eurostatPLI[iso];
      cost = Math.round(PLI_COEFFICIENT * Math.pow(pli, PLI_EXPONENT));
      rent = Math.round(PLI_RENT_COEFFICIENT * Math.pow(pli, PLI_RENT_EXPONENT));
      tier = 2;
      tierSource = `PLI=${pli}(${iso})`;
    }
  }

  // ── Tier 3: Airbnb median nightly (converted to USD) ──
  if (tier === 0 && airbnbData.data[id]) {
    const airbnbEntry = airbnbData.data[id];
    const airbnbLocal = airbnbEntry.medianNightly;
    // Use localCurrency from Airbnb data (NOT city.currency which is always USD)
    const localCur = airbnbEntry.localCurrency || "USD";
    const fxRate = fxRates[localCur] || 1;
    const airbnbUSD = airbnbLocal / fxRate;
    if (airbnbUSD > 5) { // sanity: at least $5/night
      const airbnbCost = Math.round(AIRBNB_COST_COEFFICIENT * Math.pow(airbnbUSD, AIRBNB_COST_EXPONENT));
      const airbnbRent = Math.round(AIRBNB_RENT_COEFFICIENT * Math.pow(airbnbUSD, AIRBNB_RENT_EXPONENT));
      // Airbnb tourist pricing can overshoot for low-income cities; cap at 1.2× income
      if (monthlyIncome > 0 && airbnbCost / monthlyIncome > 1.2) {
        // Skip Airbnb tier, fall through to Tier 4
      } else {
        cost = airbnbCost;
        rent = airbnbRent;
        tier = 3;
        tierSource = `Airbnb=${airbnbLocal}${localCur}→$${Math.round(airbnbUSD)}/night`;
      }
    }
  }

  // ── Tier 4: Income power law + continent ratio ──
  if (tier === 0 && monthlyIncome > 0) {
    const ratio = continentRatios[continent] || 0.4;
    cost = Math.round(INCOME_COST_COEFFICIENT * Math.pow(monthlyIncome, INCOME_COST_EXPONENT) * (ratio / 0.4));
    rent = Math.round(INCOME_RENT_COEFFICIENT * Math.pow(monthlyIncome, INCOME_RENT_EXPONENT));
    tier = 4;
    tierSource = `income=$${Math.round(monthlyIncome)}/mo, ratio=${ratio}`;
  }

  // For Tier 2 cities with multiple cities per country, apply income-based differentiation
  if (tier === 2) {
    // Find all cities in the same country
    const sameCityCosts = sourceData.cities.filter(c => c.country === country);
    if (sameCityCosts.length > 1 && monthlyIncome > 0) {
      // Calculate income ratio relative to country median
      const countryIncomes = sameCityCosts.map(c => getMedianIncome(c.professions) / 12);
      const countryMedianIncome = countryIncomes.sort((a, b) => a - b)[Math.floor(countryIncomes.length / 2)];
      if (countryMedianIncome > 0) {
        const incomeRatio = monthlyIncome / countryMedianIncome;
        // Dampen: use sqrt to avoid extreme swings
        const adjustment = Math.sqrt(incomeRatio);
        cost = Math.round(cost * adjustment);
        rent = Math.round(rent * adjustment);
        tierSource += ` adj=${adjustment.toFixed(2)}`;
      }
    }
  }

  // Apply same income-based differentiation for Tier 1 (already city-specific via RPP)
  // No adjustment needed — RPP is already city-level

  tierCounts[tier]++;

  const oldCost = city.costModerate;
  const oldRent = city.monthlyRent;
  const costChanged = cost !== oldCost;
  const rentChanged = rent !== oldRent;

  results.push({
    id, name, country, continent, tier, tierSource,
    cost, rent, oldCost, oldRent, costChanged, rentChanged,
    monthlyIncome: Math.round(monthlyIncome),
  });
}

// ═══════════════════════════════════════════════════════════════
// Report
// ═══════════════════════════════════════════════════════════════
console.log("Tier distribution:");
console.log(`  Tier 1 (US RPP):      ${tierCounts[1]} cities`);
console.log(`  Tier 2 (Eurostat):    ${tierCounts[2]} cities`);
console.log(`  Tier 3 (Airbnb):      ${tierCounts[3]} cities`);
console.log(`  Tier 4 (Income):      ${tierCounts[4]} cities`);
console.log();

// Show changes
const changed = results.filter(r => r.costChanged || r.rentChanged);
console.log(`Changes: ${changed.length}/${results.length} cities\n`);

if (changed.length > 0) {
  console.log("City                   Tier  Old Cost → New Cost   Old Rent → New Rent");
  console.log("─".repeat(75));
  for (const r of changed.sort((a, b) => a.tier - b.tier || a.id - b.id)) {
    const nameStr = (r.name + " (" + r.country + ")").padEnd(22);
    const costStr = `$${r.oldCost || "?"} → $${r.cost}`.padEnd(20);
    const rentStr = `$${r.oldRent || "?"} → $${r.rent}`;
    console.log(`  ${nameStr} T${r.tier}    ${costStr} ${rentStr}`);
  }
  console.log();
}

// ═══════════════════════════════════════════════════════════════
// Validate: sanity check cost/income ratios
// ═══════════════════════════════════════════════════════════════
if (VALIDATE) {
  console.log("═══ Sanity Checks ═══\n");
  const warnings = [];
  for (const r of results) {
    if (r.cost && r.monthlyIncome > 0) {
      const costIncomeRatio = r.cost / r.monthlyIncome;
      if (costIncomeRatio > 1.5) {
        warnings.push(`  ⚠ ${r.name}: cost/income=${costIncomeRatio.toFixed(2)} (cost=$${r.cost}, income=$${r.monthlyIncome}/mo) — seems too high`);
      }
      if (costIncomeRatio < 0.05) {
        warnings.push(`  ⚠ ${r.name}: cost/income=${costIncomeRatio.toFixed(2)} (cost=$${r.cost}, income=$${r.monthlyIncome}/mo) — seems too low`);
      }
    }
  }
  if (warnings.length > 0) {
    console.log(`${warnings.length} warnings:\n`);
    warnings.forEach(e => console.log(e));
  } else {
    console.log("All cost/income ratios within reasonable range.");
  }
  console.log();
}

// ═══════════════════════════════════════════════════════════════
// Write results
// ═══════════════════════════════════════════════════════════════
if (DRY_RUN) {
  console.log("Dry run — no changes written.");
} else if (changed.length === 0) {
  console.log("No changes needed.");
} else {
  // Update cities-source.json
  for (const r of results) {
    const city = sourceData.cities.find(c => c.id === r.id);
    if (city && r.cost != null) {
      city.costModerate = r.cost;
    }
    if (city && r.rent != null) {
      city.monthlyRent = r.rent;
    }
  }

  writeFileSync(SOURCE_PATH, JSON.stringify(sourceData, null, 2) + "\n", "utf-8");
  console.log(`✅ Updated ${changed.length} cities in ${SOURCE_PATH}`);
  console.log("   Run 'node data/scripts/export.mjs' to regenerate frontend data.");
}
