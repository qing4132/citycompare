import Link from "next/link";

export default function Footer({ locale }: { locale: string }) {
  return (
    <footer className="py-5 text-center text-[11px] text-[var(--fg-muted)] leading-relaxed">
      <div className="max-w-[640px] mx-auto px-4 border-t border-[var(--border)] pt-4">
        <p>World Bank · ILO · UNDP · 各国统计局</p>
        <p className="mt-1">
          <Link href={`/${locale}`} className="hover:text-[var(--fg)] underline">首页</Link>
          {" · "}
          <a href="https://github.com/qing4132/whichcity/issues" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)] underline">GitHub</a>
        </p>
        <p className="mt-1 opacity-60">数据仅供参考，不构成移居建议</p>
      </div>
    </footer>
  );
}
