import { TrendingUp } from "lucide-react";

const TRAFFIC_SOURCES = [
  { label: "Organic Search", pct: 45, color: "#0d0d0d" },
  { label: "Social Media", pct: 28, color: "#d32f2f" },
  { label: "Direct", pct: 15, color: "#005f7b" },
  { label: "Referral", pct: 12, color: "#388e3c" },
];

function TrafficSources() {
  return (
    <div className="bg-white p-6" style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}>
      <h2
        className="font-black text-sm uppercase tracking-[0.1em] mb-5 flex items-center gap-2 pb-4"
        style={{ fontFamily: "var(--font-display)", borderBottom: "3px solid #0d0d0d", color: "#151d1e" }}
      >
        <TrendingUp size={16} style={{ color: "#d32f2f" }} /> Traffic Sources
      </h2>
      <div className="space-y-4">
        {TRAFFIC_SOURCES.map((src) => (
          <div key={src.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black uppercase tracking-[0.05em]" style={{ fontFamily: "var(--font-display)", color: "#151d1e" }}>
                {src.label}
              </span>
              <span className="text-xs font-black px-2.5 py-0.5" style={{ background: src.color, color: "white", fontFamily: "var(--font-display)" }}>
                {src.pct}%
              </span>
            </div>
            <div className="h-5 relative" style={{ background: "#ecf5f6", border: "3px solid #0d0d0d" }}>
              <div style={{ width: `${src.pct}%`, height: "100%", background: src.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrafficSources;
