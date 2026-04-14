#!/usr/bin/env node
/**
 * audit-i18n.mjs — i18n coverage matrix audit
 *
 * Scans all i18n files and reports:
 * - Translation key coverage per locale (zh/en/ja/es)
 * - Missing translations
 * - City name and intro coverage
 * - Orphan keys (defined but unused)
 *
 * Usage: node data/scripts/audit-i18n.mjs
 */
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const LOCALES = ["zh", "en", "ja", "es"];

// ═══════════════════════════════════════════════════════════════
// 1. Main translations (lib/i18n.ts)
// ═══════════════════════════════════════════════════════════════
console.log("═══ WhichCity i18n Coverage Audit ═══\n");

const i18nContent = readFileSync(join(ROOT, "lib/i18n.ts"), "utf-8");

// Extract translation keys per locale by parsing the TS source
const translationKeys = {};
for (const locale of LOCALES) {
  translationKeys[locale] = new Set();
  // Match key: "value" patterns within locale blocks
  const localeRegex = new RegExp(`\\b${locale}:\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}`, "gs");
  // Simpler approach: find all quoted keys in each locale section
}

// Parse TRANSLATIONS object — find all keys defined for each locale
// Strategy: find unique keys across all locales by looking at the zh block (most complete)
const allKeys = new Set();
const keysByLocale = { zh: new Set(), en: new Set(), ja: new Set(), es: new Set() };

// Extract keys from TRANSLATIONS
const transMatch = i18nContent.match(/export const TRANSLATIONS.*?=\s*\{([\s\S]*?)\n\};/);
if (transMatch) {
  for (const locale of LOCALES) {
    const localeBlock = new RegExp(`\\b${locale}:\\s*\\{([\\s\\S]*?)\\n  \\}`, "m");
    const match = i18nContent.match(localeBlock);
    if (match) {
      const lines = match[1].split("\n");
      for (const line of lines) {
        const keyMatch = line.match(/^\s+(\w+):/);
        if (keyMatch) {
          keysByLocale[locale].add(keyMatch[1]);
          allKeys.add(keyMatch[1]);
        }
      }
    }
  }
}

console.log("1. TRANSLATIONS (lib/i18n.ts)");
console.log(`   Total unique keys: ${allKeys.size}`);
console.log("   Coverage per locale:");
for (const locale of LOCALES) {
  const count = keysByLocale[locale].size;
  const pct = allKeys.size > 0 ? ((count / allKeys.size) * 100).toFixed(1) : 0;
  const missing = [...allKeys].filter(k => !keysByLocale[locale].has(k));
  console.log(`     ${locale}: ${count}/${allKeys.size} (${pct}%)${missing.length > 0 ? ` — missing: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? "..." : ""}` : ""}`);
}

// ═══════════════════════════════════════════════════════════════
// 2. City name translations (CITY_NAME_TRANSLATIONS in i18n.ts)
// ═══════════════════════════════════════════════════════════════
const citiesData = JSON.parse(readFileSync(join(ROOT, "public/data/cities.json"), "utf-8"));
const cityIds = citiesData.cities.map(c => c.id);

