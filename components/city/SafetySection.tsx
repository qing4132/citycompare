"use client";

import { useState } from "react";
import type { Grade } from "@/components/lib/indices";
import { tierColor } from "@/components/lib/indices";

interface BarItem { label: string; value: number | null; score: string }

interface Props {
  title: string;
  gradeLabel: string;
  grade: Grade;
  gradeColor: string;
  bars: BarItem[];
  expandLabel: string;
  collapseLabel: string;
  detailContent: React.ReactNode | null;
}

export default function SafetySection({ title, gradeLabel, grade, gradeColor: gc, bars, expandLabel, collapseLabel, detailContent }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-4 border-b border-[var(--border-light)]">
      <div className="text-[13px] font-extrabold text-[var(--fg)] mb-2">{title}</div>

      <div className="flex gap-4 items-start">
        <div className="shrink-0 text-center">
          <div className="text-[38px] font-black leading-none" style={{ color: gc }}>{grade}</div>
          <div className="text-[10px] text-[var(--fg-muted)] mt-0.5">{gradeLabel}</div>
        </div>
        <div className="flex-1 min-w-0 grid gap-y-1.5" style={{ gridTemplateColumns: "auto 1fr auto" }}>
          {bars.map(bar => {
            const v = bar.value ?? 0;
            const color = tierColor(bar.value);
            return (
              <div key={bar.label} className="contents">
                <span className="text-[11px] text-[var(--fg-secondary)] text-right whitespace-nowrap pr-2 self-center">{bar.label}</span>
                <div className="self-center h-[5px] rounded-full overflow-hidden" style={{ background: "var(--bar-track)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, v)}%`, background: color }} />
                </div>
                <span className="text-[11px] font-bold text-right tabular-nums pl-2 self-center" style={{ color }}>{bar.score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {detailContent && (
        <>
          <button onClick={() => setOpen(v => !v)}
            className="w-full text-[11px] text-[var(--fg-muted)] text-center pt-2 hover:text-[var(--blue)]">
            {open ? collapseLabel : expandLabel}
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[800px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
            {detailContent}
          </div>
        </>
      )}
    </div>
  );
}
