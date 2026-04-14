#!/usr/bin/env node
/**
 * apply-numbeo-update.mjs
 *
 * 将 Numbeo 审计数据 (fetched-data.json) 应用到 cities.json。
 * 更新字段：numbeoSafetyIndex, costModerate, costBudget, monthlyRent, housePrice
 * Numbeo 无数据时 → null
 * 更新 numbeoSafetyIndex 后自动重算 safetyIndex + safetyConfidence
 *
 * Usage:
 *   node scripts/apply-numbeo-update.mjs              # dry-run (仅打印变更)
 *   node scripts/apply-numbeo-update.mjs --apply      # 写入 cities.json
 */
import { readFileSync, writeFileSync } from "fs";

const CITIES_PATH = "public/data/cities.json";
const FETCHED_PATH = "scripts/numbeo-audit/fetched-data.json";
const DRY_RUN = !process.argv.includes("--apply");

// ── City IDs to SKIP (Numbeo matched wrong city) ──
const SKIP_IDS = new Set([
  70,  // 圣何塞(哥斯达黎加) → Numbeo matched San Jose, CA, USA
]);

// ── Load data ──
const citiesData = JSON.parse(readFileSync(CITIES_PATH, "utf-8"));
const cities = citiesData.cities;
const fetched = JSON.parse(readFileSync(FETCHED_PATH, "utf-8"));
const pages = fetched.cityPages || {};
const rankings = fetched.rankings || {};

console.log(`已加载 ${cities.length} 个城市`);
console.log(`模式: ${DRY_RUN ? "🔍 Dry-run (不写入)" : "✏️ 写入模式"}\n`);

// ── Weighted average with redistribution (same as merge-new-indicators.mjs) ──
function weightedAvg(subs) {
  const available = subs.filter(s => s.val != null);
  if (available.length === 0) return { value: null, confidence: "low", count: 0 };
  const totalWeight = available.reduce((sum, s) => sum + s.weight, 0);
  const value = available.reduce((sum, s) => sum + (s.val * s.weight / totalWeight), 0);
  const count = available.length;
  const total = subs.length;
  const confidence = count >= total ? "high" : count >= total - 1 ? "medium" : "low";
  return { value: Math.round(value * 10) / 10, confidence, count };
}

// ── Helpers ──
function r(n) { return n != null ? Math.round(n) : null; }
function r1(n) { return n != null ? Math.round(n * 10) / 10 : null; }

function diff(oldVal, newVal) {
  if (oldVal == null && newVal == null) return "";
  if (oldVal == null) return `null → ${newVal}`;
  if (newVal == null) return `${oldVal} → null`;
  const pct = ((newVal - oldVal) / oldVal * 100).toFixed(1);
  return `${oldVal} → ${newVal} (${pct >= 0 ? "+" : ""}${pct}%)`;
}

// ── Apply updates ──
const changes = { numbeoSafetyIndex: 0, costModerate: 0, costBudget: 0, monthlyRent: 0, housePrice: 0, safetyIndex: 0 };
const nullified = { numbeoSafetyIndex: 0, costModerate: 0, costBudget: 0, monthlyRent: 0, housePrice: 0 };
const details = [];

