"use client";

import { useState } from "react";

interface Props {
  title: string;
  income: string | null;
  incomeLabel: string;
  expense: string;
  expenseLabel: string;
  surplus: string | null;
  surplusLabel: string;
  surplusPositive: boolean;
  profLabel: string;
  insightText: string;
  taxDetailContent: React.ReactNode | null;
  expandLabel: string;
  collapseLabel: string;
}

export default function MoneySection({ title, income, incomeLabel, expense, expenseLabel, surplus, surplusLabel, surplusPositive, profLabel, insightText, taxDetailContent, expandLabel, collapseLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-4 border-b border-[var(--border-light)]">
      <div className="text-[13px] font-extrabold text-[var(--fg)] mb-2">{title}</div>

      <div className="flex gap-3">
        <div className="flex-1">
          <div className="text-[26px] font-black leading-none tracking-tight text-[var(--fg)]">{income ?? "—"}</div>
          <div className="text-[11px] text-[var(--fg-muted)] mt-1">{incomeLabel}</div>
        </div>
        <div className="flex-1">
          <div className="text-[26px] font-black leading-none tracking-tight text-[var(--fg)]">{expense}</div>
          <div className="text-[11px] text-[var(--fg-muted)] mt-1">{expenseLabel}</div>
        </div>
        <div className="flex-1">
          <div className="text-[26px] font-black leading-none tracking-tight"
            style={{ color: surplus === null ? "var(--fg)" : surplusPositive ? "var(--green)" : "var(--red)" }}>
            {surplus ?? "—"}
          </div>
          <div className="text-[11px] text-[var(--fg-muted)] mt-1">{surplusLabel}</div>
        </div>
      </div>

      <div className="text-[11px] text-[var(--fg-muted)] mt-1.5">{profLabel}</div>

      {insightText && (
        <div className="bg-[var(--surface)] rounded-lg px-3 py-2 mt-2.5 text-[12px] text-[var(--fg-secondary)] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: insightText }} />
      )}

      {taxDetailContent && (
        <>
          <button onClick={() => setOpen(v => !v)}
            className="w-full text-[11px] text-[var(--fg-muted)] text-center pt-2 hover:text-[var(--blue)]">
            {open ? collapseLabel : expandLabel}
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
            {taxDetailContent}
          </div>
        </>
      )}
    </div>
  );
}
