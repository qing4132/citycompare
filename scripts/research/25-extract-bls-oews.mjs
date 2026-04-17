// Extract authoritative US salary medians from BLS OEWS May 2023 national file.
//
// Source: https://www.bls.gov/oes/special-requests/oesm23nat.zip
// Mirror used for retrieval (BLS Akamai blocks programmatic fetch):
//   https://web.archive.org/web/20250101084331/https://www.bls.gov/oes/special-requests/oesm23nat.zip
//   Downloaded 2026-04-17 to /tmp/oesm23nat/oesm23nat/national_M2023_dl.xlsx
//
// Field mapping: A_MEDIAN = Annual median wage (full-time equivalent). USD, nominal, pre-tax.
//
// 25 professions → SOC 2018 detailed codes. Where no authoritative 1:1 mapping exists
// we leave null rather than fabricate a proxy.

import fs from 'node:fs';
import { execSync } from 'node:child_process';

// profession -> { soc, title (BLS), note }
// Mappings verified from BLS SOC 2018 structure + O*NET crosswalk.
const MAPPING = {
  '软件工程师': { soc: '15-1252', title: 'Software Developers' },
  '医生/医学博士': { soc: '29-1229', title: 'Physicians, All Other; and Ophthalmologists, Except Pediatric', note: 'broad physician minor group; individual specialties in 29-1210 range' },
  '财务分析师': { soc: '13-2051', title: 'Financial and Investment Analysts' },
  '市场经理': { soc: '11-2021', title: 'Marketing Managers' },
  '平面设计师': { soc: '27-1024', title: 'Graphic Designers' },
  '数据科学家': { soc: '15-2051', title: 'Data Scientists' },
  '销售经理': { soc: '11-2022', title: 'Sales Managers' },
  '人力资源经理': { soc: '11-3121', title: 'Human Resources Managers' },
  '教师': { soc: '25-2031', title: 'Secondary School Teachers, Except Special and Career/Technical Education' },
  '护士': { soc: '29-1141', title: 'Registered Nurses' },
  '律师': { soc: '23-1011', title: 'Lawyers' },
  '建筑师': { soc: '17-1011', title: 'Architects, Except Landscape and Naval' },
  '厨师': { soc: '35-1011', title: 'Chefs and Head Cooks' },
  '记者': { soc: '27-3023', title: 'News Analysts, Reporters, and Journalists' },
  '机械工程师': { soc: '17-2141', title: 'Mechanical Engineers' },
  '药剂师': { soc: '29-1051', title: 'Pharmacists' },
  '会计师': { soc: '13-2011', title: 'Accountants and Auditors' },
  'UI/UX设计师': { soc: '15-1255', title: 'Web and Digital Interface Designers' },
  '大学教授': { soc: '25-1099', title: 'Postsecondary Teachers, All Other' },
  '牙医': { soc: '29-1021', title: 'Dentists, General' },
  '公交司机': { soc: '53-3052', title: 'Bus Drivers, Transit and Intercity' },
  '电工': { soc: '47-2111', title: 'Electricians' },
  // No authoritative BLS SOC mapping:
  '产品经理': { soc: null, title: null, note: 'No exact SOC 2018 code for "product manager"; BLS does not publish product manager wages separately' },
  '政府/NGO行政': { soc: null, title: null, note: 'Too broad; spans 11-xxxx / 43-xxxx categories' },
  '数字游民': { soc: null, title: null, note: 'Not a BLS occupation' },
};

// Read XLSX via python3 (openpyxl) — returns JSON list of rows we need.
const pyScript = `
import openpyxl, json, sys
wb = openpyxl.load_workbook('/tmp/oesm23nat/oesm23nat/national_M2023_dl.xlsx', data_only=True)
ws = wb.active
out = {}
soc_col = None
title_col = None
median_col = None
ogrp_col = None
for i, c in enumerate(ws[1]):
    if c.value == 'OCC_CODE': soc_col = i
    elif c.value == 'OCC_TITLE': title_col = i
    elif c.value == 'A_MEDIAN': median_col = i
    elif c.value == 'O_GROUP': ogrp_col = i
wanted = set(${JSON.stringify(Object.values(MAPPING).map((m) => m.soc).filter(Boolean))})
for row in ws.iter_rows(min_row=2, values_only=True):
    soc = row[soc_col]
    if soc not in wanted: continue
    med = row[median_col]
    title = row[title_col]
    ogrp = row[ogrp_col]
    if isinstance(med, (int, float)) and med > 0:
        out[soc] = {'title': title, 'aMedian': med, 'oGroup': ogrp}
print(json.dumps(out, ensure_ascii=False))
`;
const blsJSON = execSync(`python3 -c "${pyScript.replace(/"/g, '\\"')}"`, { encoding: 'utf8' });
const bls = JSON.parse(blsJSON);

// Build record
const records = {};
for (const [prof, m] of Object.entries(MAPPING)) {
  if (!m.soc) {
    records[prof] = { soc: null, source: null, aMedianUSD: null, monthlyGrossUSD: null, note: m.note };
    continue;
  }
  const row = bls[m.soc];
  if (!row) {
    records[prof] = { soc: m.soc, source: null, aMedianUSD: null, monthlyGrossUSD: null, note: 'SOC code not found in XLSX (may be suppressed #)' };
    continue;
  }
  records[prof] = {
    soc: m.soc,
    blsTitle: row.title,
    oGroup: row.oGroup,
    aMedianUSD: row.aMedian,
    monthlyGrossUSD: Math.round(row.aMedian / 12),
    note: m.note ?? null,
  };
}

const out = {
  generatedAt: new Date().toISOString(),
  source: {
    name: 'BLS Occupational Employment and Wage Statistics (OEWS)',
    releaseDate: '2024-04-03',
    dataPeriod: 'May 2023',
    url: 'https://www.bls.gov/oes/special-requests/oesm23nat.zip',
    retrievalMirror: 'https://web.archive.org/web/20250101084331/https://www.bls.gov/oes/special-requests/oesm23nat.zip',
    file: 'national_M2023_dl.xlsx',
    field: 'A_MEDIAN (Annual median wage, USD, full-time equivalent, pre-tax)',
  },
  geography: 'United States (national)',
  note: 'Used as authoritative gross-salary anchor for US cost-of-living / salary calibration. Runtime city salary values remain derived from profession modeling; this file is for offline validation only.',
  coverage: `${Object.values(records).filter((r) => r.aMedianUSD).length}/25 professions mapped to SOC codes with authoritative median wages`,
  records,
};

const outPath = 'data/sources/salary-official/us-bls-oews-2023.json';
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Saved → ${outPath}`);
console.log(`\nCoverage: ${out.coverage}`);
console.log('\nTop records:');
for (const [p, r] of Object.entries(records)) {
  const mg = r.monthlyGrossUSD != null ? `$${r.monthlyGrossUSD}/mo` : 'null';
  console.log(`  ${p.padEnd(16, '　')} SOC ${String(r.soc || '—').padEnd(8)}  ${mg}`);
}
