"use client";

import { useState } from "react";

interface GridItem { label: string; value: string; color?: string }

interface Props {
  title: string;
  items: GridItem[];
  insightHtml: string | null;
  climateContent: React.ReactNode | null;
  expandLabel: string;
  collapseLabel: string;
}

export default function HealthLifeSection({ title, items, insightHtml, climateContent, expandLabel, collapseLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-4 border-b border-[var(--border-light)]">
      <div className="text-[13px] font-extrabold text-[var(--fg)] mb-2">{title}</div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-2">
        {items.map(item => (
          <div key={item.label}>
            <div className="text-[17px] font-extrabold leading-tight" style={{ color: item.color || "var(--fg)" }}>{item.value}</div>
            <div className="text-[10px] text-[var(--fg-muted)] mt-px">{item.label}</div>
          </div>
        ))}
      </div>

      {insightHtml && (
        <div className="bg-[var(--surface)] rounded-lg px-3 py-2 mt-2.5 text-[12px] text-[var(--fg-secondary)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: insightHtml }} />
      )}

      {climateContent && (
        <>
          <button onClick={() => setOpen(v => !v)}
            className="w-full text-[11px] text-[var(--fg-muted)] text-center pt-2 hover:text-[var(--blue)]">
            {open ? collapseLabel : expandLabel}
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
            {climateContent}
          </div>
        </>
      )}
    </div>
  );
}