for (const city of cities) {
  const id = String(city.id);
  if (SKIP_IDS.has(city.id)) {
    details.push(`${city.name} (id=${city.id}): ⏭ 跳过 (Numbeo 匹配错误)`);
    continue;
  }
  const rank = rankings[id] || {};
  const page = pages[id] || {};
  const cityChanges = [];

  // ── 1. numbeoSafetyIndex (from ranking crime page) ──
  const newSafety = rank.safetyIndex != null ? r1(rank.safetyIndex) : null;
  if (city.numbeoSafetyIndex !== newSafety) {
    cityChanges.push(`  numbeoSafetyIndex: ${diff(city.numbeoSafetyIndex, newSafety)}`);
    changes.numbeoSafetyIndex++;
    if (newSafety == null) nullified.numbeoSafetyIndex++;
    city.numbeoSafetyIndex = newSafety;
  }

  // ── 2. costModerate (singlePersonMonthlyCost + rent1BRCenter) ──
  const newCostMod = (page.singlePersonMonthlyCost != null && page.rent1BRCenter != null)
    ? r(page.singlePersonMonthlyCost + page.rent1BRCenter)
    : null;
  if (city.costModerate !== newCostMod) {
    cityChanges.push(`  costModerate: ${diff(city.costModerate, newCostMod)}`);
    changes.costModerate++;
    if (newCostMod == null) nullified.costModerate++;
    city.costModerate = newCostMod;
  }

  // ── 3. costBudget (singlePersonMonthlyCost × 0.7 + rent1BROutside) ──
  const newCostBudget = (page.singlePersonMonthlyCost != null && page.rent1BROutside != null)
    ? r(page.singlePersonMonthlyCost * 0.7 + page.rent1BROutside)
    : null;
  if (city.costBudget !== newCostBudget) {
    cityChanges.push(`  costBudget: ${diff(city.costBudget, newCostBudget)}`);
    changes.costBudget++;
    if (newCostBudget == null) nullified.costBudget++;
    city.costBudget = newCostBudget;
  }

  // ── 4. monthlyRent (rent1BRCenter) ──
  const newRent = page.rent1BRCenter != null ? r(page.rent1BRCenter) : null;
  if (city.monthlyRent !== newRent) {
    cityChanges.push(`  monthlyRent: ${diff(city.monthlyRent, newRent)}`);
    changes.monthlyRent++;
    if (newRent == null) nullified.monthlyRent++;
    city.monthlyRent = newRent;
  }

  // ── 5. housePrice (pricePerSqmCenter) ──
  const newHP = page.pricePerSqmCenter != null ? r(page.pricePerSqmCenter) : null;
  if (city.housePrice !== newHP) {
    cityChanges.push(`  housePrice: ${diff(city.housePrice, newHP)}`);
    changes.housePrice++;
    if (newHP == null) nullified.housePrice++;
    city.housePrice = newHP;
  }

  // ── 6. Recalculate safetyIndex (only if numbeoSafetyIndex changed) ──
  const wpsNorm = city.wpsIndex != null ? city.wpsIndex * 100 : null;
  const safetySubs = [
    { val: city.numbeoSafetyIndex, weight: 0.30 },
    { val: city.homicideRateInv,   weight: 0.25 },
    { val: city.gpiScoreInv,       weight: 0.20 },
    { val: city.gallupLawOrder,    weight: 0.15 },
    { val: wpsNorm,                weight: 0.10 },
  ];
  const safety = weightedAvg(safetySubs);
  const oldSafetyIdx = city.safetyIndex;
  const oldSafetyConf = city.safetyConfidence;
  if (city.safetyIndex !== safety.value || city.safetyConfidence !== safety.confidence) {
    city.safetyIndex = safety.value;
    city.safetyConfidence = safety.confidence;
    if (oldSafetyIdx !== safety.value) {
      cityChanges.push(`  safetyIndex: ${diff(oldSafetyIdx, safety.value)} [${oldSafetyConf} → ${safety.confidence}]`);
      changes.safetyIndex++;
    }
  }

  if (cityChanges.length > 0) {
    details.push(`${city.name} (id=${city.id}):\n${cityChanges.join("\n")}`);
  }
}

// ── Report ──
console.log("═══════════════════════════════════════");
console.log("变更摘要");
console.log("═══════════════════════════════════════");
for (const [field, count] of Object.entries(changes)) {
  const nul = nullified[field] || 0;
  const extra = nul > 0 ? ` (其中 ${nul} 个置空)` : "";
  console.log(`  ${field}: ${count} 个城市变更${extra}`);
}
console.log(`\n共影响 ${details.length} 个城市\n`);

// Print details
if (details.length > 0) {
  console.log("═══════════════════════════════════════");
  console.log("详细变更");
  console.log("═══════════════════════════════════════");
  for (const d of details) {
    console.log(d);
  }
}

// ── Write ──
if (!DRY_RUN) {
  writeFileSync(CITIES_PATH, JSON.stringify(citiesData, null, 2) + "\n", "utf-8");
  console.log(`\n✅ 已写入 ${CITIES_PATH}`);
} else {
  console.log("\n💡 这是 dry-run。添加 --apply 以写入 cities.json");
}
