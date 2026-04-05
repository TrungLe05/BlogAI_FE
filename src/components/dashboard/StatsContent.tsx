import { useState } from "react";
import {
  Eye, Heart, Users, FileText, TrendingUp, TrendingDown,
  MessageSquare, Clock, Star, ExternalLink, BarChart2, Bell, Zap
} from "lucide-react";
import { Link } from "react-router-dom";

type DateRange = "7d" | "30d" | "90d" | "all";

// ── Mock data (PRESERVED) ────────────────────────────────
const OVERVIEW = [
  { label: "Total Views", value: "124.3K", change: +12, icon: <Eye size={20} />, accent: "#d32f2f" },
  { label: "Total Likes", value: "8,942", change: +8, icon: <Heart size={20} />, accent: "#e91e63" },
  { label: "New Followers", value: "1,247", change: +23, icon: <Users size={20} />, accent: "#005f7b" },
  { label: "Total Posts", value: "47", change: +3, icon: <FileText size={20} />, accent: "#388e3c" },
];

const TOP_POSTS = [
  { rank: 1, title: "The Art of Storytelling in the Age of AI", views: 12400, likes: 892, comments: 34, date: "Mar 20" },
  { rank: 2, title: "How I Built a Custom AI Writing Assistant in a Weekend", views: 9800, likes: 734, comments: 51, date: "Mar 12" },
  { rank: 3, title: "Year Two of Full-Time Writing: What Nobody Tells You", views: 7200, likes: 541, comments: 28, date: "Feb 28" },
  { rank: 4, title: "The Psychology Behind Viral Blog Headlines", views: 5100, likes: 410, comments: 19, date: "Feb 14" },
  { rank: 5, title: "Why Most Productivity Systems Fail (And Mine Does Too)", views: 4300, likes: 387, comments: 45, date: "Jan 30" },
];

const TRAFFIC_SOURCES = [
  { label: "Organic Search", pct: 45, color: "#0d0d0d" },
  { label: "Social Media", pct: 28, color: "#d32f2f" },
  { label: "Direct", pct: 15, color: "#005f7b" },
  { label: "Referral", pct: 12, color: "#388e3c" },
];

const TOP_CATEGORIES = [
  { name: "Artificial Intelligence", posts: 18, pct: 38 },
  { name: "UX/UI Design", posts: 12, pct: 26 },
  { name: "Web Development", posts: 9, pct: 19 },
  { name: "Digital Marketing", posts: 5, pct: 11 },
  { name: "Lifestyle", posts: 3, pct: 6 },
];

const WEEK_BARS = [
  { day: "Mon", views: 3200, likes: 140 },
  { day: "Tue", views: 4800, likes: 220 },
  { day: "Wed", views: 2900, likes: 98 },
  { day: "Thu", views: 6100, likes: 310 },
  { day: "Fri", views: 5400, likes: 280 },
  { day: "Sat", views: 7800, likes: 420 },
  { day: "Sun", views: 6200, likes: 355 },
];

const ACTIVITY = [
  { icon: <Users size={13} />, color: "#005f7b", text: "New subscriber joined", time: "2m ago" },
  { icon: <Heart size={13} />, color: "#d32f2f", text: 'Mark liked "Rise of Post AI"', time: "18m ago" },
  { icon: <Star size={13} />, color: "#f59e0b", text: 'Post published: "CX vs UX"', time: "1h ago" },
  { icon: <MessageSquare size={13} />, color: "#388e3c", text: "5 shares on Twitter", time: "3h ago" },
  { icon: <Bell size={13} />, color: "#7c3aed", text: "Newsletter sent to 2.3K subscribers", time: "8h ago" },
  { icon: <Zap size={13} />, color: "#d32f2f", text: '"AI Writing Assistant" trending in Tech', time: "1d ago" },
];

const RANGE_LABELS: Record<DateRange, string> = {
  "7d": "7D", "30d": "30D", "90d": "90D", "all": "ALL",
};

