"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CITY_NAME_TRANSLATIONS, COUNTRY_TRANSLATIONS } from "@/lib/i18n";
import { CITY_FLAG_EMOJIS, CITY_COUNTRY, HIDDEN_CITY_IDS } from "@/lib/constants";
import { CITY_SLUGS } from "@/lib/citySlug";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";

const CITY_LIST = Object.entries(CITY_SLUGS).map(([idStr, slug]) => {
  const id = Number(idStr);
  return { id, slug, flag: CITY_FLAG_EMOJIS[id] || "🏙️" };
}).filter(c => !HIDDEN_CITY_IDS.has(c.id));

export default function HomePage({ locale }: { locale: string }) {
  const router = useRouter();
  const loc = locale as "zh" | "en" | "ja" | "es";
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [hlIdx, setHlIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return CITY_LIST.filter(c => {
      const names = CITY_NAME_TRANSLATIONS[c.id];
      if (!names) return false;
      if (Object.values(names).some(n => n.toLowerCase().includes(q))) return true;
      if (c.slug.replace(/-/g, " ").includes(q)) return true;
      const countryZh = CITY_COUNTRY[c.id];
      if (countryZh) {
        const cn = COUNTRY_TRANSLATIONS[countryZh];
        if (cn && Object.values(cn).some(n => n.toLowerCase().includes(q))) return true;
      }
      return false;
    }).slice(0, 8);
  }, [search]);

  useEffect(() => { setHlIdx(-1); }, [search]);

  const getName = (id: number) => CITY_NAME_TRANSLATIONS[id]?.[loc] || CITY_NAME_TRANSLATIONS[id]?.en || "";
  const getCountry = (id: number) => { const zh = CITY_COUNTRY[id]; return zh ? (COUNTRY_TRANSLATIONS[zh]?.[loc] || zh) : ""; };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--fg)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="text-sm font-black tracking-wide text-[var(--blue)] mb-2">WHICHCITY</div>
        <h1 className="text-2xl sm:text-[30px] font-black tracking-tight text-center leading-tight mb-6 whitespace-pre-line text-[var(--fg)]">
          如果可以去任何地方，{"\n"}你会选哪座城市？
        </h1>
        <div className="relative w-full max-w-[420px]">
          <input ref={inputRef} type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={e => {
              if (!results.length) return;
              if (e.key === "ArrowDown") { e.preventDefault(); setHlIdx(i => (i + 1) % results.length); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setHlIdx(i => (i - 1 + results.length) % results.length); }
              else if (e.key === "Enter" && hlIdx >= 0) { router.push(`/${locale}/city/${results[hlIdx].slug}`); }
              else if (e.key === "Escape") { setFocused(false); }
            }}
            placeholder="🔍 输入城市名…"
            className="w-full py-3 pl-4 pr-4 rounded-xl text-[15px] border-2 border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-[var(--blue)] shadow-sm"
          />
          {focused && search.trim() && results.length > 0 && (
            <div className="absolute top-full mt-1 w-full rounded-xl shadow-lg border border-[var(--border)] bg-[var(--bg)] overflow-y-auto z-50" style={{ maxHeight: "min(360px, 50vh)" }}>
              {results.map((c, i) => (
                <Link key={c.id} href={`/${locale}/city/${c.slug}`}
                  onMouseEnter={() => setHlIdx(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm ${i === hlIdx ? "bg-[var(--surface)]" : ""}`}>
                  <span>{c.flag}</span>
                  <span className="font-medium">{getName(c.id)}</span>
                  <span className="text-xs text-[var(--fg-muted)]">{getCountry(c.id)}</span>
                </Link>
              ))}
            </div>
          )}
          {focused && search.trim() && results.length === 0 && (
            <div className="absolute top-full mt-1 w-full rounded-xl shadow-lg border border-[var(--border)] bg-[var(--bg)] z-50 px-4 py-3 text-sm text-[var(--fg-muted)]">
              未找到匹配的城市
            </div>
          )}
        </div>
        <p className="mt-6 text-xs text-[var(--fg-muted)]">
          或 <Link href={`/${locale}/ranking`} className="underline hover:text-[var(--blue)]">按存钱率看排行</Link>
        </p>
      </div>
      <Footer locale={locale} />
    </div>
  );
}
