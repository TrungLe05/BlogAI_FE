import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const TOP_POSTS = [
  { rank: 1, title: "The Art of Storytelling in the Age of AI", views: 12400, likes: 892, comments: 34, date: "Mar 20" },
  { rank: 2, title: "How I Built a Custom AI Writing Assistant in a Weekend", views: 9800, likes: 734, comments: 51, date: "Mar 12" },
  { rank: 3, title: "Year Two of Full-Time Writing: What Nobody Tells You", views: 7200, likes: 541, comments: 28, date: "Feb 28" },
  { rank: 4, title: "The Psychology Behind Viral Blog Headlines", views: 5100, likes: 410, comments: 19, date: "Feb 14" },
  { rank: 5, title: "Why Most Productivity Systems Fail (And Mine Does Too)", views: 4300, likes: 387, comments: 45, date: "Jan 30" },
];

type DateRange = "7d" | "30d" | "90d" | "all";

const RANGE_LABELS: Record<DateRange, string> = {
  "7d": "7D", "30d": "30D", "90d": "90D", "all": "ALL",
};

interface TopPostsTableProps {
  range: DateRange;
  fmtNum: (n: number) => string;
}

function TopPostsTable({ range, fmtNum }: TopPostsTableProps) {
  return (
    <div className="bg-white overflow-hidden" style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}>
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#0d0d0d", borderBottom: "3px solid #0d0d0d" }}>
        <h2 className="font-black text-xs uppercase tracking-[0.15em] text-white" style={{ fontFamily: "var(--font-display)" }}>
          Top Performing Posts
        </h2>
        <span className="text-white/30 text-xs font-bold" style={{ fontFamily: "var(--font-display)" }}>
          {RANGE_LABELS[range]}
        </span>
      </div>
      <div
        className="grid text-xs font-black uppercase tracking-[0.15em] px-5 py-3"
        style={{ gridTemplateColumns: "36px 1fr 80px 70px 60px 50px", fontFamily: "var(--font-display)", background: "#ecf5f6", borderBottom: "3px solid #e7f0f1", color: "#8f6f6c" }}
      >
        <span>#</span><span>Post</span><span className="text-right">Views</span><span className="text-right">Likes</span><span className="text-right">Cmts</span><span />
      </div>
      {TOP_POSTS.map((post, i) => (
        <div
          key={post.rank}
          className="grid items-center px-5 py-3 hover:bg-[#ecf5f6] transition-colors"
          style={{ gridTemplateColumns: "36px 1fr 80px 70px 60px 50px", borderBottom: i < TOP_POSTS.length - 1 ? "3px solid #f0f0f0" : "none" }}
        >
          <span className="w-6 h-6 flex items-center justify-center text-xs font-black text-white" style={{ fontFamily: "var(--font-display)", background: post.rank === 1 ? "#d32f2f" : "#0d0d0d" }}>
            {post.rank}
          </span>
          <span className="text-xs font-bold pr-4 truncate" style={{ fontFamily: "var(--font-display)", color: "#151d1e" }} title={post.title}>
            {post.title}
          </span>
          <span className="text-xs font-black text-right" style={{ color: "#151d1e" }}>{fmtNum(post.views)}</span>
          <span className="text-xs font-black text-right" style={{ color: "#d32f2f" }}>{fmtNum(post.likes)}</span>
          <span className="text-xs font-bold text-right" style={{ color: "#5b403d" }}>{post.comments}</span>
          <div className="flex justify-end">
            <Link to={`/blog/${post.rank}`}>
              <button className="p-1.5 hover:bg-[#0d0d0d] hover:text-white transition-colors cursor-pointer" style={{ border: "3px solid #0d0d0d" }} title="View">
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