/* ── Stat Card ─────────────────────────────────────── */
function StatCard({ label, value, change, accent }: { label: string; value: string; change: number; icon?: React.ReactNode; accent: string }) {
  const up = change >= 0;
  return (
    <div
      className="bg-white flex flex-col justify-between p-5 transition-all"
      style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translate(-4px,-4px)";
        e.currentTarget.style.boxShadow = "8px 8px 0 #0d0d0d";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translate(0,0)";
        e.currentTarget.style.boxShadow = "4px 4px 0 #0d0d0d";
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <p
          className="text-xs font-black uppercase tracking-[0.15em]"
          style={{ fontFamily: "var(--font-display)", color: "#5b403d" }}
        >
          {label}
        </p>
        <div
          className="flex items-center gap-1 text-xs font-black px-2 py-0.5"
          style={{
            fontFamily: "var(--font-display)",
            background: up ? "#dcfce7" : "#fee2e2",
            color: up ? "#16a34a" : "#dc2626",
            border: `3px solid ${up ? "#16a34a" : "#dc2626"}`,
          }}
        >
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(change)}%
        </div>
      </div>
      <p
        className="font-black text-4xl leading-none mb-1"
        style={{ fontFamily: "var(--font-display)", color: accent }}
      >
        {value}
      </p>
    </div>
  );
}

