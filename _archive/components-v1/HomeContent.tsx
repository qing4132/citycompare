"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CITY_NAME_TRANSLATIONS, COUNTRY_TRANSLATIONS } from "@/lib/i18n";
import { CITY_FLAG_EMOJIS, CITY_COUNTRY, HIDDEN_CITY_IDS } from "@/lib/constants";
import { CITY_SLUGS } from "@/lib/citySlug";
import { useSettings } from "@/hooks/useSettings";
import { trackEvent } from "@/lib/analytics";
import NavBar from "./NavBar";

const CITY_LIST = Object.entries(CITY_SLUGS).map(([idStr, slug]) => {
  const id = Number(idStr);
  return { id, slug, flag: CITY_FLAG_EMOJIS[id] || "🏙️" };
}).filter(c => !HIDDEN_CITY_IDS.has(c.id));

const POPULAR_HOME = ["tokyo", "new-york", "london", "singapore", "berlin", "dubai",
  "bangkok", "sydney", "amsterdam", "toronto", "lisbon", "seoul"]
  .map(slug => CITY_LIST.find(c => c.slug === slug))
  .filter((c): c is NonNullable<typeof c> => c !== undefined);

export default function HomeContent({ locale: urlLocale }: { locale: string }) {
  const router = useRouter();
  const s = useSettings(urlLocale);
  const { locale, darkMode, t } = s;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [hlIdx, setHlIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 100);
    return () => window.clearTimeout(timer);
  }, [search]);

  const results = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    const q = debouncedSearch.toLowerCase();
    return CITY_LIST.filter(c => {
      const names = CITY_NAME_TRANSLATIONS[c.id];
      if (!names) return false;
      if (Object.values(names).some(n => n.toLowerCase().includes(q))) return true;
      if (c.slug.replace(/-/g, " ").includes(q)) return true;
      const countryZh = CITY_COUNTRY[c.id];
      if (countryZh) {
        const countryNames = COUNTRY_TRANSLATIONS[countryZh];
        if (countryNames && Object.values(countryNames).some(n => n.toLowerCase().includes(q))) return true;
      }
      return false;
    });
  }, [debouncedSearch]);

  useEffect(() => {
    setHlIdx(-1);
  }, [debouncedSearch, focused]);

  const visibleResults = results.slice(0, 8);
  const hasMoreResults = results.length > visibleResults.length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getCityName = (id: number) => CITY_NAME_TRANSLATIONS[id]?.[locale] || CITY_NAME_TRANSLATIONS[id]?.en || "";
  const getCountryName = (id: number) => {
    const zh = CITY_COUNTRY[id];
    return zh ? (COUNTRY_TRANSLATIONS[zh]?.[locale] || zh) : "";
  };

  useEffect(() => { document.title = "WhichCity"; }, [locale]);

  if (!s.mounted) return null;

  const headCls = darkMode ? "text-slate-100" : "text-slate-900";
  const subCls = darkMode ? "text-slate-500" : "text-slate-500";
  const divider = darkMode ? "border-slate-800" : "border-slate-100";

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>

      <NavBar s={s} activePage="home" showShare />

      {!s.ready ? null : (
        <div className="max-w-2xl mx-auto w-full px-4 pt-10 pb-8 flex-1">

          {/* Hero */}
          <div className="text-center mb-8">
            <div className={`text-sm font-black tracking-wide mb-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>WHICHCITY</div>
            <h1 className={`text-2xl sm:text-[32px] font-black tracking-tight leading-tight mb-3 whitespace-pre-line ${headCls}`}>
              {t("homeHeadline")}
            </h1>
            <p className={`text-sm max-w-md mx-auto ${subCls}`}>
              {t("homeSubline")}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative mb-8">
            <input
              ref={inputRef} type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={e => {
                if (!focused || !visibleResults.length) return;
                if (e.key === "ArrowDown") { e.preventDefault(); setHlIdx(i => (i + 1) % visibleResults.length); }
                else if (e.key === "ArrowUp") { e.preventDefault(); setHlIdx(i => (i - 1 + visibleResults.length) % visibleResults.length); }
                else if (e.key === "Enter" && hlIdx >= 0 && hlIdx < visibleResults.length) {
                  e.preventDefault(); setSearch(""); setFocused(false);
                  router.push(`/${locale}/city/${visibleResults[hlIdx].slug}`);
                }
                else if (e.key === "Escape") { setFocused(false); }
              }}
              placeholder={t("homeSearchPlaceholder")}
              className={`w-full py-3.5 pl-11 pr-4 rounded-xl text-[15px] border-2 transition focus:outline-none shadow-sm ${darkMode
                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
              }`}
            />
            <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${subCls}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>

            {focused && search.trim() && results.length > 0 && (
              <div ref={dropRef}
                className={`absolute top-full mt-1 w-full rounded-xl shadow-lg border overflow-y-auto z-50 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
                style={{ maxHeight: "min(360px, 50vh)" }}>
                {visibleResults.map((c, i) => (
                  <Link key={c.id} href={`/${locale}/city/${c.slug}`}
                    onClick={() => { trackEvent("search_city", { city_slug: c.slug }); setSearch(""); setFocused(false); }}
                    onMouseEnter={() => setHlIdx(i)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm transition ${i === hlIdx
                      ? (darkMode ? "bg-slate-700" : "bg-blue-50") : ""}`}>
                    <span>{c.flag}</span>
                    <span className="font-medium">{getCityName(c.id)}</span>
                    <span className={`text-xs ${subCls}`}>{getCountryName(c.id)}</span>
                  </Link>
                ))}
                {hasMoreResults && (
                  <div className={`px-4 py-2 text-xs border-t ${darkMode ? "border-slate-700 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                    {t("homeMoreResults", { count: results.length - visibleResults.length })}
                  </div>
                )}
              </div>
            )}
            {focused && search.trim() && results.length === 0 && (
              <div ref={dropRef}
                className={`absolute top-full mt-1 w-full rounded-xl shadow-lg border z-50 px-4 py-3 text-sm ${darkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-500"}`}>
                {t("homeNoResults")}
              </div>
            )}
          </div>

          {/* Popular cities — pill cards grid */}
          <div className={`border-t pt-6 mt-2 transition-all duration-200 ${divider} ${focused ? "opacity-0 pointer-events-none max-h-0 overflow-hidden -translate-y-2 pt-0 mt-0 border-transparent" : "opacity-100 max-h-[320px] translate-y-0"}`}>
            <div className={`text-xs font-bold mb-4 text-center ${subCls}`}>{t("homePopularCities")}</div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {POPULAR_HOME.map(c => (
                <Link key={c.id} href={`/${locale}/city/${c.slug}`}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}>
                  <span>{c.flag}</span>
                  <span>{getCityName(c.id)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Links per spec: "或 查看排行榜 · 方法论" */}
          <p className={`mt-6 text-xs text-center ${subCls}`}>
            <Link href={`/${locale}/ranking`} className="underline hover:text-blue-500">{t("ranking")}</Link>
            {" · "}
            <Link href={`/${locale}/methodology`} className="underline hover:text-blue-500">{t("navMethodology")}</Link>
          </p>
        </div>
      )}

      <footer className={`px-4 py-5 text-center text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
        <div className={`max-w-2xl mx-auto border-t pt-4 ${divider}`}>
          <p>{t("dataSourcesDisclaimer")}</p>
          <p className="mt-1"><a href={`/${locale}/methodology`} className="underline hover:text-blue-500">{t("navMethodology")}</a> · <a href="https://github.com/qing4132/whichcity/issues" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500">GitHub</a> · <a href="mailto:qing4132@users.noreply.github.com" className="underline hover:text-blue-500">{t("footerFeedback")}</a></p>
        </div>
      </footer>
    </div>
  );
}
