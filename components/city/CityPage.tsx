"use client";

import type { City } from "@/lib/types";
import type { NomadCityData, VisaFreeMatrix } from "@/lib/nomadData";
import { CITY_FLAG_EMOJIS } from "@/lib/constants";
import { CITY_NAME_TRANSLATIONS, COUNTRY_TRANSLATIONS, socialCompLabel } from "@/lib/i18n";
import { CITY_LANGUAGES, LANGUAGE_NAME_TRANSLATIONS } from "@/lib/cityLanguages";
import { CITY_INTROS } from "@/lib/cityIntros";
import { CITY_SLUGS } from "@/lib/citySlug";
import { getClimateLabel } from "@/lib/clientUtils";
import { computeNetIncome, computeAllNetIncomes, computeTaxBreakdown } from "@/lib/taxUtils";
import { localizeVisaName } from "@/lib/nomadI18n";
import { useSettings } from "@/hooks/useSettings";
import ClimateChart from "@/components/shared/ClimateChart";
import { generateTags } from "@/components/lib/grading";
import { computeAllIndices, computeGrade, gradeColor, tierColor, INDEX_NAMES } from "@/components/lib/indices";
import type { CityIndices } from "@/components/lib/indices";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import HeroSection from "./HeroSection";
import MoneySection from "./MoneySection";
import SafetySection from "./SafetySection";
import HealthLifeSection from "./HealthLifeSection";
import ConnectivitySection from "./ConnectivitySection";
import SimilarSection from "./SimilarSection";

interface Props {
  city: City; slug: string; allCities: City[]; locale: string;
  nomadData: NomadCityData | null; visaMatrix: VisaFreeMatrix | null;
}

