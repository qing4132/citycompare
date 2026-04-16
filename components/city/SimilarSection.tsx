import Link from "next/link";

interface SimilarCity {
  flag: string;
  name: string;
  slug: string;
  diff: string;
  diffColor: string;
}

interface Props {
  title: string;
  cities: SimilarCity[];
  locale: string;
}

export default function SimilarSection({ title, cities, locale }: Props) {
  if (cities.length === 0) return null;
  return (
    <div className="py-4">
      <div className="text-[13px] font-extrabold text-[var(--fg)] mb-2">{title}</div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4" style={{ scrollbarWidth: "none" }}>
        {cities.map(c => (
          <Link key={c.slug} href={`/${locale}/city/${c.slug}`}
            className="flex-shrink-0 w-[100px] rounded-[10px] p-2.5 text-center bg-[var(--surface)] hover:-translate-y-0.5 transition-transform">
            <div className="text-[22px]">{c.flag}</div>
            <div className="text-[11px] font-bold text-[var(--fg)] mt-1 truncate">{c.name}</div>
            <div className="text-[10px] font-semibold mt-0.5" style={{ color: c.diffColor }}>{c.diff}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
