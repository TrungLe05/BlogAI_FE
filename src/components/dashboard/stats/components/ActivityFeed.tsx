import {
  Users,
  Heart,
  Star,
  MessageSquare,
  Bell,
  Zap,
  Clock,
} from "lucide-react";

const ACTIVITY = [
  {
    icon: <Users size={13} />,
    color: "#005f7b",
    text: "New subscriber joined",
    time: "2m ago",
  },
  {
    icon: <Heart size={13} />,
    color: "#d32f2f",
    text: 'Mark liked "Rise of Post AI"',
    time: "18m ago",
  },
  {
    icon: <Star size={13} />,
    color: "#f59e0b",
    text: 'Post published: "CX vs UX"',
    time: "1h ago",
  },
  {
    icon: <MessageSquare size={13} />,
    color: "#388e3c",
    text: "5 shares on Twitter",
    time: "3h ago",
  },
  {
    icon: <Bell size={13} />,
    color: "#7c3aed",
    text: "Newsletter sent to 2.3K subscribers",
    time: "8h ago",
  },
  {
    icon: <Zap size={13} />,
    color: "#d32f2f",
    text: '"AI Writing Assistant" trending in Tech',
    time: "1d ago",
  },
];

function ActivityFeed() {
  return (
    <div className="bg-white overflow-hidden dark:shadow-[4px_4px_0_#52525b] border-[3px] border-[#0d0d0d] dark:border-zinc-600  shadow-[4px_4px_0_#0d0d0d]">
      <div
        className="px-5 py-3 bg-[#d32f2f] dark:bg-zinc-800 border-b-[3px] border-[#0d0d0d] dark:border-zinc-600"
        // style={{ background: "#d32f2f", borderBottom: "3px solid #0d0d0d" }}
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
          className={`
            ${i < ACTIVITY.length - 1 ? "border-b-[3px] border-[#f0f0f0] dark:border-zinc-600" : "none"} 
            flex items-start gap-3 px-5 py-4 hover:bg-[#ecf5f6] transition-colors dark:bg-zinc-900 `}
          // style={{
          //   borderBottom:
          //     i < ACTIVITY.length - 1 ? "3px solid #f0f0f0" : "none",
          // }}
        >
          <div
            className={`w-7 h-7 flex items-center justify-center shrink-0 text-white border-[3px] border-[#0d0d0d] dark:border-zinc-600`}
            style={{
              background: item.color,
              // color: "white",
              // border: "3px solid #0d0d0d",
            }}
          >
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold leading-tight text-[#151d1e] dark:text-zinc-100">
              {item.text}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Clock size={10} style={{ color: "#8f6f6c" }} />
              <span className="text-xs text-[#8f6f6c] dark:text-zinc-100">
                {item.time}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;
