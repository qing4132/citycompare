"use client";

import { useState, useEffect, useCallback } from "react";
import type { City, CostTier } from "@/lib/types";
import type { NomadCityData, VisaFreeMatrix } from "@/lib/nomadData";
import { CITY_FLAG_EMOJIS } from "@/lib/constants";
import { CITY_NAME_TRANSLATIONS, COUNTRY_TRANSLATIONS, socialCompLabel } from "@/lib/i18n";
import { CITY_LANGUAGES, LANGUAGE_NAME_TRANSLATIONS } from "@/lib/cityLanguages";
import NavBar from "./NavBar";
import { computeLifePressure, getClimateLabel } from "@/lib/clientUtils";
import { trackEvent } from "@/lib/analytics";
import { useSettings } from "@/hooks/useSettings";
import { computeNetIncome, computeAllNetIncomes, computeTaxBreakdown } from "@/lib/taxUtils";
import ClimateChart from "./ClimateChart";
import HeroSection from "./city-detail/HeroSection";
import NomadSection from "./city-detail/NomadSection";
import SimilarCities from "./city-detail/SimilarCities";
import VerdictCard from "./city-detail/VerdictCard";
import InsightBox from "./city-detail/InsightBox";
import IndexBars from "./city-detail/IndexBars";

interface Props {
  city: City; slug: string; allCities: City[]; locale: string;
  nomadData?: NomadCityData | null; visaMatrix?: VisaFreeMatrix | null;
}

const TIER_KEYS: { key: CostTier; field: "costModerate" | "costBudget"; labelKey: string }[] = [
  { key: "moderate", field: "costModerate", labelKey: "costTierModerate" },
  { key: "budget", field: "costBudget", labelKey: "costTierBudget" },
];

