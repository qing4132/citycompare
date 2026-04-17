// Cross-validate our runtime US city salaries against BLS OEWS 2023 authoritative medians.
//
// For each US city × each of the 21 professions with BLS SOC mapping:
//   - our_gross_annual = city.professions[profession]  (PPP-gross USD/yr, per our pipeline)
//   - bls_gross_annual = BLS A_MEDIAN  (national nominal-gross USD/yr)
//   - ratio = our / bls
//
// Aggregate: median(ratio) across professions per city → city-level "BLS benchmark ratio".
// Then compute median across 13 US cities. Ideal: ratio ≈ 1.0 at national level,
// with city multiplier for major metros (NYC, SF) > 1 and smaller cities < 1.

import fs from 'node:fs';

const src = JSON.parse(fs.readFileSync('data/cities-source.json', 'utf8'));
const bls = JSON.parse(fs.readFileSync('data/sources/salary-official/us-bls-oews-2023.json', 'utf8'));

const usCities = src.cities.filter((c) => c.country === '美国');
const mappedProfs = Object.entries(bls.records).filter(([, r]) => r.aMedianUSD != null);

console.log(`US cities: ${usCities.length}, BLS-mapped professions: ${mappedProfs.length}\n`);

const med = (arr) => { if (!arr.length) return null; const s=[...arr].sort((a,b)=>a-b),m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; };

const cityRatios = [];
console.log('┌──────────────┬──────────────┬────────┬────────┬────────┐');
console.log('│ 城市         │ n(比较职业) │ mean % │ median │ 判断    │');
console.log('├──────────────┼──────────────┼────────┼────────┼────────┤');
for (const c of usCities) {
  const rs = [];
  for (const [prof, r] of mappedProfs) {
    const ours = c.professions?.[prof];
    if (!ours || ours <= 0) continue;
    rs.push(ours / r.aMedianUSD);
  }
  if (!rs.length) continue;
  const mean = rs.reduce((s, x) => s + x, 0) / rs.length;
  const m = med(rs);
  const judge = m < 0.7 ? '偏低' : m > 1.6 ? '偏高' : m > 1.3 ? '高成本市' : '合理';
  cityRatios.push({ id: c.id, name: c.name, n: rs.length, mean, median: m });
  console.log(`│ ${c.name.padEnd(10, '　')} │ ${rs.length.toString().padStart(10)} │ ${(mean*100).toFixed(0).padStart(4)}%  │ ${(m*100).toFixed(0).padStart(4)}%  │ ${judge.padEnd(6,' ')} │`);
}
console.log('└──────────────┴──────────────┴────────┴────────┴────────┘');

const allMedians = cityRatios.map(r => r.median);
console.log(`\n美国 13 城整体 vs BLS：`);
console.log(`  城市中位数分布: min=${(Math.min(...allMedians)*100).toFixed(0)}%  中位=${(med(allMedians)*100).toFixed(0)}%  max=${(Math.max(...allMedians)*100).toFixed(0)}%`);
console.log(`  含义：我们的 gross ≈ BLS 全美 median × (${(med(allMedians)*100).toFixed(0)}%)`);

// 各职业全美倍数（跨 13 城）
console.log(`\n各职业平均我们/BLS（n=13 城平均）：`);
console.log('┌──────────────────┬──────────┬──────────┬────────┐');
console.log('│ 职业              │ BLS $/mo │ 我们均值 │ 倍率   │');
console.log('├──────────────────┼──────────┼──────────┼────────┤');
for (const [prof, r] of mappedProfs) {
  const vals = usCities.map((c) => c.professions?.[prof]).filter((v) => v > 0);
  if (!vals.length) continue;
  const mean = vals.reduce((s,x)=>s+x,0) / vals.length;
  const ratio = mean / r.aMedianUSD;
  console.log(`│ ${prof.padEnd(12,'　')} │ ${String('$'+r.monthlyGrossUSD).padStart(8)} │ ${String('$'+Math.round(mean/12)).padStart(8)} │ ${(ratio*100).toFixed(0).padStart(4)}%  │`);
}
console.log('└──────────────────┴──────────┴──────────┴────────┘');

const out = {
  generatedAt: new Date().toISOString(),
  description: 'Cross-validation of WhichCity runtime US city salaries against BLS OEWS 2023 national medians. Used to verify profession-level plausibility without feeding BLS data into runtime.',
  blsSource: bls.source,
  cityResults: cityRatios,
  overallUSGrossVsBLS: { min: Math.min(...allMedians), median: med(allMedians), max: Math.max(...allMedians) },
};
fs.writeFileSync('data/sources/salary-official/us-bls-crosscheck.json', JSON.stringify(out, null, 2));
console.log('\nSaved → data/sources/salary-official/us-bls-crosscheck.json');
