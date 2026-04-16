"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { City } from "@/lib/types";
import { CITY_NAME_TRANSLATIONS } from "@/lib/i18n";
import { CITY_FLAG_EMOJIS } from "@/lib/constants";
import { CITY_SLUGS } from "@/lib/citySlug";
import { computeAllNetIncomes } from "@/lib/taxUtils";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";

interface Props { cities: City[]; locale: string }

export default function RankingPage({ cities, locale }: Props) {
  const loc = locale as "zh" | "en" | "ja" | "es";
  const profession = "软件工程师";

  const rows = useMemo(() => {
    const grossArr = cities.map(c => c.professions[profession] ?? 0);
    const incomes = computeAllNetIncomes(cities, grossArr, "net");
    return cities.map((c, i) => {
      const income = incomes[i];
      const cost = c.costModerate ?? 0;
      const surplus = income - cost * 12;
      const monthly = Math.round(surplus / 12);
      return { city: c, income, surplus, monthly, safety: c.safetyIndex };
    }).sort((a, b) => b.monthly - a.monthly);
  }, [cities]);

  const getName = (id: number) => CITY_NAME_TRANSLATIONS[id]?.[loc] || CITY_NAME_TRANSLATIONS[id]?.en || "";

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--fg)]">
      <Nav locale={locale} />
      <div className="max-w-[640px] mx-auto px-4 pt-6 pb-8">
        <h1 className="text-lg font-black text-center mb-1">软件工程师，去哪存钱最多？</h1>
        <p className="text-xs text-[var(--fg-muted)] text-center mb-6">基于税后收入减生活成本 · 150+ 城市</p>

        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b-2 border-[var(--border)]">
              <th className="text-left py-2 font-bold text-[var(--fg-muted)] w-8">#</th>
              <th className="text-left py-2 font-bold text-[var(--fg-muted)]">城市</th>
              <th className="text-right py-2 font-bold text-[var(--fg-muted)]">月结余</th>
              <th className="text-right py-2 font-bold text-[var(--fg-muted)]">安全</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const slug = CITY_SLUGS[r.city.id];
              const flag = CITY_FLAG_EMOJIS[r.city.id] || "🏙️";
              const isTop = i < Math.ceil(rows.length * 0.2);
              return (
                <tr key={r.city.id} className="border-b border-[var(--border-light)] hover:bg-[var(--surface)] transition-colors">
                  <td className={`py-2 font-bold ${isTop ? "text-[var(--green)]" : "text-[var(--fg-muted)]"}`}>{i + 1}</td>
                  <td className="py-2">
                    <Link href={`/${locale}/city/${slug}`} className="hover:underline">
                      {flag} {getName(r.city.id)}
                    </Link>
                  </td>
                  <td className={`py-2 text-right font-bold ${r.monthly > 0 ? "" : "text-[var(--red)]"}`}>
                    ${Math.abs(r.monthly).toLocaleString()}
                  </td>
                  <td className="py-2 text-right text-[var(--fg-secondary)]">{Math.round(r.city.safetyIndex)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer locale={locale} />
    </div>
  );
}
