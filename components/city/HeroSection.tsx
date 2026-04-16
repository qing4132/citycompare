import type { Tag } from "@/components/lib/grading";

interface Props {
  flag: string;
  cityName: string;
  countryName: string;
  tzLabel: string | null;
  intro: string | null;
  tags: Tag[];
  safetyWarning: string | null;
  warningText: string | null;
}

export default function HeroSection({ flag, cityName, countryName, tzLabel, intro, tags, safetyWarning, warningText }: Props) {
  return (
    <>
      <div className="py-4 border-b border-[var(--border-light)]">
        <h1 className="text-[24px] font-black text-[var(--fg)]">{flag} {cityName}</h1>
        <p className="text-[13px] text-[var(--fg-muted)] mt-0.5">
          {[countryName, tzLabel].filter(Boolean).join(" · ")}
        </p>
        {intro && (
          <p className="text-[13px] text-[var(--fg-secondary)] leading-relaxed mt-2">{intro}</p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-[5px] mt-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-[11px] font-semibold px-[7px] py-[2px] rounded-[5px] border"
                style={{
                  background: `var(--tag-${tag.color}-bg)`,
                  color: `var(--tag-${tag.color}-fg)`,
                  borderColor: `var(--tag-${tag.color}-border)`,
                }}>
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
      {safetyWarning && warningText && (
        <div className="border-l-4 border-[var(--red)] bg-[var(--red-bg)] px-4 py-3 text-[13px] leading-snug"
          style={{ color: "var(--tag-red-fg)" }}>
          <strong>⚠ {warningText}</strong>
        </div>
      )}
    </>
  );
}
