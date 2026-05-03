import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  icon?: React.ReactNode;
  accent: string;
}

function StatCard({ label, value, change, accent }: StatCardProps) {
  const up = change >= 0;
  return (
    <div
      className="bg-white flex flex-col justify-between p-5 transition-all"
      style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translate(-4px,-4px)"; e.currentTarget.style.boxShadow = "8px 8px 0 #0d0d0d"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translate(0,0)"; e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d"; }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-black uppercase tracking-[0.15em]" style={{ fontFamily: "var(--font-display)", color: "#5b403d" }}>
          {label}
        </p>
        <div
          className="flex items-center gap-1 text-xs font-black px-2 py-0.5"
          style={{ fontFamily: "var(--font-display)", background: up ? "#dcfce7" : "#fee2e2", color: up ? "#16a34a" : "#dc2626", border: `3px solid ${up ? "#16a34a" : "#dc2626"}` }}
        >
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="font-black text-4xl leading-none mb-1" style={{ fontFamily: "var(--font-display)", color: accent }}>
        {value}
      </p>
    </div>
  );
}

export default StatCard;
