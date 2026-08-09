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
      className="bg-white dark:bg-zinc-900 hover:shadow-[8px_8px_0_#0d0d0d] dark:hover:shadow-[8px_8px_0_#52525b] dark:shadow-[4px_4px_0_#52525b] shadow-[4px_4px_0_#0d0d0d] border-[3px] border-[#0d0d0d] flex flex-col justify-between p-5 transition-all"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(-4px,-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translate(0,0)";
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <p
          className="text-xs dark:text-zinc-100 text-[#5b403d] font-black uppercase tracking-[0.15em] font-display"
          
        >
          {label}
        </p>
        <div
          className="flex items-center gap-1 text-xs font-black px-2 py-0.5"
          style={{ background: up ? "#dcfce7" : "#fee2e2",
            color: up ? "#16a34a" : "#dc2626",
            border: `3px solid ${up ? "#16a34a" : "#dc2626"}` }}
        >
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(change)}%
        </div>
      </div>
      <p
        className="font-black text-4xl leading-none mb-1 font-display"
        style={{ color: accent  }}
      >
        {value}
      </p>
    </div>
  );
}

export default StatCard;
