import { redirect } from "next/navigation";
import { SLUG_TO_ID, CITY_SLUGS, SITEMAP_PAIRS } from "@/lib/citySlug";

interface Props {
  params: Promise<{ locale: string; pair: string }>;
}

function parsePair(pair: string): string[] | null {
  const parts = pair.split("-vs-");
  const valid = parts.filter(s => SLUG_TO_ID[s] != null);
  return valid.length >= 1 ? valid : null;
}

export async function generateStaticParams() {
  const seen = new Set<string>();
  return SITEMAP_PAIRS.map(([a, b]) => {
    const pair = [CITY_SLUGS[a], CITY_SLUGS[b]].sort().join("-vs-");
    if (seen.has(pair)) return null;
    seen.add(pair);
    return { pair };
  }).filter(Boolean) as { pair: string }[];
}

export default async function ComparePage({ params }: Props) {
  const { locale, pair } = await params;
  const slugs = parsePair(pair);
  if (slugs && slugs[0]) redirect(`/${locale}/city/${slugs[0]}`);
  redirect(`/${locale}`);
}
