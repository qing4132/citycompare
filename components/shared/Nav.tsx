"use client";

import { useState } from "react";
import Link from "next/link";
import type { CostTier } from "@/lib/types";
import { LANGUAGE_LABELS, PROFESSION_TRANSLATIONS } from "@/lib/i18n";
import { POPULAR_CURRENCIES } from "@/lib/constants";
import type { useSettings } from "@/hooks/useSettings";

type Settings = ReturnType<typeof useSettings>;

interface Props {
  locale: string;
  s?: Settings;
}

export default function Nav({ locale, s }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const selectCls = "text-xs rounded px-1.5 py-1 h-7 border w-full bg-[var(--bg)] border-[var(--border)] text-[var(--fg)]";
  const labelCls = "text-[11px] font-medium text-[var(--fg-muted)]";

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)] py-2.5">
      <div className="max-w-[640px] mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="text-[16px] font-black tracking-tight text-[var(--fg)]">WhichCity</Link>
          <button onClick={() => setSettingsOpen(v => !v)}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition ${settingsOpen ? "text-[var(--fg)] bg-[var(--surface)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}>
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
          </button>
        </div>

        {s && (
          <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${settingsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden min-h-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pt-3 pb-1">
                <label className="flex flex-col gap-0.5">
                  <span className={labelCls}>{s.t("settingProfession")}</span>
                  <select value={s.profession} onChange={e => s.setProfession(e.target.value)} className={selectCls}>
                    {Object.keys(PROFESSION_TRANSLATIONS).map(p => <option key={p} value={p}>{s.getProfessionLabel(p)}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-0.5">
                  <span className={labelCls}>{s.t("salaryMultiplier")}</span>
                  <select value={s.salaryMultiplier} onChange={e => s.setSalaryMultiplier(parseFloat(e.target.value))} className={selectCls}>
                    {[0.6, 0.8, 1, 1.5, 2, 3, 5].map(m => <option key={m} value={m}>{s.t(`salaryTier_${m}`)}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-0.5">
                  <span className={labelCls}>{s.t("settingCostTier")}</span>
                  <select value={s.costTier} onChange={e => s.setCostTier(e.target.value as CostTier)} className={selectCls}>
                    {(["moderate", "budget"] as const).map(tier => <option key={tier} value={tier}>{s.t(`costTier${tier.charAt(0).toUpperCase()}${tier.slice(1)}`)}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-0.5">
                  <span className={labelCls}>{s.t("settingLanguage")}</span>
                  <select value={s.locale} onChange={e => s.setLocale(e.target.value as any)} className={selectCls}>
                    {(Object.keys(LANGUAGE_LABELS) as any[]).map(lang => <option key={lang} value={lang}>{LANGUAGE_LABELS[lang]}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-0.5">
                  <span className={labelCls}>{s.t("settingCurrency")}</span>
                  <select value={s.currency} onChange={e => s.setCurrency(e.target.value)} className={selectCls}>
                    {POPULAR_CURRENCIES.map(cur => <option key={cur} value={cur}>{cur}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-0.5">
                  <span className={labelCls}>{s.t("settingTheme")}</span>
                  <select value={s.themeMode} onChange={e => s.setThemeMode(e.target.value as any)} className={selectCls}>
                    <option value="auto">{s.t("themeAuto")}</option>
                    <option value="light">{s.t("dayMode")}</option>
                    <option value="dark">{s.t("nightMode")}</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
