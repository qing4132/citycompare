#!/usr/bin/env node
/**
 * fetch-wb-safety-data.mjs — Fetch World Bank data for safety index redesign
 *
 * Fetches ALL countries at once (4 API calls total), then maps to our cities.
 * Indicators (all CC BY 4.0):
 *   - VC.IHR.PSRC.P5  Intentional homicides per 100k
 *   - PV.PER.RNK      Political Stability percentile rank 0-100
 *   - RL.PER.RNK      Rule of Law percentile rank 0-100
 *   - CC.PER.RNK      Control of Corruption percentile rank 0-100
 *
 * Also clears all Numbeo-sourced data and other tainted fields.
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOURCE_PATH = join(ROOT, "data/cities-source.json");

const COUNTRY_ISO = {
  "美国": "US", "中国": "CN", "中国香港": "HK", "台湾": null,
  "日本": "JP", "韩国": "KR", "英国": "GB", "德国": "DE",
  "法国": "FR", "加拿大": "CA", "澳大利亚": "AU", "新加坡": "SG",
  "荷兰": "NL", "瑞士": "CH", "瑞典": "SE", "挪威": "NO",
  "丹麦": "DK", "芬兰": "FI", "爱尔兰": "IE", "奥地利": "AT",
  "比利时": "BE", "卢森堡": "LU", "西班牙": "ES", "意大利": "IT",
  "葡萄牙": "PT", "希腊": "GR", "波兰": "PL", "捷克": "CZ",
  "匈牙利": "HU", "罗马尼亚": "RO", "保加利亚": "BG", "克罗地亚": "HR",
  "斯洛伐克": "SK", "斯洛文尼亚": "SI", "爱沙尼亚": "EE", "立陶宛": "LT",
  "拉脱维亚": "LV", "塞尔维亚": "RS", "塞浦路斯": "CY",
  "新西兰": "NZ", "以色列": "IL", "阿联酋": "AE", "卡塔尔": "QA",
  "沙特阿拉伯": "SA", "巴林": "BH", "阿曼": "OM", "约旦": "JO",
  "土耳其": "TR", "印度": "IN", "印度尼西亚": "ID", "泰国": "TH",
  "越南": "VN", "菲律宾": "PH", "马来西亚": "MY", "柬埔寨": "KH",
  "缅甸": "MM", "孟加拉国": "BD", "尼泊尔": "NP", "斯里兰卡": "LK",
  "巴基斯坦": "PK", "哈萨克斯坦": "KZ", "乌兹别克斯坦": "UZ",
  "蒙古": "MN", "格鲁吉亚": "GE", "阿塞拜疆": "AZ",
  "俄罗斯": "RU", "乌克兰": "UA", "伊朗": "IR", "黎巴嫩": "LB",
  "埃及": "EG", "摩洛哥": "MA", "南非": "ZA", "肯尼亚": "KE",
  "尼日利亚": "NG", "加纳": "GH", "埃塞俄比亚": "ET",
  "巴西": "BR", "墨西哥": "MX", "阿根廷": "AR", "哥伦比亚": "CO",
  "智利": "CL", "秘鲁": "PE", "乌拉圭": "UY", "哥斯达黎加": "CR",
  "巴拿马": "PA", "厄瓜多尔": "EC", "多米尼加": "DO",
  "波多黎各": "PR",
};

async function fetchAllCountries(indicator, source) {
  let url = `https://api.worldbank.org/v2/country/all/indicator/${indicator}?format=json&date=2018:2024&per_page=5000`;
  if (source) url += `&source=${source}`;
  console.log(`  Fetching ${indicator}...`);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 30000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timeout);
      if (!res.ok) { console.log(`    HTTP ${res.status}`); return {}; }
      const json = await res.json();
      if (!json[1]) { console.log(`    No data`); return {}; }
      // Group by ISO2 country code, take most recent non-null value
      const byCountry = {};
      for (const entry of json[1]) {
        const iso2 = entry.country?.id;
        if (!iso2 || entry.value == null) continue;
        if (!byCountry[iso2] || parseInt(entry.date) > parseInt(byCountry[iso2].year)) {
          byCountry[iso2] = { value: Math.round(entry.value * 100) / 100, year: entry.date };
        }
      }
      console.log(`    Got ${Object.keys(byCountry).length} countries`);
      return byCountry;
    } catch (e) {
      console.log(`    Attempt ${attempt + 1} failed: ${e.message}`);
      if (attempt < 2) await new Promise(r => setTimeout(r, 2000));
    }
  }
  return {};
}

async function main() {
  console.log("═══ Fetch World Bank Safety Data (bulk) ═══\n");

  const sourceData = JSON.parse(readFileSync(SOURCE_PATH, "utf-8"));
  const cities = sourceData.cities;
  console.log(`${cities.length} cities in source\n`);

  // 4 API calls total (all countries at once)
  // WGI indicators use source=3 and GOV_WGI_ prefix with .SC (0-100 score)
  const [homicideData, pvData, rlData, ccData] = await Promise.all([
    fetchAllCountries("VC.IHR.PSRC.P5", null),
    fetchAllCountries("GOV_WGI_PV.SC", 3),
    fetchAllCountries("GOV_WGI_RL.SC", 3),
    fetchAllCountries("GOV_WGI_CC.SC", 3),
  ]);

  let stats = { homicide: 0, pv: 0, rl: 0, cc: 0, noIso: 0 };

  for (const city of cities) {
    const iso = COUNTRY_ISO[city.country];

    // ── Clear ALL tainted data ──
    city.costModerate = null;
    city.costBudget = null;
    city.monthlyRent = null;
    city.housePrice = null;
    city.internetSpeedMbps = null;
    delete city.numbeoSafetyIndex;
    delete city.gpiScore;
    delete city.gallupLawOrder;

    if (!iso) {
      stats.noIso++;
      city.homicideRate = null;
      city.politicalStability = null;
      city.ruleLawWGI = null;
      city.controlOfCorruption = null;
      continue;
    }

    // ── Apply WB data ──
    city.homicideRate = homicideData[iso]?.value ?? null;
    if (homicideData[iso]) stats.homicide++;

    city.politicalStability = pvData[iso]?.value ?? null;
    if (pvData[iso]) stats.pv++;

    city.ruleLawWGI = rlData[iso]?.value ?? null;
    if (rlData[iso]) stats.rl++;

    city.controlOfCorruption = ccData[iso]?.value ?? null;
    if (ccData[iso]) stats.cc++;
  }

  writeFileSync(SOURCE_PATH, JSON.stringify(sourceData, null, 2) + "\n", "utf-8");

  console.log(`\n═══ Results ═══`);
  console.log(`homicideRate:        ${stats.homicide}/${cities.length} cities`);
  console.log(`politicalStability:  ${stats.pv}/${cities.length} cities`);
  console.log(`ruleLawWGI:          ${stats.rl}/${cities.length} cities`);
  console.log(`controlOfCorruption: ${stats.cc}/${cities.length} cities`);
  console.log(`No ISO (台湾):       ${stats.noIso} cities`);
  console.log(`\nCleared: costModerate, costBudget, monthlyRent, housePrice, internetSpeedMbps`);
  console.log(`Removed: numbeoSafetyIndex, gpiScore, gallupLawOrder`);
  console.log(`\n✅ Written to ${SOURCE_PATH}`);
}

main().catch(console.error);
