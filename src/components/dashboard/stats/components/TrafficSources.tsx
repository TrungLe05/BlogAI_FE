import { TrendingUp } from "lucide-react";

const TRAFFIC_SOURCES = [
  { label: "Organic Search", pct: 45, color: "#0d0d0d", darkColor: "#e4e4e7" },
  { label: "Social Media", pct: 28, color: "#d32f2f", darkColor: "#d32f2f" },
  { label: "Direct", pct: 15, color: "#005f7b", darkColor: "#22d3ee" },
  { label: "Referral", pct: 12, color: "#388e3c", darkColor: "#4ade80" },
];

function TrafficSources() {
  return (
    <div
      className={[
        "p-6",
        "bg-white dark:bg-zinc-900",
        "border-[3px] border-[#0d0d0d] dark:border-zinc-600",
        "shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]",
      ].join(" ")}
    >
      {/* Header */}
      <h2
        className={[
          "font-black text-sm uppercase tracking-widest mb-5",
          "flex items-center gap-2 pb-4",
          "text-[#151d1e] dark:text-white",
          "border-b-[3px] border-[#0d0d0d] dark:border-zinc-600",
        ].join(" ")}
      >
        <TrendingUp size={16} className="text-[#d32f2f]" />
        Traffic Sources
      </h2>

      {/* Rows */}
      <div className="space-y-4">
        {TRAFFIC_SOURCES.map((src) => (
          <div key={src.label}>
            {/* Label + badge */}
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-sm font-black uppercase tracking-[0.05em] text-[#151d1e] dark:text-zinc-200 font-display"
                
              >
                {src.label}
              </span>
              <span
                className="text-xs font-black px-2.5 py-0.5 text-white dark:text-[#0d0d0d] font-display"
                style={{ background: src.color }}
              >
                {src.pct}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-5 relative bg-[#ecf5f6] dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600">
              <div
                className="h-full transition-all duration-500"
                style={{ width: `${src.pct}%`, background: src.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrafficSources;