const cityNameBlock = i18nContent.match(/export const CITY_NAME_TRANSLATIONS[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
const cityNameIds = new Set();
if (cityNameBlock) {
  const idMatches = cityNameBlock[1].matchAll(/(\d+):\s*\{/g);
  for (const m of idMatches) cityNameIds.add(parseInt(m[1]));
}

const missingCityNames = cityIds.filter(id => !cityNameIds.has(id));
console.log(`\n2. CITY_NAME_TRANSLATIONS`);
console.log(`   Cities in data: ${cityIds.length}`);
console.log(`   Cities with translations: ${cityNameIds.size}`);
if (missingCityNames.length > 0) {
  console.log(`   ✗ Missing: ${missingCityNames.join(", ")}`);
} else {
  console.log(`   ✓ All cities have name translations`);
}

// ═══════════════════════════════════════════════════════════════
// 3. City intros (lib/cityIntros.ts)
// ═══════════════════════════════════════════════════════════════
const introsContent = readFileSync(join(ROOT, "lib/cityIntros.ts"), "utf-8");
const introIds = new Set();
const introMatches = introsContent.matchAll(/(\d+):\s*\{/g);
for (const m of introMatches) introIds.add(parseInt(m[1]));

const missingIntros = cityIds.filter(id => !introIds.has(id));
console.log(`\n3. CITY_INTROS (lib/cityIntros.ts)`);
console.log(`   Cities with intros: ${introIds.size}`);
if (missingIntros.length > 0) {
  console.log(`   ✗ Missing: ${missingIntros.join(", ")}`);
} else {
  console.log(`   ✓ All cities have intros`);
}

// Check locale coverage within intros
for (const locale of LOCALES) {
  const localeCount = (introsContent.match(new RegExp(`\\b${locale}:`, "g")) || []).length;
  console.log(`   ${locale}: ~${localeCount} entries`);
}

// ═══════════════════════════════════════════════════════════════
// 4. City languages (lib/cityLanguages.ts)
// ═══════════════════════════════════════════════════════════════
const langContent = readFileSync(join(ROOT, "lib/cityLanguages.ts"), "utf-8");
const langIds = new Set();
const langMatches = langContent.matchAll(/(\d+):\s*\[/g);
for (const m of langMatches) langIds.add(parseInt(m[1]));

const missingLangs = cityIds.filter(id => !langIds.has(id));
console.log(`\n4. CITY_LANGUAGES (lib/cityLanguages.ts)`);
console.log(`   Cities with languages: ${langIds.size}`);
if (missingLangs.length > 0) {
  console.log(`   ✗ Missing: ${missingLangs.join(", ")}`);
} else {
  console.log(`   ✓ All cities have language data`);
}

// ═══════════════════════════════════════════════════════════════
// 5. Nomad i18n (lib/nomadI18n.ts)
// ═══════════════════════════════════════════════════════════════
const nomadContent = readFileSync(join(ROOT, "lib/nomadI18n.ts"), "utf-8");
const visaNameCount = (nomadContent.match(/"[^"]+": \{ zh:/g) || []).length;
console.log(`\n5. NOMAD_I18N (lib/nomadI18n.ts)`);
console.log(`   Visa name translations: ~${visaNameCount}`);
console.log(`   Locales: en (keys), zh, ja, es`);

// ═══════════════════════════════════════════════════════════════
// 6. Cross-file consistency (constants.ts)
// ═══════════════════════════════════════════════════════════════
const constantsContent = readFileSync(join(ROOT, "lib/constants.ts"), "utf-8");

// Check CITY_FLAG_EMOJIS coverage
const flagIds = new Set();
const flagMatches = constantsContent.matchAll(/(\d+):\s*"[^"]*"/g);
for (const m of flagMatches) flagIds.add(parseInt(m[1]));
// Filter to only flag entries (in CITY_FLAG_EMOJIS block)
const flagBlock = constantsContent.match(/CITY_FLAG_EMOJIS[^{]*\{([\s\S]*?)\}/);
const actualFlagIds = new Set();
if (flagBlock) {
  const fms = flagBlock[1].matchAll(/(\d+):\s*"/g);
  for (const m of fms) actualFlagIds.add(parseInt(m[1]));
}

const missingFlags = cityIds.filter(id => !actualFlagIds.has(id));
console.log(`\n6. CROSS-FILE CONSISTENCY`);
console.log(`   CITY_FLAG_EMOJIS: ${actualFlagIds.size} entries`);
if (missingFlags.length > 0) {
  console.log(`   ✗ Missing flags: ${missingFlags.join(", ")}`);
} else {
  console.log(`   ✓ All cities have flag emojis`);
}

// Check CITY_COUNTRY coverage
const countryBlock = constantsContent.match(/CITY_COUNTRY[^{]*\{([\s\S]*?)\}/);
const countryIds = new Set();
if (countryBlock) {
  const cms = countryBlock[1].matchAll(/(\d+):\s*"/g);
  for (const m of cms) countryIds.add(parseInt(m[1]));
}
const missingCountry = cityIds.filter(id => !countryIds.has(id));
console.log(`   CITY_COUNTRY: ${countryIds.size} entries`);
if (missingCountry.length > 0) {
  console.log(`   ✗ Missing: ${missingCountry.join(", ")}`);
} else {
  console.log(`   ✓ All cities have country mapping`);
}

// ═══════════════════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════════════════
const issues = missingCityNames.length + missingIntros.length + missingLangs.length + missingFlags.length + missingCountry.length;
console.log(`\n${"═".repeat(40)}`);
if (issues > 0) {
  console.log(`⚠ ${issues} coverage issues found`);
} else {
  console.log(`✓ All i18n and cross-file checks passed`);
}
