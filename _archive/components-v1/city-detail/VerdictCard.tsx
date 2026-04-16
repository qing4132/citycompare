import type { City } from "@/lib/types";

interface Tag { label: string; color: "green" | "amber" | "red" | "blue" }

interface Props {
  city: City;
  grade: string;
  darkMode: boolean;
  income: number | null;
  savings: number | null;
  savingsRate: number;
  effectiveTaxRate: number | null;
  professionLabel: string;
  cityName: string;
  formatCompactStr: (amount: number) => string;
  t: (k: string, p?: Record<string, string | number>) => string;
  englishLevel?: string | null;
}

/** Verdict Card — the most important new component. Shows a natural-language conclusion. */
export default function VerdictCard({ city, grade, darkMode, income, savings, savingsRate, effectiveTaxRate, professionLabel, cityName, formatCompactStr, t, englishLevel }: Props) {
  const hasSafetyWarn = !!city.safetyWarning;
  const isWarning = hasSafetyWarn || grade === "D";

  // Card color: S/A → green, B → blue, C → amber, D/warning → red
  const variant = hasSafetyWarn ? "red" : grade === "D" ? "red" : grade === "C" ? "amber" : grade === "B" ? "blue" : "green";
  const bgCls = variant === "red"
    ? (darkMode ? "bg-gradient-to-br from-red-950/50 to-red-900/30 border-red-800" : "bg-gradient-to-br from-red-50 to-red-100 border-red-200")
    : variant === "amber"
    ? (darkMode ? "bg-gradient-to-br from-amber-950/50 to-amber-900/30 border-amber-800" : "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200")
    : variant === "blue"
    ? (darkMode ? "bg-gradient-to-br from-blue-950/50 to-blue-900/30 border-blue-800" : "bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200")
    : (darkMode ? "bg-gradient-to-br from-green-950/50 to-emerald-900/30 border-green-800" : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200");

  const labelCls = variant === "red" ? (darkMode ? "text-red-400" : "text-red-600")
    : variant === "amber" ? (darkMode ? "text-amber-400" : "text-amber-600")
    : variant === "blue" ? (darkMode ? "text-blue-400" : "text-blue-600")
    : (darkMode ? "text-green-400" : "text-green-600");

  const textCls = variant === "red" ? (darkMode ? "text-red-200" : "text-red-900")
    : variant === "amber" ? (darkMode ? "text-amber-200" : "text-amber-900")
    : variant === "blue" ? (darkMode ? "text-blue-200" : "text-blue-900")
    : (darkMode ? "text-green-200" : "text-green-900");

  // Generate verdict text
  const healthDesc = city.healthcareIndex >= 80 ? t("healthDescTop") : city.healthcareIndex >= 65 ? t("healthDescGood") : city.healthcareIndex >= 45 ? t("healthDescMid") : t("healthDescLow");

  let verdictText: string;
  if (hasSafetyWarn) {
    verdictText = city.safetyWarning === "active_conflict" ? t("verdictWarningConflict") : t("verdictWarningInstability");
  } else {
    const safetyLine = t("verdictSafetyGood", { grade, healthDesc });
    if (income !== null && savings !== null) {
      const incomeLine = t("verdictIncome", {
        profession: professionLabel, income: formatCompactStr(income / 12), savings: formatCompactStr(savings / 12),
      });
      verdictText = safetyLine + "\n" + incomeLine;
    } else {
      verdictText = safetyLine;
    }
  }

  // Generate tags
  const tags: Tag[] = [];
  if (hasSafetyWarn) {
    tags.push({ label: t("tagActiveConflict"), color: "red" });
    tags.push({ label: t("tagExtremeRisk"), color: "red" });
  } else {
    if (city.safetyIndex >= 85) tags.push({ label: t("tagLowCrime"), color: "green" });
    if (city.healthcareIndex >= 80) tags.push({ label: t("tagTopHealthcare"), color: "green" });
    if (city.hdi != null && city.hdi >= 0.9) tags.push({ label: t("tagHighHDI"), color: "green" });
    if (savingsRate >= 50) tags.push({ label: t("tagHighSavings"), color: "green" });
    if (effectiveTaxRate !== null && effectiveTaxRate <= 0.15) tags.push({ label: t("tagLowTax"), color: "blue" });
    else if (effectiveTaxRate !== null && effectiveTaxRate >= 0.40) tags.push({ label: t("tagHighTax"), color: "amber" });
    else if (effectiveTaxRate !== null && effectiveTaxRate >= 0.20) tags.push({ label: t("tagMedTax"), color: "blue" });
    if (city.airQuality != null && city.airQuality >= 100) tags.push({ label: t("tagBadAir"), color: "amber" });
    if (savingsRate < 10 && income !== null) tags.push({ label: t("tagHardToSave"), color: "red" });
    if (englishLevel === "A") tags.push({ label: t("tagEnglishEnv"), color: "blue" });
    if (city.annualWorkHours != null && city.annualWorkHours <= 1400) tags.push({ label: t("tagWorkLife"), color: "green" });
    if (city.paidLeaveDays != null && city.paidLeaveDays >= 30) tags.push({ label: t("tagGoodLeave"), color: "green" });
  }

  const tagCls = (c: Tag["color"]) => {
    if (c === "green") return darkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-700";
    if (c === "amber") return darkMode ? "bg-amber-900/50 text-amber-300" : "bg-amber-100 text-amber-700";
    if (c === "red") return darkMode ? "bg-red-900/50 text-red-300" : "bg-red-100 text-red-700";
    return darkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-700";
  };

  return (
    <div className={`mx-0 mb-4 p-4 rounded-[14px] border ${bgCls}`}>
      <div className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${labelCls}`}>
        {hasSafetyWarn ? t("verdictWarningLabel") : t("verdictLabel")}
      </div>
      <div className={`text-[15px] font-bold leading-relaxed whitespace-pre-line ${textCls}`}>
        {verdictText}
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {tags.map((tag, i) => (
            <span key={i} className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${tagCls(tag.color)}`}>
              {tag.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
