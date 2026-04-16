import type { City } from "@/lib/types";
import type { NomadCityData } from "@/lib/nomadData";

/* ── Tag system ── */

export type TagColor = "green" | "amber" | "red" | "blue";
export interface Tag { label: string; color: TagColor }

/**
 * Generate tags for a city. Max 5 tags.
 * Priority: red > amber > green > blue. Truncate weakest if over 5.
 */
export function generateTags(
  city: City,
  savingsRate: number | null,
  effectiveTaxRate: number | null,
  englishLevel: string | null,
  primaryLanguage: string | null,
  t: (k: string, p?: Record<string, string>) => string,
): Tag[] {
  const tags: Tag[] = [];

  // Safety warning (always first if present)
  if (city.safetyWarning === "active_conflict") {
    tags.push({ label: t("tagConflict"), color: "red" });
  } else if (city.safetyWarning === "extreme_instability") {
    tags.push({ label: t("tagInstability"), color: "red" });
  }

  // Safety
  if (city.safetyIndex >= 85) tags.push({ label: t("tagLowCrime"), color: "green" });
  else if (city.safetyIndex < 50) tags.push({ label: t("tagSafetyConcern"), color: "red" });

  // Healthcare
  if (city.healthcareIndex >= 75) tags.push({ label: t("tagTopHealthcare"), color: "green" });

  // Tax
  if (effectiveTaxRate !== null && effectiveTaxRate <= 0.15) tags.push({ label: t("tagLowTax"), color: "green" });
  else if (effectiveTaxRate !== null && effectiveTaxRate >= 0.40) tags.push({ label: t("tagHighTax"), color: "amber" });

  // Air quality
  if (city.airQuality !== null && city.airQuality >= 80) tags.push({ label: t("tagBadAir"), color: "amber" });

  // Language
  if (englishLevel === "A") {
    tags.push({ label: t("tagEnglishFriendly"), color: "blue" });
  } else if (englishLevel && englishLevel !== "A" && primaryLanguage) {
    tags.push({ label: t("tagLangEnv", { lang: primaryLanguage }) || primaryLanguage, color: "amber" });
  }

  // Sort: red first, then amber, green, blue. Cap at 5.
  const order: Record<TagColor, number> = { red: 0, amber: 1, green: 2, blue: 3 };
  tags.sort((a, b) => order[a.color] - order[b.color]);
  return tags.slice(0, 5);
}

/* ── Safety grade (A/B/C/D based on safety+governance+freedom, S for elite) ── */

export type Grade = "S" | "A" | "B" | "C" | "D";

export function computeGrade(city: City, allCities: City[]): Grade {
  const score = city.safetyIndex + city.governanceIndex + city.freedomIndex;
  const allScores = allCities.map(c => c.safetyIndex + c.governanceIndex + c.freedomIndex);
  const sorted = [...allScores].sort((a, b) => b - a);
  const rank = sorted.indexOf(score) + 1;
  const n = sorted.length;
  const base = rank <= n * 0.25 ? "A" : rank <= n * 0.50 ? "B" : rank <= n * 0.75 ? "C" : "D";

  if (base === "A") {
    const p80 = (field: keyof City) => {
      const vals = allCities.map(c => c[field] as number).sort((a, b) => b - a);
      return vals[Math.floor(vals.length * 0.2)];
    };
    const allTop = city.safetyIndex >= p80("safetyIndex")
      && city.governanceIndex >= p80("governanceIndex")
      && city.freedomIndex >= p80("freedomIndex");
    if (allTop) return "S";
  }
  return base as Grade;
}

export function gradeColor(grade: Grade): string {
  if (grade === "S" || grade === "A") return "var(--green)";
  if (grade === "B") return "var(--blue)";
  if (grade === "C") return "var(--amber)";
  return "var(--red)";
}

/* ── Bar color for index values ── */

export function indexColor(value: number): string {
  if (value >= 70) return "var(--green)";
  if (value >= 50) return "var(--blue)";
  if (value >= 40) return "var(--amber)";
  return "var(--red)";
}

/* ── Insight text generation ── */

export function moneyInsight(
  savingsRate: number,
  yearsToBuy: number | null,
  rentUsd: number | null,
  t: (k: string, p?: Record<string, string>) => string,
  fc: (v: number) => string,
): string {
  const parts: string[] = [];
  parts.push(t("insightSavingsRate", { rate: String(savingsRate) }));
  if (yearsToBuy !== null && isFinite(yearsToBuy)) {
    parts.push(t("insightYearsToBuy", { years: yearsToBuy.toFixed(1) }));
  }
  if (rentUsd !== null) {
    parts.push(t("insightRent", { rent: fc(rentUsd) }));
  }
  return "💡 " + parts.join(t("insightSep"));
}

export function healthInsight(
  city: City,
  healthPercentile: string,
  t: (k: string, p?: Record<string, string>) => string,
): string {
  const doctors = city.doctorsPerThousand?.toFixed(1) ?? "—";
  const uhc = city.uhcCoverageIndex != null ? String(Math.round(city.uhcCoverageIndex)) : "—";
  const life = city.lifeExpectancy?.toFixed(1) ?? "—";
  return "🏥 " + t("insightHealthFull", { doctors, uhc, life, pct: healthPercentile });
}
