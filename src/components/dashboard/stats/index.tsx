import { useState } from "react";
import { Eye, Heart, Users, FileText, BarChart2 } from "lucide-react";

import StatCard from "./components/StatCard";
import BrutalBarChart from "./components/BrutalBarChart";
import TopPostsTable from "./components/TopPostsTable";
import ActivityFeed from "./components/ActivityFeed";
import TrafficSources from "./components/TrafficSources";
import TopCategories from "./components/TopCategories";

type DateRange = "7d" | "30d" | "90d" | "all";

// ── Mock data (PRESERVED) ────────────────────────────────
const OVERVIEW = [
  { label: "Total Views", value: "124.3K", change: +12, icon: <Eye size={20} />, accent: "#d32f2f" },
  { label: "Total Likes", value: "8,942", change: +8, icon: <Heart size={20} />, accent: "#e91e63" },
  { label: "New Followers", value: "1,247", change: +23, icon: <Users size={20} />, accent: "#005f7b" },
  { label: "Total Posts", value: "47", change: +3, icon: <FileText size={20} />, accent: "#388e3c" },
];

const RANGE_LABELS: Record<DateRange, string> = {
  "7d": "7D", "30d": "30D", "90d": "90D", "all": "ALL",
};

/* ── StatsContent ──────────────────────────────────── */
export function StatsContent() {
  const [range, setRange] = useState<DateRange>("30d");
  const [chartMetric, setChartMetric] = useState<"views" | "likes">("views");
  const fmtNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  return (
    <div className="overflow-auto h-full" style={{ background: "#f2fbfc" }}>
      {/* ▬▬ HEADER ▬▬ */}
      <div
        className="py-10 px-10"
        style={{ background: "#0d0d0d", borderBottom: "4px solid #d32f2f" }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1
              className="font-black text-white text-4xl mb-2"
              style={{ fontFamily: "var(--font-display)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
            >
              Your <span style={{ color: "#d32f2f" }}>Stats</span>
            </h1>
            <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-sans)" }}>
              Track performance across all your posts and audience growth metrics in real-time.
            </p>
          </div>
          <div className="flex" style={{ border: "3px solid rgba(255,255,255,0.3)" }}>
            {(Object.keys(RANGE_LABELS) as DateRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-4 py-2.5 text-xs font-black uppercase tracking-[0.15em] transition-colors cursor-pointer"
                style={{
                  fontFamily: "var(--font-display)",
                  background: range === r ? "#d32f2f" : "transparent",
                  color: range === r ? "white" : "rgba(255,255,255,0.5)",
                  borderRight: r !== "all" ? "3px solid rgba(255,255,255,0.15)" : "none",
                }}
              >
                {RANGE_LABELS[r]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ▬▬ CONTENT ▬▬ */}
      <div className="p-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
          {OVERVIEW.map((c) => <StatCard key={c.label} {...c} />)}
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6" style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="font-black text-sm uppercase tracking-[0.1em] flex items-center gap-2"
              style={{ fontFamily: "var(--font-display)", color: "#151d1e" }}
            >
              <BarChart2 size={18} style={{ color: "#d32f2f" }} /> Performance Overview
            </h2>
            <div className="flex" style={{ border: "3px solid #0d0d0d" }}>
              {(["views", "likes"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setChartMetric(m)}
                  className="px-4 py-1.5 text-xs font-black uppercase tracking-[0.1em] transition-colors cursor-pointer"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: chartMetric === m ? "#0d0d0d" : "transparent",
                    color: chartMetric === m ? "white" : "#5b403d",
                    borderRight: m === "views" ? "3px solid #0d0d0d" : "none",
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <BrutalBarChart metric={chartMetric} />
        </div>

        {/* Table + Activity */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <TopPostsTable range={range} fmtNum={fmtNum} />
          <ActivityFeed />
        </div>

        {/* Traffic + Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          <TrafficSources />
          <TopCategories />
        </div>
      </div>
    </div>
  );
}

export default StatsContent;
