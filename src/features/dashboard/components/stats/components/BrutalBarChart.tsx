const WEEK_BARS = [
  { day: "Mon", views: 3200, likes: 140 },
  { day: "Tue", views: 4800, likes: 220 },
  { day: "Wed", views: 2900, likes: 98 },
  { day: "Thu", views: 6100, likes: 310 },
  { day: "Fri", views: 5400, likes: 280 },
  { day: "Sat", views: 7800, likes: 420 },
  { day: "Sun", views: 6200, likes: 355 },
];

interface BrutalBarChartProps {
  metric: "views" | "likes";
}

function BrutalBarChart({ metric }: BrutalBarChartProps) {
  const max = Math.max(...WEEK_BARS.map((b) => b[metric]));
  const color =
    metric === "views" ? "bg-[#0d0d0d]  dark:bg-[#5c5c5c]" : "bg-[#d32f2f]";
  return (
    <div className="flex items-end justify-between h-36 gap-3">
      {WEEK_BARS.map((bar) => {
        const h = Math.round((bar[metric] / max) * 100);
        return (
          <div
            key={bar.day}
            className="flex flex-col items-center gap-2 flex-1 h-full justify-end"
          >
            <div
              className={`w-full relative group cursor-default transition-all ${color} border-[3px] border-[#0d0d0d] dark:border-zinc-600`}
              style={{ height: `${h}%`, minHeight: "8px" }}
            >
              <div
                className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-black px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap font-display"
                style={{ background: "#0d0d0d",
                  color: "white",
                  
                  zIndex: 10,
                  border: "2px solid white" }}
              >
                {metric === "views"
                  ? bar.views >= 1000
                    ? `${(bar.views / 1000).toFixed(1)}K`
                    : bar.views
                  : bar.likes}
              </div>
            </div>
            <span
              className="text-xs font-black uppercase text-[#8f6f6c] dark:text-zinc-400 font-display"
              
            >
              {bar.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default BrutalBarChart;
