#!/usr/bin/env node
/**
 * Fetch 3 new data sources and add them to cities-source.json:
 * 1. GPI (Global Peace Index) — from scraped table
 * 2. RSF Press Freedom Index — from downloaded CSV
 * 3. GDP Growth Rate — from World Bank API
 *
 * New fields per city:
 *   gpiScore: number | null      — GPI overall score (1-5, lower = more peaceful)
 *   pressFreedomScore: number | null — RSF score (0-100, higher = more free)
 *   gdpGrowthRate: number | null — Annual real GDP growth %
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const SOT_PATH = join(process.cwd(), "data", "cities-source.json");
const CITIES_PATH = join(process.cwd(), "public", "data", "cities.json");

// ── Country name mapping: our Chinese country names → English ──
const COUNTRY_EN = {
  "美国": "United States", "英国": "United Kingdom", "日本": "Japan", "中国": "China",
  "新加坡": "Singapore", "德国": "Germany", "法国": "France", "加拿大": "Canada",
  "澳大利亚": "Australia", "瑞士": "Switzerland", "荷兰": "Netherlands", "瑞典": "Sweden",
  "丹麦": "Denmark", "芬兰": "Finland", "挪威": "Norway", "爱尔兰": "Ireland",
  "比利时": "Belgium", "奥地利": "Austria", "西班牙": "Spain", "意大利": "Italy",
  "葡萄牙": "Portugal", "希腊": "Greece", "捷克": "Czechia", "波兰": "Poland",
  "匈牙利": "Hungary", "罗马尼亚": "Romania", "保加利亚": "Bulgaria", "克罗地亚": "Croatia",
  "斯洛文尼亚": "Slovenia", "斯洛伐克": "Slovakia", "爱沙尼亚": "Estonia", "卢森堡": "Luxembourg",
  "韩国": "South Korea", "台湾": "Taiwan", "中国香港": "Hong Kong",
  "印度": "India", "泰国": "Thailand", "马来西亚": "Malaysia", "印度尼西亚": "Indonesia",
  "越南": "Vietnam", "菲律宾": "Philippines", "柬埔寨": "Cambodia", "缅甸": "Myanmar",
  "巴基斯坦": "Pakistan", "孟加拉": "Bangladesh", "斯里兰卡": "Sri Lanka", "尼泊尔": "Nepal",
  "新西兰": "New Zealand", "阿联酋": "United Arab Emirates", "卡塔尔": "Qatar",
  "巴林": "Bahrain", "沙特阿拉伯": "Saudi Arabia", "阿曼": "Oman", "黎巴嫩": "Lebanon",
  "约旦": "Jordan", "以色列": "Israel", "伊朗": "Iran", "土耳其": "Turkiye",
  "墨西哥": "Mexico", "巴西": "Brazil", "阿根廷": "Argentina", "智利": "Chile",
  "哥伦比亚": "Colombia", "秘鲁": "Peru", "哥斯达黎加": "Costa Rica", "巴拿马": "Panama",
  "波多黎各": "Puerto Rico", "乌拉圭": "Uruguay",
  "肯尼亚": "Kenya", "埃及": "Egypt", "南非": "South Africa", "尼日利亚": "Nigeria",
  "摩洛哥": "Morocco", "拉各斯": "Nigeria", // Lagos → Nigeria
  "俄罗斯": "Russia", "乌克兰": "Ukraine", "塞尔维亚": "Serbia", "格鲁吉亚": "Georgia",
  "哈萨克斯坦": "Kazakhstan", "乌兹别克斯坦": "Uzbekistan", "阿塞拜疆": "Azerbaijan",
  "蒙古": "Mongolia", "埃塞俄比亚": "Ethiopia",
};

// ── 1. GPI Data (from VisionOfHumanity table, manually extracted) ──
const GPI_RAW = `Iceland,1.095
Ireland,1.26
New Zealand,1.282
Austria,1.294
Switzerland,1.294
Singapore,1.357
Portugal,1.371
Denmark,1.393
Slovenia,1.409
Finland,1.42
Czechia,1.435
Japan,1.44
Malaysia,1.469
Canada,1.491
Netherlands,1.491
Belgium,1.492
Hungary,1.5
Australia,1.505
Croatia,1.519
Germany,1.533
Lithuania,1.558
Latvia,1.558
Estonia,1.559
Spain,1.578
Qatar,1.593
Slovakia,1.609
Bulgaria,1.61
United Kingdom,1.634
Kuwait,1.642
Norway,1.644
Italy,1.662
Sweden,1.709
Poland,1.713
Mongolia,1.719
Romania,1.721
Vietnam,1.721
Taiwan,1.73
South Korea,1.736
Oman,1.738
Greece,1.764
Argentina,1.768
Uruguay,1.784
Indonesia,1.786
Costa Rica,1.843
Kazakhstan,1.875
Armenia,1.893
Chile,1.899
Serbia,1.914
Moldova,1.918
Uzbekistan,1.926
Cyprus,1.933
Jordan,1.957
France,1.967
Panama,2.006
Morocco,2.012
Thailand,2.017
Cambodia,2.019
Saudi Arabia,2.035
Azerbaijan,2.067
Peru,2.073
Sri Lanka,2.075
China,2.093
Bahrain,2.099
Philippines,2.148
Egypt,2.157
Georgia,2.185
Nicaragua,2.207
Uganda,2.217
India,2.229
Bangladesh,2.318
Honduras,2.347
South Africa,2.347
Kenya,2.392
United States of America,2.443
Ecuador,2.459
Brazil,2.472
Mexico,2.636
Lebanon,2.674
Ethiopia,2.688
Venezuela,2.692
Colombia,2.695
Iran,2.75
Pakistan,2.797
Turkiye,2.852
Nigeria,2.869
Myanmar,3.045
Israel,3.108
Ukraine,3.434
Russia,3.441`;

const gpiMap = new Map();
for (const line of GPI_RAW.trim().split("\n")) {
  const [name, score] = line.split(",");
  gpiMap.set(name.trim(), parseFloat(score));
}
// Aliases
gpiMap.set("United States", gpiMap.get("United States of America"));
gpiMap.set("Czech Republic", gpiMap.get("Czechia"));
gpiMap.set("Turkey", gpiMap.get("Turkiye"));

// ── 2. RSF Press Freedom (from CSV) ──
const rsfMap = new Map();
try {
  const csv = readFileSync("/tmp/rsf-2025.csv", "utf-8");
  for (const line of csv.trim().split("\n").slice(1)) {
    const parts = line.split(";");
    const iso = parts[0];
    const scoreStr = parts[1]?.replace(",", ".");
    const countryEn = parts[15]?.trim();
    if (countryEn && scoreStr) {
      rsfMap.set(countryEn, parseFloat(scoreStr));
    }
  }
} catch (e) {
  console.warn("RSF CSV not found, skipping");
}

// ── 3. GDP Growth (from World Bank API) ──
async function fetchGdpGrowth() {
  const resp = await fetch("https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.KD.ZG?date=2023&format=json&per_page=300");
  const data = await resp.json();
  const map = new Map();
  for (const r of data[1]) {
    if (r.value != null && r.country?.value) {
      map.set(r.country.value, Math.round(r.value * 100) / 100);
    }
  }
  return map;
}

async function main() {
  const gdpMap = await fetchGdpGrowth();

  // Load cities
  const sot = JSON.parse(readFileSync(SOT_PATH, "utf-8"));
  const cities = sot.cities || sot;
  const citiesArr = Array.isArray(cities) ? cities : Object.values(cities);

  let gpiHits = 0, rsfHits = 0, gdpHits = 0;

  for (const city of citiesArr) {
    const countryEn = COUNTRY_EN[city.country] || city.country;

    // GPI
    const gpi = gpiMap.get(countryEn) ?? null;
    city.gpiScore = gpi;
    if (gpi !== null) gpiHits++;

    // RSF — try multiple name variants
    let rsf = rsfMap.get(countryEn) ?? null;
    if (rsf === null && countryEn === "United States") rsf = rsfMap.get("United States of America") ?? null;
    if (rsf === null && countryEn === "South Korea") rsf = rsfMap.get("Korea, Republic of") ?? rsfMap.get("South Korea") ?? null;
    if (rsf === null && countryEn === "Turkiye") rsf = rsfMap.get("Turkey") ?? rsfMap.get("Türkiye") ?? null;
    if (rsf === null && countryEn === "Iran") rsf = rsfMap.get("Iran, Islamic Republic of") ?? rsfMap.get("Iran") ?? null;
    city.pressFreedomScore = rsf !== null ? Math.round(rsf * 100) / 100 : null;
    if (rsf !== null) rsfHits++;

    // GDP Growth
    let gdp = gdpMap.get(countryEn) ?? null;
    if (gdp === null && countryEn === "South Korea") gdp = gdpMap.get("Korea, Rep.") ?? null;
    if (gdp === null && countryEn === "Iran") gdp = gdpMap.get("Iran, Islamic Rep.") ?? null;
    if (gdp === null && countryEn === "Egypt") gdp = gdpMap.get("Egypt, Arab Rep.") ?? null;
    if (gdp === null && countryEn === "Turkiye") gdp = gdpMap.get("Turkiye") ?? null;
    if (gdp === null && countryEn === "Venezuela") gdp = gdpMap.get("Venezuela, RB") ?? null;
    if (gdp === null && countryEn === "Russia") gdp = gdpMap.get("Russian Federation") ?? null;
    if (gdp === null && countryEn === "Hong Kong") gdp = gdpMap.get("Hong Kong SAR, China") ?? null;
    city.gdpGrowthRate = gdp;
    if (gdp !== null) gdpHits++;
  }

  // Save
  if (sot.cities) {
    sot.cities = citiesArr;
    writeFileSync(SOT_PATH, JSON.stringify(sot, null, 2) + "\n");
  }

  // Also update public/data/cities.json
  const pub = JSON.parse(readFileSync(CITIES_PATH, "utf-8"));
  for (const city of pub.cities) {
    const src = citiesArr.find(c => c.id === city.id);
    if (src) {
      city.gpiScore = src.gpiScore;
      city.pressFreedomScore = src.pressFreedomScore;
      city.gdpGrowthRate = src.gdpGrowthRate;
    }
  }
  writeFileSync(CITIES_PATH, JSON.stringify(pub, null, 2) + "\n");

  console.log(`Done. GPI: ${gpiHits}/${citiesArr.length}, RSF: ${rsfHits}/${citiesArr.length}, GDP: ${gdpHits}/${citiesArr.length}`);
}

main().catch(console.error);
