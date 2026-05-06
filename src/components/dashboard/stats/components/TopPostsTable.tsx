import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const TOP_POSTS = [
  {
    rank: 1,
    title: "The Art of Storytelling in the Age of AI",
    views: 12400,
    likes: 892,
    comments: 34,
    date: "Mar 20",
  },
  {
    rank: 2,
    title: "How I Built a Custom AI Writing Assistant in a Weekend",
    views: 9800,
    likes: 734,
    comments: 51,
    date: "Mar 12",
  },
  {
    rank: 3,
    title: "Year Two of Full-Time Writing: What Nobody Tells You",
    views: 7200,
    likes: 541,
    comments: 28,
    date: "Feb 28",
  },
  {
    rank: 4,
    title: "The Psychology Behind Viral Blog Headlines",
    views: 5100,
    likes: 410,
    comments: 19,
    date: "Feb 14",
  },
  {
    rank: 5,
    title: "Why Most Productivity Systems Fail (And Mine Does Too)",
    views: 4300,
    likes: 387,
    comments: 45,
    date: "Jan 30",
  },
];

type DateRange = "7d" | "30d" | "90d" | "all";
const RANGE_LABELS: Record<DateRange, string> = {
  "7d": "7D",
  "30d": "30D",
  "90d": "90D",
  all: "ALL",
};

interface TopPostsTableProps {
  range: DateRange;
  fmtNum: (n: number) => string;
}

const COL = "36px 1fr 80px 70px 60px 50px";

function TopPostsTable({ range, fmtNum }: TopPostsTableProps) {
  return (
    <div
      className={[
        "overflow-hidden",
        "bg-white dark:bg-zinc-900",
        "border-[3px] border-[#0d0d0d] dark:border-zinc-600",
        "shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]",
      ].join(" ")}
    >
      {/* Header bar */}
      <div className="px-5 py-3 flex items-center justify-between bg-[#0d0d0d] dark:bg-zinc-800 border-b-[3px] border-[#0d0d0d] dark:border-zinc-600">
        <h2
          className="font-black text-xs uppercase tracking-[0.15em] text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Top Performing Posts
        </h2>
        <span
          className="text-white/40 text-xs font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {RANGE_LABELS[range]}
        </span>
      </div>

      {/* Column headers */}
      <div
        className="grid text-xs font-black uppercase tracking-[0.15em] px-5 py-3 text-[#8f6f6c] dark:text-zinc-500 bg-[#ecf5f6] dark:bg-zinc-800/60 border-b-[3px] border-[#e7f0f1] dark:border-zinc-700"
        style={{ gridTemplateColumns: COL, fontFamily: "var(--font-display)" }}
      >
        <span>#</span>
        <span>Post</span>
        <span className="text-right">Views</span>
        <span className="text-right">Likes</span>
        <span className="text-right">Cmts</span>
        <span />
      </div>

      {/* Rows */}
      {TOP_POSTS.map((post, i) => (
        <div
          key={post.rank}
          className={[
            "grid items-center px-5 py-3 transition-colors",
            "hover:bg-[#ecf5f6] dark:hover:bg-zinc-800",
            i < TOP_POSTS.length - 1
              ? "border-b-[3px] border-[#f0f0f0] dark:border-zinc-700/60"
              : "",
          ].join(" ")}
          style={{ gridTemplateColumns: COL }}
        >
          {/* Rank badge */}
          <span
            className="w-6 h-6 flex items-center justify-center text-xs font-black text-white"
            style={{
              fontFamily: "var(--font-display)",
              background: post.rank === 1 ? "#d32f2f" : "#0d0d0d",
            }}
          >
            {post.rank}
          </span>

          {/* Title */}
          <span
            className="text-xs font-bold pr-4 truncate text-[#151d1e] dark:text-zinc-200"
            style={{ fontFamily: "var(--font-display)" }}
            title={post.title}
          >
            {post.title}
          </span>

          {/* Views */}
          <span className="text-xs font-black text-right text-[#151d1e] dark:text-zinc-300">
            {fmtNum(post.views)}
          </span>

          {/* Likes */}
          <span className="text-xs font-black text-right text-[#d32f2f]">
            {fmtNum(post.likes)}
          </span>

          {/* Comments */}
          <span className="text-xs font-bold text-right text-[#5b403d] dark:text-zinc-400">
            {post.comments}
          </span>

          {/* Link button */}
          <div className="flex justify-end">
            <Link to={`/blog/${post.rank}`}>
              <button
                title="View"
                className={[
                  "p-1.5 cursor-pointer transition-colors",
                  "border-[3px] border-[#0d0d0d] dark:border-zinc-600",
                  "text-[#0d0d0d] dark:text-zinc-300",
                  "hover:bg-[#0d0d0d] hover:text-white",
                  "dark:hover:bg-zinc-700 dark:hover:border-zinc-500",
                ].join(" ")}
              >
                <ExternalLink size={11} />
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TopPostsTable;