export default function CityDetailContent({ city, slug, allCities, locale: urlLocale, nomadData, visaMatrix }: Props) {
  const s = useSettings(urlLocale);
  const { locale, darkMode, t, formatCurrency, formatCompact, costTier, profession, incomeMode, salaryMultiplier } = s;
  const cjk = locale === "zh" || locale === "ja";
  const compactVal = (amount: number, unitPx = 37) => {
    const { num, unit } = formatCompact(amount);
    if (!unit || !cjk) return <>{num}{unit}</>;
    return <>{num}<span className="relative -top-[2px] font-[var(--font-cjk)]" style={{ fontSize: `${unitPx}px`, WebkitTextStroke: unitPx >= 30 ? "2px" : "1px" }}>{unit}</span></>;
  };
  const compactStr = (amount: number) => { const { num, unit } = formatCompact(amount); return `${num}${unit}`; };

  const cityName = CITY_NAME_TRANSLATIONS[city.id]?.[locale] || city.name;
  const countryName = COUNTRY_TRANSLATIONS[city.country]?.[locale] || city.country;
  useEffect(() => { document.title = `${cityName} | WhichCity`; }, [locale, cityName]);
  useEffect(() => { trackEvent("city_view", { city_slug: slug }); }, [slug]);

  const [taxOpen, setTaxOpen] = useState(false);
  const [shfOpen, setShfOpen] = useState(false);
  const [showCityInNav, setShowCityInNav] = useState(false);
  const [heroEl, setHeroEl] = useState<HTMLDivElement | null>(null);
  const heroRef = useCallback((node: HTMLDivElement | null) => setHeroEl(node), []);

  useEffect(() => {
    if (!heroEl) return;
    const ob = new IntersectionObserver(([entry]) => setShowCityInNav(!entry.isIntersecting), { threshold: 0, rootMargin: "-48px 0px 0px 0px" });
    ob.observe(heroEl);
    return () => ob.disconnect();
  }, [heroEl]);

  if (!s.mounted) return null;
  if (!s.ready) return (
    <div className={`min-h-screen transition-colors ${darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
      <NavBar s={s} compareHref={`/${locale}/compare/${slug}`} excludeSlug={slug} showShare isCityDetail />
    </div>
  );

  const id = city.id;
  const flag = CITY_FLAG_EMOJIS[id] || "🏙️";
  const climate = city.climate ?? null;
  const professions = city.professions ? Object.keys(city.professions) : [];
  const activeProfession = profession && professions.includes(profession) ? profession : professions[0] || "";
  const grossIncome = activeProfession && city.professions[activeProfession] != null ? city.professions[activeProfession] * salaryMultiplier : null;
  const taxResult = grossIncome !== null ? computeNetIncome(grossIncome, city.country, city.id, incomeMode, s.rates?.rates) : null;
  const income = taxResult?.netUSD ?? null;
  const costTierField = TIER_KEYS.find(tk => tk.key === costTier)!.field;
  const tierCost = city[costTierField];
  const savings = income !== null ? income - tierCost * 12 : null;
  const savingsRate = income !== null && income > 0 ? Math.round((savings! / income) * 100) : 0;
  const yearsToBuy = city.housePrice != null && savings !== null && savings > 0 ? (city.housePrice * 70) / savings : Infinity;
  const hourlyWage = city.annualWorkHours != null && city.annualWorkHours > 0 && income !== null ? income / city.annualWorkHours : 0;

  const allGross = allCities.map(c => activeProfession && c.professions[activeProfession] != null ? c.professions[activeProfession] * salaryMultiplier : 0);
  const allIncomes = computeAllNetIncomes(allCities, allGross, incomeMode, s.rates?.rates);
  const allCosts = allCities.map(c => c[costTierField]);
  const allSavings = allCities.map((c, i) => allIncomes[i] - allCosts[i] * 12);
  const lpResult = computeLifePressure(city, allCities, income ?? 0, allIncomes, costTierField);
  const allLifePressure = allCities.map((c, i) => computeLifePressure(c, allCities, allIncomes[i], allIncomes, costTierField).value);
  const n = allCities.length;

  const rankHigher = (values: number[], val: number) => {
    const unique = [...new Set(values)].sort((a, b) => b - a);
    let rank = 1;
    for (const v of unique) { if (val >= v) return rank; rank += values.filter(x => x === v).length; }
    return values.length;
  };
  type Tier = "good" | "mid" | "bad";
  const tierHigh = (values: number[], val: number): Tier => {
    const r = rankHigher(values, val), tot = values.length;
    return r <= tot * 0.2 ? "good" : r > tot * 0.8 ? "bad" : "mid";
  };

  const allSafety = allCities.map(c => c.safetyIndex);
  const allHealth = allCities.map(c => c.healthcareIndex);
  const allGovernance = allCities.map(c => c.governanceIndex);
  const shfSum = city.safetyIndex + city.healthcareIndex + city.governanceIndex;
  const allShfSums = allCities.map(c => c.safetyIndex + c.healthcareIndex + c.governanceIndex);
  const shfRank = rankHigher(allShfSums, shfSum);
  const baseGrade = shfRank <= n * 0.25 ? "A" : shfRank <= n * 0.50 ? "B" : shfRank <= n * 0.75 ? "C" : "D";
  const allGreen = tierHigh(allSafety, city.safetyIndex) === "good" && tierHigh(allHealth, city.healthcareIndex) === "good" && tierHigh(allGovernance, city.governanceIndex) === "good";
  const grade = baseGrade === "A" && allGreen ? "S" : baseGrade;

  const headCls = darkMode ? "text-slate-100" : "text-slate-900";
  const labelCls = darkMode ? "text-slate-400" : "text-slate-400";
  const subCls = darkMode ? "text-slate-500" : "text-slate-500";
  const divider = darkMode ? "border-slate-800" : "border-slate-100";
  const greenCls = darkMode ? "text-green-400" : "text-green-600";
  const redCls = darkMode ? "text-rose-400" : "text-rose-500";
  const cardValCls = (tier: Tier) => tier === "good" ? greenCls : tier === "bad" ? redCls : headCls;

  const langs = CITY_LANGUAGES[id] || [];
  const localizedLangs = langs.map(l => LANGUAGE_NAME_TRANSLATIONS[l]?.[locale] || l);
  const englishLevel = nomadData?.english?.cityRating ?? null;

  const allHealthSorted = [...allHealth].sort((a, b) => a - b);
  const healthPct = allHealthSorted.filter(v => v <= city.healthcareIndex).length / allHealthSorted.length;
  const healthPctDesc = healthPct >= 0.85 ? t("pctTop15") : healthPct >= 0.70 ? t("pctTop30") : healthPct >= 0.40 ? t("pctMid") : t("pctBottom");

  const confLevel = (city.securityConfidence >= 90 ? "high" : city.securityConfidence >= 70 ? "medium" : "low") as "high" | "medium" | "low";
  const hasSafetyWarn = !!city.safetyWarning;
  const hasWarn = hasSafetyWarn || confLevel !== "high";
  const warnAmberCls = darkMode ? "text-amber-400" : "text-amber-600";
  const warnRedCls = darkMode ? "text-rose-400" : "text-rose-500";
  const gradeCls = hasWarn ? (hasSafetyWarn ? warnRedCls : warnAmberCls) : grade === "S" || grade === "A" ? greenCls : grade === "D" ? redCls : headCls;
  const gradeDisplay = hasWarn ? `* ${grade}` : grade;
  const heroGrade = { grade, gradeDisplay, gradeCls, hasSafetyWarn, confLevel, safetyWarning: city.safetyWarning, warnRedCls, warnAmberCls };

  const profLabel = s.getProfessionLabel(activeProfession);
  const moneyInsight = isFinite(yearsToBuy)
    ? t("insightMoney", { profession: profLabel, city: cityName, rate: String(savingsRate), sqm: "60", years: yearsToBuy.toFixed(1) })
    : (income !== null ? t("insightMoneyNoHouse", { profession: profLabel, city: cityName, rate: String(savingsRate) }) : "");
  const healthInsight = t("insightHealth", {
    doctors: city.doctorsPerThousand?.toFixed(1) ?? "—", uhc: String(city.uhcCoverageIndex != null ? Math.round(city.uhcCoverageIndex) : "—"),
    life: city.lifeExpectancy?.toFixed(1) ?? "—", pctDesc: healthPctDesc,
  });
  const envInsight = t("insightEnv", {
    langs: localizedLangs.slice(0, 2).join(" · ") || "—", english: englishLevel ? t(`nomadEnglish${englishLevel}`) : "—",
    flights: String(city.directFlightCities ?? "—"),
  });

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
      <NavBar s={s} professionValue={activeProfession} professions={professions} compareHref={`/${locale}/compare/${slug}`} excludeSlug={slug} showShare
        isCityDetail cityFlag={flag} cityNameText={cityName} showCityInNav={showCityInNav} />

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Hero */}
        <HeroSection ref={heroRef} city={city} cityName={cityName} countryName={countryName} flag={flag} slug={slug} locale={locale} darkMode={darkMode} t={t}
          gradeInfo={heroGrade} englishLabel={englishLevel ? t(`nomadEnglish${englishLevel}`) : undefined} />

        {/* Verdict Card */}
        <div className="mt-4">
          <VerdictCard city={city} grade={grade} darkMode={darkMode} income={income} savings={savings} savingsRate={savingsRate}
            effectiveTaxRate={taxResult?.effectiveRate ?? null} professionLabel={profLabel} cityName={cityName}
            formatCompactStr={compactStr} t={t} englishLevel={englishLevel} />
        </div>

        {/* Income & Expenses */}
        <div className={`py-3.5 border-b ${divider}`}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[15px]">💰</span>
            <span className={`text-[15px] font-extrabold ${headCls}`}>{t("sectionMoney")}</span>
          </div>
          <div className="flex gap-4 mb-1 flex-wrap">
            <div>
              <div className={`text-[30px] font-black leading-none ${income !== null ? cardValCls(tierHigh(allIncomes, income)) : headCls}`}>
                {income !== null ? compactVal(income / 12, 25) : "—"}
              </div>
              <div className={`text-[12px] ${labelCls}`}>{t("labelNetMonthly")}</div>
            </div>
            <div>
              <div className={`text-[30px] font-black leading-none ${darkMode ? "text-amber-400" : "text-amber-600"}`}>{compactVal(tierCost, 25)}</div>
              <div className={`text-[12px] ${labelCls}`}>{t("labelMonthlyCost")}</div>
            </div>
            <div>
              <div className={`text-[30px] font-black leading-none ${savings !== null ? cardValCls(tierHigh(allSavings, savings)) : headCls}`}>
                {savings !== null ? compactVal(savings / 12, 25) : "—"}
              </div>
              <div className={`text-[12px] ${labelCls}`}>{t("labelMonthlySurplus")}</div>
            </div>
          </div>
          <div className={`text-[12px] ${labelCls}`}>{profLabel} · {t(`salaryTier_${salaryMultiplier}`)}</div>
          {moneyInsight && <InsightBox text={moneyInsight} darkMode={darkMode} />}
          <div className={`text-[11px] text-center mt-2 cursor-pointer select-none ${subCls}`}
            onClick={() => setTaxOpen(!taxOpen)} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && setTaxOpen(!taxOpen)}>
            {taxOpen ? t("collapseDetail") : t("expandTaxDetail")}
          </div>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${taxOpen ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
            {grossIncome !== null && (() => {
              const bd = computeTaxBreakdown(grossIncome, city.country, city.id, s.rates?.rates);
              if (!bd) return null;
              const fmt = (v: number) => `${bd.currencyCode} ${Math.round(Math.abs(v)).toLocaleString()}`;
              const fmtUser = (usd: number) => { const r = s.rates?.rates; const val = r && s.currency !== "USD" ? usd * (r[s.currency] ?? 1) : usd; return `${s.currency} ${Math.round(val).toLocaleString()}`; };
              return (
                <div className={`text-[13px] ${subCls} space-y-0.5`}>
                  <div className="flex justify-between font-bold"><span>{t("taxBkGross")}</span><span className={headCls}>{fmt(bd.grossLocal)}</span></div>
                  {bd.sections.map((sec, i) => {
                    const prev = i > 0 ? bd.sections[i - 1] : null;
                    const needDivider = (sec.isInfo && (!prev || !prev.isInfo)) || (sec.isResult && prev?.isInfo);
                    return (
                      <div key={i}>
                        {needDivider && <div className={`border-t ${divider} mt-0.5`} />}
                        {sec.isResult ? (
                          <div className="flex justify-between font-semibold pt-0.5"><span>{t(sec.label)}</span><span className={headCls}>{fmt(sec.total)}</span></div>
                        ) : sec.isInfo ? (
                          <div className="flex justify-between pt-0.5"><span>{t(sec.label)}</span><span>{fmt(sec.total)}</span></div>
                        ) : (
                          <div className={`flex justify-between font-semibold ${sec.total < 0 ? redCls : ""}`}>
                            <span>{sec.total < 0 ? "−" : ""} {t(sec.label)}</span><span>{fmt(sec.total)}</span>
                          </div>
                        )}
                        {sec.details?.map((d, j) => (
                          <div key={j} className="flex justify-between pl-3 opacity-60">
                            <span>{d.rate ? `${socialCompLabel(d.label, locale)} ${d.rate}` : d.label}</span><span>{d.capped ? "* " : ""}{fmt(d.amount)}</span>
                          </div>
                        ))}
                        {sec.details?.some(d => d.capped) && <div className="pl-3 opacity-40 text-[12px] mt-0.5">* {t("taxBkCapped")}</div>}
                      </div>
                    );
                  })}
                  <div className={`flex justify-between border-t pt-1 font-bold ${divider}`}><span>{t("taxBkNet")}</span><span className={greenCls}>{fmt(bd.netLocal)}</span></div>
                  {incomeMode !== "gross" && taxResult !== null && !taxResult.dataIsLikelyNet && (
                    <div className="flex justify-between mt-1"><span>{t("effectiveTaxRate")}</span><span>~{(taxResult.effectiveRate * 100).toFixed(1)}%</span></div>
                  )}
                  {bd.currencyCode !== s.currency && (
                    <div className="flex justify-between">
                      <span>→ {s.currency} <span className="opacity-60">(× {(s.currency === "USD" ? (1 / bd.fxRate) : (s.rates?.rates[s.currency] ?? 1) / bd.fxRate).toFixed(4)})</span></span>
                      <span className={greenCls}>{fmtUser(bd.netUSD)}</span>
                    </div>
                  )}
                  {bd.expatSchemeName && (() => {
                    const expatResult = computeNetIncome(grossIncome!, city.country, city.id, "expatNet", s.rates?.rates);
                    if (!expatResult.hasExpatScheme || expatResult.netUSD <= bd.netUSD) return null;
                    const expatNetLocal = expatResult.netUSD * bd.fxRate;
                    const expatRate = (expatResult.effectiveRate * 100).toFixed(1);
                    const condKey: Record<string, string> = {
                      expatScheme30Ruling: "expatCond30Ruling", expatSchemeBeckham: "expatCondBeckham",
                      expatSchemeImpatriati: "expatCondImpatriati", expatSchemeNHR: "expatCondNHR",
                      expatScheme19Flat: "expatCond19Flat", expatSchemeCPF: "expatCondCPF",
                    };
                    const tipKey = bd.expatSchemeName === "expatSchemeCPF" ? "expatTipCPF" : "expatTip";
                    const converted = bd.currencyCode !== s.currency ? `（${fmtUser(expatResult.netUSD)}）` : "";
                    return (
                      <>
                        <div className={`border-t ${divider} mt-2`} />
                        <div className={`text-[13px] ${subCls} mt-1.5 opacity-60`}>
                          † {t(tipKey, { scheme: t(bd.expatSchemeName!), cond: t(condKey[bd.expatSchemeName!] || ""), net: fmt(expatNetLocal), converted, rate: expatRate })}
                        </div>
                      </>
                    );
                  })()}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Safety & Social Security */}
        <div className={`py-3.5 border-b ${divider}`}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[15px]">🛡️</span>
            <span className={`text-[15px] font-extrabold ${headCls}`}>{t("sectionSafety")}</span>
          </div>
          <div className="flex gap-5 mb-2">
            <div>
              <div className={`text-[36px] font-black leading-none ${gradeCls}`}>{gradeDisplay}</div>
              <div className={`text-[12px] ${labelCls}`}>{t("labelOverallGrade")}</div>
              {hasSafetyWarn && (
                <div className={`text-[11px] mt-0.5 ${warnRedCls}`}>
                  {city.safetyWarning === "active_conflict" ? t("safetyWarningConflict") : t("safetyWarningInstability")}
                </div>
              )}
            </div>
            <div className="flex-1">
              <IndexBars darkMode={darkMode} items={[
                { label: t("safetyShort"), value: city.safetyIndex },
                { label: t("healthcareShort"), value: city.healthcareIndex },
                { label: t("governanceShort"), value: city.governanceIndex },
                { label: t("freedomShort"), value: city.freedomIndex },
              ]} />
            </div>
          </div>
          <InsightBox text={healthInsight} darkMode={darkMode} />
          <div className={`text-[11px] text-center mt-2 cursor-pointer select-none ${subCls}`}
            onClick={() => setShfOpen(!shfOpen)} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && setShfOpen(!shfOpen)}>
            {shfOpen ? t("collapseDetail") : t("expandSubIndicators")}
          </div>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${shfOpen ? "max-h-[800px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
            <SubIndicators city={city} allCities={allCities} darkMode={darkMode} t={t} headCls={headCls} subCls={subCls} divider={divider} />
          </div>
        </div>

        {/* Life & Environment */}
        <div className={`py-3.5 border-b ${divider}`}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[15px]">🌤️</span>
            <span className={`text-[15px] font-extrabold ${headCls}`}>{t("sectionLife")}</span>
          </div>
          <div className="flex gap-3 flex-wrap mb-1">
            {[
              { label: t("avgTemp"), val: climate ? `${climate.avgTempC.toFixed(1)}°C` : "—" },
              { label: t("airQuality"), val: city.airQuality != null ? `AQI ${city.airQuality}` : "—" },
              { label: t("annualWorkHours"), val: city.annualWorkHours != null ? `${city.annualWorkHours}h` : "—" },
              { label: t("paidLeaveDays"), val: city.paidLeaveDays != null ? `${city.paidLeaveDays} ${t("paidLeaveDaysUnit")}` : "—" },
            ].map(item => (
              <div key={item.label} className="text-center min-w-[70px]">
                <div className={`text-[20px] font-black ${headCls}`}>{item.val}</div>
                <div className={`text-[12px] ${labelCls}`}>{item.label}</div>
              </div>
            ))}
          </div>
          <InsightBox text={envInsight} darkMode={darkMode} />
        </div>

        {/* Climate */}
        {climate && (
          <div className={`py-3.5 border-b ${divider}`}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[15px]">📊</span>
              <span className={`text-[15px] font-extrabold ${headCls}`}>{t("sectionClimate")}</span>
            </div>
            <ClimateChart climate={climate} locale={locale} darkMode={darkMode} t={t} hideTitle hideLegend />
            <div className={`mt-2 text-center text-[11px] ${subCls}`}>
              {getClimateLabel(climate.type, locale)} · {t("annualRain")} {Math.round(climate.annualRainMm)} mm · {t("sunshine")} {Math.round(climate.sunshineHours)} {t("unitH")} · {t("humidity")} {climate.humidityPct}%
            </div>
          </div>
        )}

        {/* Nomad */}
        {nomadData && <NomadSection city={city} cityName={cityName} locale={locale} darkMode={darkMode} t={t} nomadData={nomadData} visaMatrix={visaMatrix ?? null} />}

        {/* Similar Cities */}
        <SimilarCities city={city} slug={slug} allCities={allCities} allIncomes={allIncomes}
          allLifePressure={allLifePressure} costTierField={costTierField}
          income={income} tierCost={tierCost} savings={savings}
          hourlyWage={hourlyWage} lifePressure={lpResult.value}
          locale={locale} darkMode={darkMode} t={t}
          costTier={costTier} incomeMode={incomeMode} salaryMultiplier={salaryMultiplier}
          activeProfession={activeProfession} rates={s.rates?.rates} />
      </div>

      <footer className={`px-4 py-5 text-center text-[12px] ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
        <div className={`max-w-2xl mx-auto border-t pt-4 ${divider}`}>
          <p>{t("dataSrcFooter")}</p>
          <p className="mt-1">
            <a href={`/${locale}/methodology`} className="underline hover:text-blue-500">{t("navMethodology")}</a>
            {" · "}<a href="https://github.com/qing4132/whichcity/issues" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">GitHub</a>
            {" · "}<a href="mailto:qing4132@users.noreply.github.com" className="underline hover:text-blue-500">{t("footerFeedback")}</a>
          </p>
          <p className="mt-1 opacity-60">{t("dataSrcDisclaimer")}</p>
        </div>
      </footer>
    </div>
  );
}

/* Sub-Indicators panel */
function SubIndicators({ city, allCities, darkMode, t, headCls, subCls, divider }: {
  city: City; allCities: City[]; darkMode: boolean; t: (k: string) => string; headCls: string; subCls: string; divider: string;
}) {
  const greenCls = darkMode ? "text-green-400" : "text-green-600";
  const redCls2 = darkMode ? "text-rose-400" : "text-rose-500";
  const warnCls = darkMode ? "text-amber-400" : "text-amber-600";
  const cache: Record<string, number[]> = {};
  const getSorted = (field: string) => cache[field] ??= allCities.map(c => (c as unknown as Record<string, unknown>)[field]).filter((v): v is number => typeof v === "number").sort((a, b) => a - b);
  const judge = (val: number | null | undefined, field: string, higherBetter: boolean) => {
    if (val == null) return null;
    const s2 = getSorted(field); if (s2.length < 3) return null;
    const pct = s2.filter(v => v <= val).length / s2.length;
    return higherBetter ? (pct >= 0.7 ? "up" : pct <= 0.3 ? "down" : "mid") : (pct <= 0.3 ? "up" : pct >= 0.7 ? "down" : "mid");
  };
  const sym = (j: string | null) => j === "up" ? <span className={`font-bold ${greenCls}`}>⬆︎</span> : j === "down" ? <span className={`font-bold ${redCls2}`}>⬇︎</span> : <span className={headCls}>—</span>;
  type Sub = { label: string; val: number | null | undefined; range: string; field: string; inv?: boolean; fmt: (v: number) => string };
  const groups: { name: string; score: number; subs: Sub[] }[] = [
    { name: t("safetyShort"), score: city.safetyIndex, subs: [
      { label: `${t("safetyHomicide")} (35%)`, val: city.homicideRate, range: "0.1–46", field: "homicideRate", inv: true, fmt: v => v.toFixed(1) },
      { label: `${t("politicalStability")} (25%)`, val: city.politicalStability, range: "0–100", field: "politicalStability", fmt: v => v.toFixed(1) },
      { label: `${t("ruleLaw")} (20%)`, val: city.ruleLawWGI, range: "0–100", field: "ruleLawWGI", fmt: v => v.toFixed(1) },
      { label: `${t("controlOfCorruption")} (20%)`, val: city.controlOfCorruption, range: "0–100", field: "controlOfCorruption", fmt: v => v.toFixed(1) },
    ]},
    { name: t("healthcareShort"), score: city.healthcareIndex, subs: [
      { label: `${t("doctorsPerThousand")} (25%)`, val: city.doctorsPerThousand, range: "0.2–7.0", field: "doctorsPerThousand", fmt: v => v.toFixed(1) },
      { label: `${t("hospitalBeds")} (20%)`, val: city.hospitalBedsPerThousand, range: "0.3–13", field: "hospitalBedsPerThousand", fmt: v => v.toFixed(1) },
      { label: `${t("uhcCoverage")} (25%)`, val: city.uhcCoverageIndex, range: "40–92", field: "uhcCoverageIndex", fmt: v => String(Math.round(v)) },
      { label: `${t("lifeExpectancy")} (15%)`, val: city.lifeExpectancy, range: "54–85", field: "lifeExpectancy", fmt: v => v.toFixed(1) },
      { label: `${t("outOfPocket")} (15%)`, val: city.outOfPocketPct, range: "7–71%", field: "outOfPocketPct", inv: true, fmt: v => `${Math.round(v)}%` },
    ]},
    { name: t("governanceShort"), score: city.governanceIndex, subs: [
      { label: `${t("corruptionIdx")} (50%)`, val: city.corruptionPerceptionIndex, range: "22–90", field: "corruptionPerceptionIndex", fmt: v => String(Math.round(v)) },
      { label: `${t("govEffect")} (50%)`, val: city.govEffectiveness, range: "21–96", field: "govEffectiveness", fmt: v => v.toFixed(1) },
    ]},
  ];
  return (
    <div className={`text-[13px] ${subCls} space-y-0.5`}>
      {groups.map((g, gi) => (
        <div key={gi}>
          {gi > 0 && <div className={`border-t ${divider} my-1`} />}
          <div className="flex justify-between font-bold"><span>{g.name}</span><span className={headCls}>{g.score.toFixed(1)}</span></div>
          {g.subs.map(sub => {
            const missing = sub.val == null;
            const j = judge(sub.val, sub.field, !sub.inv);
            return (
              <div key={sub.field} className={`flex items-center py-0.5 pl-3 ${missing ? `opacity-40 ${warnCls}` : "opacity-60"}`}>
                <span className={`flex-1 min-w-0 truncate ${missing ? "line-through" : ""}`}>{sub.label}</span>
                <span className="w-11 text-right shrink-0">{missing ? "" : sub.fmt(sub.val!)}</span>
                <span className="w-[50px] text-right text-[11px] shrink-0">{missing ? "" : sub.range}</span>
                <span className="w-6 text-right shrink-0">{missing ? "" : sym(j)}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
