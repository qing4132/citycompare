// Extract BLS OEWS May 2023 MSA-level medians for San Jose–Sunnyvale–Santa Clara (MSA 41940)
// = the Silicon Valley core. Overrides the national medians previously saved for city id 133.
//
// Source XLSX: oesm23ma/MSA_M2023_dl.xlsx (retrieved via Wayback 20250101, MSA data for all US MSAs).
// Official BLS URL: https://www.bls.gov/oes/special-requests/oesm23ma.zip

import fs from 'node:fs';
import { execSync } from 'node:child_process';

const MAPPING = JSON.parse(fs.readFileSync('data/sources/salary-official/us-bls-oews-2023.json', 'utf8'));
const wantedSOCs = Object.values(MAPPING.records).map((r) => r.soc).filter(Boolean);

const pyScript = `
import openpyxl, json
wb = openpyxl.load_workbook('/tmp/oesm23ma/MSA_M2023_dl.xlsx', data_only=True, read_only=True)
ws = wb.active
hdr = None
out = {}
wanted = set(${JSON.stringify(wantedSOCs)})
for row in ws.iter_rows(values_only=True):
    if hdr is None:
        hdr = list(row)
        idx = {h: i for i, h in enumerate(hdr)}
        continue
    area = row[idx['AREA']]
    # AREA is stored as int-like; MSA codes are 5-digit numerics, we want 41940
    if str(area) != '41940':
        continue
    soc = row[idx['OCC_CODE']]
    if soc not in wanted:
        continue
    med = row[idx['A_MEDIAN']]
    if isinstance(med, (int, float)) and med > 0:
        out[soc] = {'title': row[idx['OCC_TITLE']], 'aMedian': med, 'oGroup': row[idx['O_GROUP']]}
print(json.dumps(out, ensure_ascii=False))
`;
const blsJSON = execSync(`python3 -c "${pyScript.replace(/"/g, '\\"')}"`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
const bls = JSON.parse(blsJSON);

// Build per-profession
const records = {};
for (const [prof, m] of Object.entries(MAPPING.records)) {
  if (!m.soc) { records[prof] = { ...m, aMedianUSD: null, monthlyGrossUSD: null }; continue; }
  const row = bls[m.soc];
  if (!row) {
    records[prof] = { soc: m.soc, blsTitle: m.blsTitle, aMedianUSD: null, monthlyGrossUSD: null, note: 'Suppressed in MSA 41940' };
    continue;
  }
  records[prof] = {
    soc: m.soc,
    blsTitle: row.title,
    oGroup: row.oGroup,
    aMedianUSD: row.aMedian,
    monthlyGrossUSD: Math.round(row.aMedian / 12),
    note: null,
  };
}

const out = {
  generatedAt: new Date().toISOString(),
  source: {
    name: 'BLS Occupational Employment and Wage Statistics (OEWS)',
    geography: 'San Jose–Sunnyvale–Santa Clara, CA MSA (code 41940)',
    releaseDate: '2024-04-03',
    dataPeriod: 'May 2023',
    url: 'https://www.bls.gov/oes/special-requests/oesm23ma.zip',
    retrievalMirror: 'https://web.archive.org/web/20250101132353/https://www.bls.gov/oes/special-requests/oesm23ma.zip',
    file: 'MSA_M2023_dl.xlsx',
    field: 'A_MEDIAN (Annual median wage, USD, full-time equivalent, pre-tax)',
  },
  note: 'Used as authoritative Silicon Valley wage anchor for city 133 (圣何塞/硅谷）. Offline validation only.',
  coverage: `${Object.values(records).filter((r) => r.aMedianUSD).length}/${Object.keys(records).length} professions with SOC mapping present in MSA data`,
  records,
};

const outPath = 'data/sources/salary-official/us-bls-oews-2023-msa-41940-sanjose.json';
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`Saved → ${outPath}`);
console.log(`Coverage: ${out.coverage}\n`);

// Compare vs national
const national = MAPPING.records;
console.log('硅谷 (San Jose MSA) vs 全美 monthly gross USD：');
console.log('┌──────────────────┬──────────┬──────────┬────────┐');
console.log('│ 职业              │ 全美     │ 硅谷 MSA │ 溢价   │');
console.log('├──────────────────┼──────────┼──────────┼────────┤');
for (const [prof, r] of Object.entries(records)) {
  if (!r.aMedianUSD) continue;
  const nat = national[prof]?.monthlyGrossUSD;
  if (!nat) continue;
  const prem = ((r.monthlyGrossUSD / nat - 1) * 100).toFixed(0);
  console.log(`│ ${prof.padEnd(12,'　')} │ ${String('$'+nat).padStart(8)} │ ${String('$'+r.monthlyGrossUSD).padStart(8)} │ ${(prem>=0?'+':'')+prem}%     │`);
}
console.log('└──────────────────┴──────────┴──────────┴────────┘');