/* ── Bar Chart ─────────────────────────────────────── */
function BrutalBarChart({ metric }: { metric: "views" | "likes" }) {
  const max = Math.max(...WEEK_BARS.map((b) => b[metric]));
  const color = metric === "views" ? "#0d0d0d" : "#d32f2f";
  return (
    <div className="flex items-end justify-between h-36 gap-3">
      {WEEK_BARS.map((bar) => {
        const h = Math.round((bar[metric] / max) * 100);
        return (
          <div key={bar.day} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
            <div
              className="w-full relative group cursor-default transition-all"
              style={{
                height: `${h}%`,
                background: color,
                border: "3px solid #0d0d0d",
                minHeight: "8px",
              }}
            >
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-black px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap"
                style={{
                  background: "#0d0d0d",
                  color: "white",
                  fontFamily: "var(--font-display)",
                  zIndex: 10,
                  border: "2px solid white",
                }}
              >
                {metric === "views" ? (bar.views >= 1000 ? `${(bar.views / 1000).toFixed(1)}K` : bar.views) : bar.likes}
              </div>
            </div>
            <span
              className="text-xs font-black uppercase"
              style={{ color: "#8f6f6c", fontFamily: "var(--font-display)" }}
            >
              {bar.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

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
              style={{
                fontFamily: "var(--font-display)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
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
        <div
          className="bg-white p-6"
          style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
        >
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
          {/* Top Posts Table */}
          <div
            className="bg-white overflow-hidden"
            style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
          >
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{ background: "#0d0d0d", borderBottom: "3px solid #0d0d0d" }}
            >
              <h2
                className="font-black text-xs uppercase tracking-[0.15em] text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Top Performing Posts
              </h2>
              <span className="text-white/30 text-xs font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {RANGE_LABELS[range]}
              </span>
            </div>
            <div
              className="grid text-xs font-black uppercase tracking-[0.15em] px-5 py-3"
              style={{
                gridTemplateColumns: "36px 1fr 80px 70px 60px 50px",
                fontFamily: "var(--font-display)",
                background: "#ecf5f6",
                borderBottom: "3px solid #e7f0f1",
                color: "#8f6f6c",
              }}
            >
              <span>#</span>
              <span>Post</span>
              <span className="text-right">Views</span>
              <span className="text-right">Likes</span>
              <span className="text-right">Cmts</span>
              <span />
            </div>
            {TOP_POSTS.map((post, i) => (
              <div
                key={post.rank}
                className="grid items-center px-5 py-3 hover:bg-[#ecf5f6] transition-colors"
                style={{
                  gridTemplateColumns: "36px 1fr 80px 70px 60px 50px",
                  borderBottom: i < TOP_POSTS.length - 1 ? "3px solid #f0f0f0" : "none",
                }}
              >
                <span
                  className="w-6 h-6 flex items-center justify-center text-xs font-black text-white"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: post.rank === 1 ? "#d32f2f" : "#0d0d0d",
                  }}
                >
                  {post.rank}
                </span>
                <span
                  className="text-xs font-bold pr-4 truncate"
                  style={{ fontFamily: "var(--font-display)", color: "#151d1e" }}
                  title={post.title}
                >
                  {post.title}
                </span>
                <span className="text-xs font-black text-right" style={{ color: "#151d1e" }}>
                  {fmtNum(post.views)}
                </span>
                <span className="text-xs font-black text-right" style={{ color: "#d32f2f" }}>
                  {fmtNum(post.likes)}
                </span>
                <span className="text-xs font-bold text-right" style={{ color: "#5b403d" }}>
                  {post.comments}
                </span>
                <div className="flex justify-end">
                  <Link to={`/blog/${post.rank}`}>
                    <button
                      className="p-1.5 hover:bg-[#0d0d0d] hover:text-white transition-colors cursor-pointer"
                      style={{ border: "3px solid #0d0d0d" }}
                      title="View"
                    >
                      <ExternalLink size={11} />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div
            className="bg-white overflow-hidden"
            style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
          >
            <div
              className="px-5 py-3"
              style={{ background: "#d32f2f", borderBottom: "3px solid #0d0d0d" }}
            >
              <h2
                className="font-black text-xs uppercase tracking-[0.15em] text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Recent Activity
              </h2>
            </div>
            {ACTIVITY.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-5 py-4 hover:bg-[#ecf5f6] transition-colors"
                style={{ borderBottom: i < ACTIVITY.length - 1 ? "3px solid #f0f0f0" : "none" }}
              >
                <div
                  className="w-7 h-7 flex items-center justify-center shrink-0"
                  style={{
                    background: item.color,
                    color: "white",
                    border: "3px solid #0d0d0d",
                  }}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold leading-tight" style={{ color: "#151d1e" }}>
                    {item.text}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Clock size={10} style={{ color: "#8f6f6c" }} />
                    <span className="text-xs" style={{ color: "#8f6f6c" }}>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic + Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Traffic Sources */}
          <div
            className="bg-white p-6"
            style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
          >
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
                    <span
                      className="text-sm font-black uppercase tracking-[0.05em]"
                      style={{ fontFamily: "var(--font-display)", color: "#151d1e" }}
                    >
                      {src.label}
                    </span>
                    <span
                      className="text-xs font-black px-2.5 py-0.5"
                      style={{
                        background: src.color,
                        color: "white",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {src.pct}%
                    </span>
                  </div>
                  <div
                    className="h-5 relative"
                    style={{ background: "#ecf5f6", border: "3px solid #0d0d0d" }}
                  >
                    <div style={{ width: `${src.pct}%`, height: "100%", background: src.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div
            className="bg-white p-6"
            style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
          >
            <h2
              className="font-black text-sm uppercase tracking-[0.1em] mb-5 flex items-center gap-2 pb-4"
              style={{ fontFamily: "var(--font-display)", borderBottom: "3px solid #0d0d0d", color: "#151d1e" }}
            >
              <FileText size={16} style={{ color: "#d32f2f" }} /> Top Categories
            </h2>
            <div className="space-y-3">
              {TOP_CATEGORIES.map((cat, i) => (
                <div
                  key={cat.name}
                  className="flex items-center gap-3 p-3"
                  style={{
                    background: i === 0 ? "#0d0d0d" : "#ffffff",
                    border: "3px solid #0d0d0d",
                  }}
                >
                  <span
                    className="w-6 h-6 flex items-center justify-center text-xs font-black shrink-0"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: i === 0 ? "#d32f2f" : "#0d0d0d",
                      color: "white",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="flex-1 text-sm font-black"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: i === 0 ? "white" : "#151d1e",
                    }}
                  >
                    {cat.name}
                  </span>
                  <div
                    style={{
                      width: "64px",
                      height: "10px",
                      background: i === 0 ? "rgba(255,255,255,0.15)" : "#ecf5f6",
                      border: `3px solid ${i === 0 ? "rgba(255,255,255,0.3)" : "#dbe4e5"}`,
                    }}
                  >
                    <div
                      style={{
                        width: `${cat.pct}%`,
                        height: "100%",
                        background: i === 0 ? "#d32f2f" : "#0d0d0d",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsContent;
