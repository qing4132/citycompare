interface KvItem { label: string; value: string; color?: string }

interface Props {
  title: string;
  items: KvItem[];
}

export default function ConnectivitySection({ title, items }: Props) {
  return (
    <div className="py-4 border-b border-[var(--border-light)]">
      <div className="text-[13px] font-extrabold text-[var(--fg)] mb-2">{title}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0">
        {items.map((item, i) => (
          <div key={item.label}
            className={`flex items-start justify-between py-[5px] text-[13px] ${i < items.length - 2 ? "border-b border-[var(--border-light)]" : ""}`}>
            <span className="text-[var(--fg-muted)]">{item.label}</span>
            <span className="font-semibold text-right" style={{ color: item.color || "var(--fg)" }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
