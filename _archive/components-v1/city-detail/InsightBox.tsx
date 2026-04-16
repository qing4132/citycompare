interface Props {
  text: string;
  darkMode: boolean;
}

/** Insight box — light background box with natural language interpretation of data */
export default function InsightBox({ text, darkMode }: Props) {
  // Parse bold markers: text between ** ** becomes <strong>
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div className={`rounded-[10px] p-3 mt-2.5 ${darkMode ? "bg-slate-800/60" : "bg-slate-50"}`}>
      <p className={`text-[12px] leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={i} className={darkMode ? "text-slate-100" : "text-slate-900"}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    </div>
  );
}
