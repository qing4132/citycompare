interface BarItem { label: string; value: number; max?: number }

interface Props {
  items: BarItem[];
  darkMode: boolean;
}

/** Horizontal bar chart for index scores (safety, healthcare, governance, freedom) */
export default function IndexBars({ items, darkMode }: Props) {
  const barColor = (v: number) => {
    if (v >= 70) return darkMode ? "bg-green-400" : "bg-green-500";
    if (v >= 50) return darkMode ? "bg-blue-400" : "bg-blue-500";
    if (v >= 40) return darkMode ? "bg-amber-400" : "bg-amber-500";
    return darkMode ? "bg-rose-400" : "bg-rose-500";
  };
  const valColor = (v: number) => {
    if (v >= 70) return darkMode ? "text-green-400" : "text-green-600";
    if (v >= 50) return darkMode ? "text-blue-400" : "text-blue-600";
    if (v >= 40) return darkMode ? "text-amber-400" : "text-amber-600";
    return darkMode ? "text-rose-400" : "text-rose-500";
  };
  const trackCls = darkMode ? "bg-slate-700" : "bg-slate-100";

  return (
    <div className="space-y-1.5">
      {items.map(item => {
        const pct = Math.min(100, Math.max(0, (item.value / (item.max ?? 100)) * 100));
        return (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`text-[11px] w-[55px] text-right shrink-0 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{item.label}</span>
            <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${trackCls}`}>
              <div className={`h-full rounded-full transition-all ${barColor(item.value)}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-[11px] font-bold w-[36px] shrink-0 ${valColor(item.value)}`}>{Math.round(item.value)}</span>
          </div>
        );
      })}
    </div>
  );
}
