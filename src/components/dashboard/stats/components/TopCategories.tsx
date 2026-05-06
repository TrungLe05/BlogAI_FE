import { FileText } from "lucide-react";

const TOP_CATEGORIES = [
  { name: "Artificial Intelligence", posts: 18, pct: 38 },
  { name: "UX/UI Design", posts: 12, pct: 26 },
  { name: "Web Development", posts: 9, pct: 19 },
  { name: "Digital Marketing", posts: 5, pct: 11 },
  { name: "Lifestyle", posts: 3, pct: 6 },
];

function TopCategories() {
  return (
    <div className="bg-white  p-6 dark:bg-zinc-900 dark:shadow-[4px_4px_0_#52525b] border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d]">
      <h2
        className="font-black text-[#151d1e] dark:text-zinc-100 text-sm uppercase tracking-widest mb-5 flex items-center gap-2 pb-4 border-b-[3px] border-[#0d0d0d] dark:border-zinc-600 "
        style={{
          fontFamily: "var(--font-display)",
          // borderBottom: "3px solid #0d0d0d",
          // color: "#151d1e",
        }}
      >
        <FileText size={16} style={{ color: "#d32f2f" }} /> Top Categories
      </h2>
      <div className="space-y-3">
        {TOP_CATEGORIES.map((cat, i) => (
          <div
            key={cat.name}
            className={`${i === 0 ? "bg-[#0d0d0d] dark:bg-zinc-900" : "bg-white"} flex items-center gap-3 p-3 border-[3px] border-[#0d0d0d] dark:border-zinc-600`}
            style={{
              // background: i === 0 ? "#0d0d0d" : "#ffffff",
              // border: "3px solid #0d0d0d",
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
  );
}

export default TopCategories;
