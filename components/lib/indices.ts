/**
 * WhichCity Index System v3 — Weighted
 *
 * 5 orthogonal indices, each 0-100 (higher = better).
 * Sub-indicators are min-max normalized then combined with empirically-derived weights.
 *
 * Weight rationale: based on Pearson correlation analysis within each index.
 * Independent signals get higher weight; highly correlated pairs share weight
 * to avoid double-counting. See THINKING session for full analysis.
 *
 * 1. Safety (4): gpiScore 35%, homicideRate 25%, politicalStability 20%, ruleLawWGI 20%
 * 2. Healthcare (4): lifeExpectancy 35%, doctorsPerThousand 25%, outOfPocketPct 25%, hospitalBeds 15%
 * 3. Governance (4): CPI 35%, govEffectiveness 25%, regulatoryQuality 20%, controlOfCorruption 20%
 * 4. Freedom (4): democracyIndex 30%, pressFreedomScore 30%, gii 20%, vpn 20%
 * 5. Economy (4): inflationRate 30%, unemploymentRate 30%, gdpPppPerCapita 25%, gdpGrowthRate 15%
 */

import type { City } from "@/lib/types";

/* ── Normalization ── */

function norm(val: number | null | undefined, all: (number | null | undefined)[], invert = false): number | null {
  if (val == null) return null;
  const valid = all.filter((v): v is number => v != null);
  if (valid.length < 3) return null;
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  if (max === min) return 50;
  const n = (val - min) / (max - min) * 100;
  return invert ? 100 - n : n;
}

/** Weighted average of non-null (value, weight) pairs. Re-normalizes weights for missing data. */
function wavg(pairs: [number | null, number][]): number | null {
  let sum = 0, wSum = 0;
  for (const [v, w] of pairs) {
    if (v !== null) { sum += v * w; wSum += w; }
  }
  return wSum > 0 ? sum / wSum : null;
}

/* ── Types ── */

export interface CityIndices {
  safety: number | null;
  healthcare: number | null;
  governance: number | null;
  freedom: number | null;
  economy: number | null;
}

export type IndexName = keyof CityIndices;
export const INDEX_NAMES: IndexName[] = ["safety", "healthcare", "governance", "freedom", "economy"];

/* ── Compute ── */

export function computeAllIndices(cities: City[], vpnMap?: Map<number, number | null>): Map<number, CityIndices> {
  const f = (field: keyof City) => cities.map(c => c[field] as number | null);

  const aHom = f("homicideRate"), aPol = f("politicalStability"), aLaw = f("ruleLawWGI"), aGpi = cities.map(c => c.gpiScore ?? null);
  const aDoc = f("doctorsPerThousand"), aBed = f("hospitalBedsPerThousand"), aLife = f("lifeExpectancy"), aOop = f("outOfPocketPct");
  const aCpi = f("corruptionPerceptionIndex"), aGov = f("govEffectiveness"), aReg = f("regulatoryQuality"), aCor = f("controlOfCorruption");
  const aDem = f("democracyIndex"), aGii = f("gii"), aPrs = cities.map(c => c.pressFreedomScore ?? null);
  const aInf = f("inflationRate"), aUne = f("unemploymentRate"), aGdp = f("gdpPppPerCapita"), aGrw = cities.map(c => c.gdpGrowthRate ?? null);

  const result = new Map<number, CityIndices>();
  const round1 = (v: number | null) => v !== null ? Math.round(v * 10) / 10 : null;

  for (const city of cities) {
    const vpn = vpnMap?.get(city.id) ?? null;

    result.set(city.id, {
      safety: round1(wavg([
        [norm(city.homicideRate, aHom, true), 0.25],
        [norm(city.politicalStability, aPol), 0.20],
        [norm(city.ruleLawWGI, aLaw), 0.20],
        [norm(city.gpiScore ?? null, aGpi, true), 0.35],
      ])),
      healthcare: round1(wavg([
        [norm(city.lifeExpectancy, aLife), 0.35],
        [norm(city.doctorsPerThousand, aDoc), 0.25],
        [norm(city.outOfPocketPct, aOop, true), 0.25],
        [norm(city.hospitalBedsPerThousand, aBed), 0.15],
      ])),
      governance: round1(wavg([
        [norm(city.corruptionPerceptionIndex, aCpi), 0.35],
        [norm(city.govEffectiveness, aGov), 0.25],
        [norm(city.regulatoryQuality, aReg), 0.20],
        [norm(city.controlOfCorruption, aCor), 0.20],
      ])),
      freedom: round1(wavg([
        [norm(city.democracyIndex, aDem), 0.30],
        [norm(city.gii, aGii, true), 0.20],
        [norm(city.pressFreedomScore ?? null, aPrs), 0.30],
        [vpn, 0.20],
      ])),
      economy: round1(wavg([
        [norm(city.inflationRate, aInf, true), 0.30],
        [norm(city.unemploymentRate, aUne, true), 0.30],
        [norm(city.gdpPppPerCapita, aGdp), 0.25],
        [norm(city.gdpGrowthRate ?? null, aGrw), 0.15],
      ])),
    });
  }

  return result;
}

/* ── Grade ── */

export type Grade = "S" | "A" | "B" | "C" | "D";

/**
 * S = A-grade + all 5 indices ≥ 75 (all green bars)
 * A = top 25%
 * B = 25–50%
 * C = 50–75%
 * D = bottom 25%
 */
export function computeGrade(indices: CityIndices, allIndices: CityIndices[]): Grade {
  const vals = INDEX_NAMES.map(k => indices[k]).filter((v): v is number => v != null);
  if (vals.length === 0) return "D";
  const overall = vals.reduce((s, v) => s + v, 0) / vals.length;

  const allOverall = allIndices
    .map(idx => {
      const v = INDEX_NAMES.map(k => idx[k]).filter((x): x is number => x != null);
      return v.length > 0 ? v.reduce((s, x) => s + x, 0) / v.length : null;
    })
    .filter((v): v is number => v != null)
    .sort((a, b) => b - a);

  const rank = allOverall.findIndex(v => overall >= v) + 1;
  const n = allOverall.length;

  // S: must be A-grade AND all 5 indices ≥ 75
  if (rank <= n * 0.25) {
    const allGreen = INDEX_NAMES.every(k => (indices[k] ?? 0) >= 75);
    if (allGreen) return "S";
    return "A";
  }
  if (rank <= n * 0.50) return "B";
  if (rank <= n * 0.75) return "C";
  return "D";
}

/* ── Bar color: absolute thresholds matching quartiles ── */

/* ── Bar color: deep red → light red → light green → deep green ── */

export function tierColor(value: number | null): string {
  if (value === null) return "var(--fg-muted)";
  if (value >= 75) return "var(--green)";
  if (value >= 50) return "var(--yellow)";   // light green #65a30d / #a3e635
  if (value >= 25) return "var(--orange)";   // light red #e87a5a / #fca5a5
  return "var(--red)";
}

/** Grade letter color */
export function gradeColor(grade: Grade): string {
  if (grade === "S" || grade === "A") return "var(--green)";
  if (grade === "B") return "var(--yellow)";
  if (grade === "C") return "var(--orange)";
  return "var(--red)";
}
