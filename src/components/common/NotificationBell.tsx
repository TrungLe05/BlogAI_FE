// components/common/NotificationBell.tsx
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useWebSocketStore, {
  NotificationPayload,
} from "@/stores/websocketStore";
import { useNavigate } from "react-router-dom";

function getMessage(n: NotificationPayload) {
  switch (n.type) {
    case "FOLLOW":
      return `${n.fromUserName} vừa follow bạn`;
    case "CHAT_UNLOCKED":
      return `${n.fromUserName} đã follow lại — có thể nhắn tin`;
    case "NEW_MESSAGE": {
      const count = n.messageCount ?? 1;
      return count > 1
        ? `${n.fromUserName} đã gửi ${count} tin nhắn`
        : `${n.fromUserName} vừa nhắn tin cho bạn`;
    }
    default:
      return "Bạn có thông báo mới";
  }
}

function getIcon(type: string) {
  switch (type) {
    case "FOLLOW":
      return "👤";
    case "CHAT_UNLOCKED":
      return "💬";
    case "NEW_MESSAGE":
      return "🔔";
    default:
      return "🔔";
  }
}

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, clearUnread } = useWebSocketStore();
  const navigate = useNavigate();
  // Đóng khi click ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen((o) => !o);
    if (!open) clearUnread(); // clear badge khi mở
  };

  return (
    <div
      ref={ref}
      className="hover:bg-[#ecf5f6] dark:hover:bg-[#1e2130] border-[3px] transition-colors cursor-pointer border-[#0d0d0d] dark:border-[#2d3148] text-[#151d1e] dark:text-slate-200 relative"
    >
      <button 
        title="Notifications"
        onClick={handleOpen}
        className="relative w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
        // style={{ border: "3px solid #0d0d0d" }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-white"
            style={{
              fontSize: "9px",
              fontWeight: 900,
              background: "#d32f2f",
              fontFamily: "var(--font-display)",
              border: "2px solid white",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-white z-50"
          style={{
            border: "3px solid #0d0d0d",
            boxShadow: "4px 4px 0 #0d0d0d",
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 font-black text-xs uppercase tracking-widest text-white flex items-center justify-between"
            style={{
              background: "#0d0d0d",
              fontFamily: "var(--font-display)",
            }}
          >
            <span>Notifications</span>
            {notifications.length > 0 && (
              <span
                style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}
              >
                {notifications.length} total
              </span>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">🔔</p>
                <p
                  className="text-sm font-bold"
                  style={{ fontFamily: "var(--font-display)", color: "#888" }}
                >
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-[#ebf4f5] transition-colors"
                  style={{
                    borderBottom:
                      i < notifications.length - 1 ? "1px solid #eee" : "none",
                    cursor: n.conversationId ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (n.type == "NEW_MESSAGE" && n.conversationId) {
                      setOpen(false);
                      navigate("/messages", {
                        state: { focusConversationId: n.conversationId },
                      });
                    }
                  }}
                >
                  <img
                    src={
                      n.fromAvatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(n.fromUserName)}&background=d32f2f&color=fff`
                    }
                    alt={n.fromUserName}
                    className="w-9 h-9 object-cover shrink-0"
                    style={{ border: "2px solid #0d0d0d" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm leading-tight"
                      style={{ color: "#333" }}
                    >
                      <span className="mr-1">{getIcon(n.type)}</span>
                      {getMessage(n)}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#bbb" }}>
                      {timeAgo(n.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