export default function CityPage({ city, slug, allCities, locale: urlLocale, nomadData }: Props) {
  const s = useSettings(urlLocale);
  const { locale, t, formatCurrency, formatCompact, costTier, profession, salaryMultiplier } = s;
  const loc = locale as "zh" | "en" | "ja" | "es";
  const cjk = loc === "zh" || loc === "ja";

  if (!s.mounted || !s.ready) return <div className="min-h-screen bg-[var(--bg-page)]" />;

  const cityName = CITY_NAME_TRANSLATIONS[city.id]?.[loc] || city.name;
  const countryName = COUNTRY_TRANSLATIONS[city.country]?.[loc] || city.country;
  const flag = CITY_FLAG_EMOJIS[city.id] || "🏙️";
  const intro = CITY_INTROS[city.id]?.[loc] || CITY_INTROS[city.id]?.zh || null;
  const climate = city.climate;
  const climateLabel = climate ? getClimateLabel(climate.type, locale) : null;

  // Timezone
  const tzLabel = city.timezone ? (() => {
    try {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: city.timezone, timeZoneName: "shortOffset" }).formatToParts(new Date());
      return parts.find(p => p.type === "timeZoneName")?.value || null;
    } catch { return null; }
  })() : null;
  const metaLine = [countryName, tzLabel].filter(Boolean).join(" · ");

  // ── Economics ──
  const professions = city.professions ? Object.keys(city.professions) : [];
  const activeProfession = profession && professions.includes(profession) ? profession : professions[0] || "";
  const gross = activeProfession && city.professions[activeProfession] != null ? city.professions[activeProfession] * salaryMultiplier : null;
  const costField = costTier === "budget" ? "costBudget" as const : "costModerate" as const;
  const taxResult = gross !== null ? computeNetIncome(gross, city.country, city.id, "net", s.rates?.rates) : null;
  const income = taxResult?.netUSD ?? null;
  const monthlyCost = city[costField];
  const surplus = income !== null && monthlyCost !== null ? income - monthlyCost * 12 : null;
  const savingsRate = income !== null && income > 0 && surplus !== null ? Math.round((surplus / income) * 100) : null;
  const yearsToBuy = city.housePrice != null && surplus !== null && surplus > 0 ? (city.housePrice * 70) / surplus : null;

  const fc = (v: number) => formatCurrency(v);
  const fmCompact = (annual: number) => {
    const { num, unit } = formatCompact(annual / 12);
    return num + unit;
  };

  // ── Indices (new 5-index system) ──
  const vpnMap = new Map<number, number | null>();
  for (const c of allCities) {
    // Convert VPN restriction to 0-100 score
    vpnMap.set(c.id, null); // default; will be overridden below if nomad data available
  }
  // We only have nomad VPN data for the current city in this context
  if (nomadData?.internet?.vpnRestricted != null) {
    const v = nomadData.internet.vpnRestricted;
    vpnMap.set(city.id, v === true ? 0 : v === "partial" ? 50 : 100);
  }
  const allIndicesMap = computeAllIndices(allCities, vpnMap);
  const cityIndices = allIndicesMap.get(city.id) || { safety: null, healthcare: null, governance: null, freedom: null, economy: null };
  const allIndicesArr = Array.from(allIndicesMap.values());
  const grade = computeGrade(cityIndices, allIndicesArr);
  const gradeColorVal = gradeColor(grade);

  // ── Tags ──
  const langs = CITY_LANGUAGES[city.id] || [];
  const primaryLang = langs[0] ? (LANGUAGE_NAME_TRANSLATIONS[langs[0]]?.[loc] || langs[0]) : null;
  const englishLevel = nomadData?.english?.cityRating ?? null;
  const profLabel = s.getProfessionLabel(activeProfession);
  const tags = generateTags(city, null, taxResult?.effectiveRate ?? null, englishLevel, primaryLang, t);

  // ── Safety warning ──
  const warningText = city.safetyWarning === "active_conflict" ? t("safetyWarningConflict")
    : city.safetyWarning === "extreme_instability" ? t("safetyWarningInstability") : null;

  // ── Health insight ──
  const allHealth = allCities.map(c => c.healthcareIndex).sort((a, b) => a - b);
  const healthPct = allHealth.filter(v => v <= city.healthcareIndex).length / allHealth.length;
  const healthPctLabel = healthPct >= 0.85 ? t("pctTop15") : healthPct >= 0.7 ? t("pctTop30") : healthPct >= 0.4 ? t("pctMid") : t("pctBottom");
  const healthInsight = t("insightHealthFull", {
    doctors: city.doctorsPerThousand?.toFixed(1) ?? "—",
    uhc: String(city.uhcCoverageIndex != null ? Math.round(city.uhcCoverageIndex) : "—"),
    life: city.lifeExpectancy?.toFixed(1) ?? "—", pct: healthPctLabel,
  });

  // ── Money insight ──
  const moneyParts: string[] = [];
  if (yearsToBuy !== null && isFinite(yearsToBuy)) moneyParts.push(t("insightYearsToBuy", { years: yearsToBuy.toFixed(1) }));
  if (city.monthlyRent !== null) moneyParts.push(t("insightRent", { rent: fc(city.monthlyRent) }));
  const moneyInsight = moneyParts.length > 0 ? "💡 " + moneyParts.join(t("insightSep")) : "";

  // ── Tax detail ──
  const taxDetail = gross !== null ? (() => {
    const bd = computeTaxBreakdown(gross, city.country, city.id, s.rates?.rates);
    if (!bd) return null;
    const fmt = (v: number) => `${bd.currencyCode} ${Math.round(Math.abs(v)).toLocaleString()}`;
    const fmtUser = (usd: number) => {
      const r = s.rates?.rates;
      const val = r && s.currency !== "USD" ? usd * (r[s.currency] ?? 1) : usd;
      return `${s.currency} ${Math.round(val).toLocaleString()}`;
    };
    return (
      <div className="bg-[var(--surface)] rounded-[10px] p-3 text-[13px] text-[var(--fg-secondary)] space-y-0.5">
        <div className="flex justify-between font-bold"><span>{t("taxBkGross")}</span><span className="text-[var(--fg)]">{fmt(bd.grossLocal)}</span></div>
        {bd.sections.map((sec, i) => {
          const prev = i > 0 ? bd.sections[i - 1] : null;
          const needDivider = (sec.isInfo && (!prev || !prev.isInfo)) || (sec.isResult && prev?.isInfo);
          return (
            <div key={i}>
              {needDivider && <div className="border-t border-[var(--border)] mt-0.5" />}
              {sec.isResult ? (
                <div className="flex justify-between font-semibold pt-0.5"><span>{t(sec.label)}</span><span className="text-[var(--fg)]">{fmt(sec.total)}</span></div>
              ) : sec.isInfo ? (
                <div className="flex justify-between pt-0.5"><span>{t(sec.label)}</span><span>{fmt(sec.total)}</span></div>
              ) : (
                <div className={`flex justify-between font-semibold ${sec.total < 0 ? "text-[var(--red)]" : ""}`}>
                  <span>{sec.total < 0 ? "−" : ""} {t(sec.label)}</span><span>{fmt(sec.total)}</span>
                </div>
              )}
              {sec.details?.map((d, j) => (
                <div key={j} className="flex justify-between pl-3 opacity-60">
                  <span>{d.rate ? `${socialCompLabel(d.label, locale)} ${d.rate}` : d.label}</span>
                  <span>{d.capped ? "* " : ""}{fmt(d.amount)}</span>
                </div>
              ))}
              {sec.details?.some(d => d.capped) && <div className="pl-3 opacity-40 text-[12px] mt-0.5">* {t("taxBkCapped")}</div>}
            </div>
          );
        })}
        <div className="flex justify-between border-t border-[var(--border)] pt-1 font-bold">
          <span>{t("taxBkNet")}</span><span className="text-[var(--green)]">{fmt(bd.netLocal)}</span>
        </div>
        {taxResult && (
          <div className="flex justify-between"><span>{t("effectiveTaxRate")}</span><span>~{(taxResult.effectiveRate * 100).toFixed(1)}%</span></div>
        )}
        {bd.currencyCode !== s.currency && (
          <div className="flex justify-between">
            <span>→ {s.currency} <span className="opacity-60">(× {(s.currency === "USD" ? (1 / bd.fxRate) : (s.rates?.rates[s.currency] ?? 1) / bd.fxRate).toFixed(4)})</span></span>
            <span className="text-[var(--green)]">{fmtUser(bd.netUSD)}</span>
          </div>
        )}
        {bd.expatSchemeName && (() => {
          const expatResult = computeNetIncome(gross!, city.country, city.id, "expatNet", s.rates?.rates);
          if (!expatResult.hasExpatScheme || expatResult.netUSD <= bd.netUSD) return null;
          const expatNetLocal = expatResult.netUSD * bd.fxRate;
          const expatRate = (expatResult.effectiveRate * 100).toFixed(1);
          return (
            <div className="border-t border-[var(--border)] mt-2 pt-1 text-[12px] opacity-60">
              † {t("expatTip", { scheme: t(bd.expatSchemeName!), net: fmt(expatNetLocal), rate: expatRate })}
            </div>
          );
        })()}
      </div>
    );
  })() : null;

  // ── Sub-indicators with ranges, arrows, colors (top/bottom 20%) ──
  // Matches phase2 old version style: group header with score, rows with label(weight), value, range, arrow
  // Missing data: amber + line-through, empty value/range/arrow columns
  const sortedCache: Record<string, number[]> = {};
  const getSorted = (field: string) => sortedCache[field] ??= allCities.map(c => (c as any)[field]).filter((v: any): v is number => typeof v === "number").sort((a: number, b: number) => a - b);
  const judge = (val: number | null | undefined, field: string, higherBetter: boolean): "up" | "down" | "mid" | null => {
    if (val == null) return null;
    if (field === "_vpn") return val >= 100 ? "up" : val <= 0 ? "down" : "mid";
    const arr = getSorted(field); if (arr.length < 3) return null;
    const pct = arr.filter((v: number) => v <= val).length / arr.length;
    return higherBetter ? (pct >= 0.8 ? "up" : pct <= 0.2 ? "down" : "mid") : (pct <= 0.2 ? "up" : pct >= 0.8 ? "down" : "mid");
  };
  const rangeOf = (field: string) => {
    const arr = getSorted(field);
    if (arr.length < 2) return "";
    const lo = arr[0], hi = arr[arr.length - 1];
    // If both ends ≥ 1000, use k notation for both
    if (Math.abs(lo) >= 1000 && Math.abs(hi) >= 1000) {
      return `${Math.round(lo / 1000)}k–${Math.round(hi / 1000)}k`;
    }
    const f = (v: number) => {
      if (Math.abs(v) >= 10000) return `${Math.round(v / 1000)}k`;
      if (Math.abs(v) >= 100) return String(Math.round(v));
      if (Math.abs(v) >= 1) return v.toFixed(1);
      return v.toFixed(2);
    };
    return `${f(lo)}–${f(hi)}`;
  };
  const arrowSym = (j: "up" | "down" | "mid" | null) =>
    j === "up" ? <span style={{ color: "var(--green)", fontWeight: 700 }}>⬆︎</span>
    : j === "down" ? <span style={{ color: "var(--red)", fontWeight: 700 }}>⬇︎</span>
    : <span style={{ color: "var(--fg-muted)" }}>—</span>;

  type SubItem = { label: string; val: number | null | undefined; range: string; field: string; inv?: boolean; fmt: (v: number) => string };
  type SubGroup = { name: string; score: number | null; subs: SubItem[] };

  const subGroups: SubGroup[] = [
    { name: t("idxSafety"), score: cityIndices.safety, subs: [
      { label: `${t("gpiLabel")} (35%)`, val: city.gpiScore, range: rangeOf("gpiScore"), field: "gpiScore", inv: true, fmt: v => v.toFixed(2) },
      { label: `${t("safetyHomicide")} (25%)`, val: city.homicideRate, range: rangeOf("homicideRate"), field: "homicideRate", inv: true, fmt: v => v.toFixed(1) },
      { label: `${t("politicalStability")} (20%)`, val: city.politicalStability, range: rangeOf("politicalStability"), field: "politicalStability", fmt: v => v.toFixed(1) },
      { label: `${t("ruleLaw")} (20%)`, val: city.ruleLawWGI, range: rangeOf("ruleLawWGI"), field: "ruleLawWGI", fmt: v => v.toFixed(1) },
    ]},
    { name: t("idxHealthcare"), score: cityIndices.healthcare, subs: [
      { label: `${t("lifeExpectancy")} (35%)`, val: city.lifeExpectancy, range: rangeOf("lifeExpectancy"), field: "lifeExpectancy", fmt: v => v.toFixed(1) },
      { label: `${t("doctorsPerThousand")} (25%)`, val: city.doctorsPerThousand, range: rangeOf("doctorsPerThousand"), field: "doctorsPerThousand", fmt: v => v.toFixed(1) },
      { label: `${t("outOfPocket")} (25%)`, val: city.outOfPocketPct, range: rangeOf("outOfPocketPct"), field: "outOfPocketPct", inv: true, fmt: v => `${Math.round(v)}%` },
      { label: `${t("hospitalBeds")} (15%)`, val: city.hospitalBedsPerThousand, range: rangeOf("hospitalBedsPerThousand"), field: "hospitalBedsPerThousand", fmt: v => v.toFixed(1) },
    ]},
    { name: t("idxGovernance"), score: cityIndices.governance, subs: [
      { label: `${t("corruptionIdx")} (35%)`, val: city.corruptionPerceptionIndex, range: rangeOf("corruptionPerceptionIndex"), field: "corruptionPerceptionIndex", fmt: v => String(Math.round(v)) },
      { label: `${t("govEffect")} (25%)`, val: city.govEffectiveness, range: rangeOf("govEffectiveness"), field: "govEffectiveness", fmt: v => v.toFixed(1) },
      { label: `${t("regulatoryQualityLabel")} (20%)`, val: city.regulatoryQuality, range: rangeOf("regulatoryQuality"), field: "regulatoryQuality", fmt: v => v.toFixed(1) },
      { label: `${t("controlOfCorruption")} (20%)`, val: city.controlOfCorruption, range: rangeOf("controlOfCorruption"), field: "controlOfCorruption", fmt: v => v.toFixed(1) },
    ]},
    { name: t("idxFreedom"), score: cityIndices.freedom, subs: [
      { label: `${t("pressFreedomLabel")} (30%)`, val: city.pressFreedomScore, range: rangeOf("pressFreedomScore"), field: "pressFreedomScore", fmt: v => v.toFixed(1) },
      { label: `${t("democracyLabel")} (30%)`, val: city.democracyIndex, range: rangeOf("democracyIndex"), field: "democracyIndex", fmt: v => v.toFixed(1) },
      { label: `${t("giiLabel")} (20%)`, val: city.gii, range: rangeOf("gii"), field: "gii", inv: true, fmt: v => v.toFixed(3) },
      { label: `${t("vpnRestrictionLabel")} (20%)`, val: vpnMap.get(city.id) ?? null, range: "0–100", field: "_vpn", fmt: v => v === 100 ? t("nomadVPNFree") : v === 50 ? t("nomadVPNPartial") : t("nomadVPN") },
    ]},
    { name: t("idxEconomy"), score: cityIndices.economy, subs: [
      { label: `${t("inflationLabel")} (30%)`, val: city.inflationRate, range: rangeOf("inflationRate"), field: "inflationRate", inv: true, fmt: v => `${v.toFixed(1)}%` },
      { label: `${t("unemploymentLabel")} (30%)`, val: city.unemploymentRate, range: rangeOf("unemploymentRate"), field: "unemploymentRate", inv: true, fmt: v => `${v.toFixed(1)}%` },
      { label: `${t("gdpPppLabel")} (25%)`, val: city.gdpPppPerCapita, range: rangeOf("gdpPppPerCapita"), field: "gdpPppPerCapita", fmt: v => Math.round(v).toLocaleString() },
      { label: `${t("gdpGrowthLabel")} (15%)`, val: city.gdpGrowthRate, range: rangeOf("gdpGrowthRate"), field: "gdpGrowthRate", fmt: v => `${v.toFixed(1)}%` },
    ]},
  ];

  const subIndicators = (
    <div className="bg-[var(--surface)] rounded-[10px] p-3 text-[13px] text-[var(--fg-secondary)] space-y-0.5">
      {subGroups.map((g, gi) => (
        <div key={gi}>
          {gi > 0 && <div className="border-t border-[var(--border)] my-1" />}
          <div className="flex justify-between font-bold">
            <span>{g.name}</span>
            <span className="text-[var(--fg)]">{g.score?.toFixed(1) ?? "—"}</span>
          </div>
          {g.subs.map(sub => {
            const missing = sub.val == null;
            const j = judge(sub.val, sub.field, !sub.inv);
            return (
              <div key={sub.field} className={`flex items-center py-0.5 pl-3 ${missing ? "opacity-40 text-[var(--amber)]" : "opacity-60"}`}>
                <span className={`flex-1 min-w-0 truncate ${missing ? "line-through" : ""}`}>{sub.label}</span>
                <span className="w-14 text-right shrink-0 whitespace-nowrap">{missing ? "" : sub.fmt(sub.val!)}</span>
                <span className="w-16 text-right text-[11px] shrink-0 whitespace-nowrap">{missing ? "" : sub.range}</span>
                <span className="w-5 text-right shrink-0">{missing ? "" : arrowSym(j)}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  // ── Connectivity ──
  const visa = nomadData?.visa;
  const visaName = visa?.hasNomadVisa ? (localizeVisaName(visa.visaName, loc) ?? "—") : "—";
  const vpn = nomadData?.internet?.vpnRestricted;
  const vpnLabel = vpn === true ? t("nomadVPN") : vpn === "partial" ? t("nomadVPNPartial") : t("nomadVPNFree");
  const vpnColor = vpn === true ? "var(--red)" : vpn === "partial" ? "var(--amber)" : "var(--green)";
  const englishLabel = englishLevel ? t(`nomadEnglish${englishLevel}`) : "—";
  const englishColor = englishLevel === "A" ? "var(--green)" : (englishLevel === "C" || englishLevel === "D") ? "var(--amber)" : undefined;

  // ── Similar cities ──
  const similarCities = (() => {
    const allIncomes = computeAllNetIncomes(allCities, allCities.map(c => {
      const p = activeProfession && c.professions[activeProfession] != null ? c.professions[activeProfession] * salaryMultiplier : 0;
      return p;
    }), "net", s.rates?.rates);
    const curIncome = income ?? 0; const curCost = monthlyCost ?? 0;
    return allCities.filter(c => c.id !== city.id).map(c => {
      const oi = allIncomes[allCities.indexOf(c)];
      const diff = Math.abs(c.safetyIndex - city.safetyIndex) / 100 + Math.abs((c[costField] ?? 0) - curCost) / Math.max(curCost, 1) * 0.5 + Math.abs(oi - curIncome) / Math.max(curIncome, 1) * 0.3;
      return { c, diff, oi };
    }).sort((a, b) => a.diff - b.diff).slice(0, 4).map(({ c, oi }) => {
      const os = oi - (c[costField] ?? 0) * 12;
      const curSurplus = surplus ?? 0;
      const surplusDiff = curSurplus !== 0 ? Math.round((os / 12 - curSurplus / 12) / Math.abs(curSurplus / 12) * 100) : 0;
      const cd = curCost > 0 ? Math.round(((c[costField] ?? 0) - curCost) / curCost * 100) : 0;
      const label = Math.abs(surplusDiff) >= 10 ? `${t("labelMonthlySurplus")} ${surplusDiff > 0 ? "+" : ""}${surplusDiff}%` : Math.abs(cd) >= 10 ? `${t("monthlyCostShort")} ${cd > 0 ? "+" : ""}${cd}%` : `${t("safetyShort")} ≈`;
      const color = (surplusDiff > 0 && label.includes(t("labelMonthlySurplus"))) ? "var(--green)" : (cd < 0 && label.includes(t("monthlyCostShort"))) ? "var(--green)" : "var(--fg-muted)";
      return { flag: CITY_FLAG_EMOJIS[c.id] || "🏙️", name: CITY_NAME_TRANSLATIONS[c.id]?.[loc] || c.name, slug: CITY_SLUGS[c.id] || "", diff: label, diffColor: color };
    });
  })();

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--fg)]">
      <Nav locale={locale} s={s} />
      <div className="max-w-[640px] mx-auto px-4">
        <HeroSection flag={flag} cityName={cityName} countryName={countryName} tzLabel={tzLabel} intro={intro} tags={tags}
          safetyWarning={city.safetyWarning || null} warningText={warningText} />
        <MoneySection title={t("sectionMoney")}
          income={income !== null ? fmCompact(income) : null} incomeLabel={t("labelNetMonthly")}
          expense={monthlyCost !== null ? fc(monthlyCost) : "—"} expenseLabel={t("labelMonthlyCost")}
          surplus={surplus !== null ? fmCompact(surplus) : null} surplusLabel={t("labelMonthlySurplus")}
          surplusPositive={surplus !== null && surplus > 0}
          profLabel={`${profLabel} · ${t(`salaryTier_${salaryMultiplier}`)}`} insightText={moneyInsight}
          taxDetailContent={taxDetail} expandLabel={t("expandTaxDetail")} collapseLabel={t("collapseDetail")} />
        <SafetySection title={t("sectionSafety")} gradeLabel={t("labelOverallGrade")} grade={grade} gradeColor={gradeColorVal} bars={[
          { label: t("idxSafety"), value: cityIndices.safety, score: cityIndices.safety?.toFixed(1) ?? "—" },
          { label: t("idxHealthcare"), value: cityIndices.healthcare, score: cityIndices.healthcare?.toFixed(1) ?? "—" },
          { label: t("idxGovernance"), value: cityIndices.governance, score: cityIndices.governance?.toFixed(1) ?? "—" },
          { label: t("idxFreedom"), value: cityIndices.freedom, score: cityIndices.freedom?.toFixed(1) ?? "—" },
          { label: t("idxEconomy"), value: cityIndices.economy, score: cityIndices.economy?.toFixed(1) ?? "—" },
        ]} expandLabel={t("expandSubIndicators")} collapseLabel={t("collapseDetail")} detailContent={subIndicators} />
        <HealthLifeSection title={t("sectionLife")} items={[
          { label: t("healthcareShort"), value: String(Math.round(city.healthcareIndex)) },
          { label: t("airQuality"), value: city.airQuality != null ? `AQI ${city.airQuality}` : "—", color: city.airQuality != null && city.airQuality <= 50 ? "var(--green)" : city.airQuality != null && city.airQuality >= 80 ? "var(--amber)" : undefined },
          { label: t("avgTemp"), value: climate ? `${climate.avgTempC.toFixed(1)}°C` : "—" },
          { label: t("annualWorkHours"), value: city.annualWorkHours != null ? `${city.annualWorkHours}h` : "—" },
          { label: t("paidLeaveDays"), value: city.paidLeaveDays != null ? `${city.paidLeaveDays} ${t("paidLeaveDaysUnit")}` : "—" },
          { label: "HDI", value: city.hdi != null ? city.hdi.toFixed(3) : "—" },
          ...(climateLabel ? [{ label: t("climateType") || "气候", value: climateLabel }] : []),
        ]} insightHtml={healthInsight} climateContent={climate ? <ClimateChart climate={climate} locale={loc} darkMode={s.darkMode} t={t} /> : null} expandLabel={t("expandClimate") || "▾ 月度气候"} collapseLabel={t("collapseDetail")} />
        <ConnectivitySection title={t("sectionConnectivity") || "语言与连接"} items={[
          { label: t("languageLabel") || "语言", value: primaryLang || "—" },
          { label: t("englishLabel") || "英语", value: englishLabel, color: englishColor },
          { label: t("directFlights"), value: city.directFlightCities != null ? String(city.directFlightCities) : "—" },
          { label: "VPN", value: vpnLabel, color: vpnColor },
          { label: t("visaLabel") || "签证", value: visaName },
          { label: t("gmtOverlap") || "GMT重叠", value: nomadData?.timezoneOverlap?.overlapWithLondon != null ? `${nomadData.timezoneOverlap.overlapWithLondon}h` : "—" },
        ]} />
        <SimilarSection title={t("sectionSimilar") || "相似城市"} cities={similarCities} locale={locale} />
      </div>
      <Footer locale={locale} />
    </div>
  );
}
