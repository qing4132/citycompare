#!/usr/bin/env node
/**
 * validate-cost-model.mjs — Compute accuracy metrics vs Numbeo ground truth
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const nb = JSON.parse(readFileSync(join(ROOT, "_archive/scripts-numbeo/numbeo-audit/fetched-data.json"), "utf-8"));
const src = JSON.parse(readFileSync(join(ROOT, "data/cities-source.json"), "utf-8"));
const inputs = JSON.parse(readFileSync(join(ROOT, "data/sources/cost-model-inputs.json"), "utf-8"));
const comp = JSON.parse(readFileSync(join(ROOT, "_archive/scripts-numbeo/numbeo-audit/comparisons.json"), "utf-8"));

const { usRPP, countryToISO, eurostatPLI } = inputs;
const cityPages = nb.cityPages || {};

// Determine tier
function getTier(city) {
  if (city.country === "美国" && usRPP[city.name] != null) return 1;
  const iso = countryToISO[city.country];
  if (iso && eurostatPLI[iso] != null) return 2;
  // Tier 3 check would require airbnb data; simplified
  return 4;
}

// Build validation pairs
const pairs = [];
for (const city of src.cities) {
  const cp = cityPages[city.id];
  if (!cp || !cp.singlePersonMonthlyCost || !cp.rent1BRCenter) continue;
  const actual = Math.round(cp.singlePersonMonthlyCost + cp.rent1BRCenter);
  const predicted = city.costModerate;
  if (!predicted || !actual || actual <= 0) continue;

  pairs.push({
    id: city.id, name: city.name, country: city.country,
    tier: getTier(city),
    predicted, actual,
    error: Math.abs(predicted - actual) / actual,
    signed: (predicted - actual) / actual,
  });
}

// Build baseline (old GDP values)
const oldPairs = [];
for (const c of comp) {
  const cp = cityPages[c.id];
  if (!cp || !cp.singlePersonMonthlyCost || !cp.rent1BRCenter) continue;
  const actual = Math.round(cp.singlePersonMonthlyCost + cp.rent1BRCenter);
  const oldCost = c.fields.costModerate ? c.fields.costModerate.old : null;
  if (!oldCost || actual <= 0) continue;
  oldPairs.push({ predicted: oldCost, actual, error: Math.abs(oldCost - actual) / actual });
}

// Also validate rent
const rentPairs = [];
for (const city of src.cities) {
  const cp = cityPages[city.id];
  if (!cp || !cp.rent1BRCenter) continue;
  const actual = Math.round(cp.rent1BRCenter);
  const predicted = city.monthlyRent;
  if (!predicted || !actual || actual <= 0) continue;
  rentPairs.push({
    name: city.name, tier: getTier(city),
    predicted, actual,
    error: Math.abs(predicted - actual) / actual,
  });
}

// Stats
function stats(arr) {
  if (arr.length === 0) return { n: 0 };
  const errors = arr.map(p => p.error).sort((a, b) => a - b);
  const predicted = arr.map(p => p.predicted);
  const actual = arr.map(p => p.actual);

  const median = errors[Math.floor(errors.length / 2)];
  const mean = errors.reduce((s, e) => s + e, 0) / errors.length;
  const p90 = errors[Math.floor(errors.length * 0.9)];

  const actualMean = actual.reduce((s, v) => s + v, 0) / actual.length;
  const ssTot = actual.reduce((s, v) => s + (v - actualMean) ** 2, 0);
  const ssRes = arr.reduce((s, p) => s + (p.actual - p.predicted) ** 2, 0);
  const r2 = 1 - ssRes / ssTot;

  return { n: arr.length, r2: r2.toFixed(3), median: (median * 100).toFixed(1), mean: (mean * 100).toFixed(1), p90: (p90 * 100).toFixed(1) };
}

function printRow(label, s) {
  if (s.n === 0) { console.log(`  ${label.padEnd(22)} (no data)`); return; }
  console.log(`  ${label.padEnd(22)} R²=${s.r2.padStart(7)}   中位=${s.median.padStart(5)}%   均值=${s.mean.padStart(5)}%   P90=${s.p90.padStart(5)}%   n=${String(s.n).padStart(3)}`);
}

// ── Print results ──
console.log("═══════════════════════════════════════════════════════════");
console.log("  M12 成本模型精度评估 (vs Numbeo 城市页面数据)");
console.log("  Ground truth = singlePersonMonthlyCost + rent1BRCenter");
console.log("═══════════════════════════════════════════════════════════\n");

console.log("── costModerate (生活成本 + 租金) ──\n");
printRow("基线 (旧 GDP 模型)", stats(oldPairs));
console.log();
printRow("M12 全部", stats(pairs));
printRow("  Tier 1 (US RPP)", stats(pairs.filter(p => p.tier === 1)));
printRow("  Tier 2 (Eurostat)", stats(pairs.filter(p => p.tier === 2)));
printRow("  Tier 4 (Income)", stats(pairs.filter(p => p.tier === 4)));

console.log("\n── monthlyRent (1BR 租金) ──\n");
printRow("M12 全部", stats(rentPairs));
printRow("  Tier 1 (US RPP)", stats(rentPairs.filter(p => p.tier === 1)));
printRow("  Tier 2 (Eurostat)", stats(rentPairs.filter(p => p.tier === 2)));
printRow("  Tier 4 (Income)", stats(rentPairs.filter(p => p.tier === 4)));

// Worst errors
console.log("\n── 误差最大的 15 个城市 ──\n");
pairs.sort((a, b) => b.error - a.error);
for (const p of pairs.slice(0, 15)) {
  const dir = p.signed > 0 ? "↑" : "↓";
  console.log(`  T${p.tier} ${(p.name + " (" + p.country + ")").padEnd(26)} pred=$${String(p.predicted).padStart(5)}  actual=$${String(p.actual).padStart(5)}  err=${(p.error * 100).toFixed(0).padStart(3)}% ${dir}`);
}

// Best fits
console.log("\n── 误差最小的 10 个城市 ──\n");
pairs.sort((a, b) => a.error - b.error);
for (const p of pairs.slice(0, 10)) {
  console.log(`  T${p.tier} ${(p.name + " (" + p.country + ")").padEnd(26)} pred=$${String(p.predicted).padStart(5)}  actual=$${String(p.actual).padStart(5)}  err=${(p.error * 100).toFixed(0).padStart(3)}%`);
}
