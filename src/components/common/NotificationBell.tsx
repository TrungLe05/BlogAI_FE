// components/common/NotificationBell.tsx
import {
  Bell,
  LucideIcon,
  MessageCircleHeart,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useWebSocketStore, {
  NotificationPayload,
} from "@/stores/websocketStore";
import { useNavigate } from "react-router-dom";

type NotificationType = "FOLLOW" | "CHAT_UNLOCKED" | "NEW_MESSAGE";

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

const NOTIFICATION_ICON_MAP: Record<NotificationType, LucideIcon> = {
  FOLLOW: UserPlus, // có người theo dõi bạn
  CHAT_UNLOCKED: MessageCircleHeart, // mở khóa trò chuyện
  NEW_MESSAGE: MessageSquare, // tin nhắn mới (thay vì Bell để phân biệt rõ với default)
};

function getIcon(type: string, className = "w-5 h-5") {
  const Icon = NOTIFICATION_ICON_MAP[type as NotificationType] ?? Bell;
  return <Icon className={className} />;
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
    <div ref={ref} className="relative">
      <button
        title="Notifications"
        onClick={handleOpen}
        className="relative w-10 h-10 rounded-full flex items-center justify-center
                   text-gray-500 dark:text-zinc-400
                   hover:text-[#0d0d0d] dark:hover:text-zinc-100
                   hover:bg-black/5 dark:hover:bg-white/6
                   transition-colors cursor-pointer"
      >
        <Bell size={17} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 flex items-center justify-center
                       bg-[#d32f2f] rounded-full"
            style={{ fontSize: "8px", fontWeight: 900, color: "white" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-800 z-50
                     rounded-xl border border-black/6
                     shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]
                     overflow-hidden dark:border-zinc-400"
        >
          {/* Header */}
          <div
            className="px-4 py-3 text-xs font-bold uppercase tracking-widest
                       text-gray-500 dark:text-zinc-400
                       border-b border-black/5 dark:border-zinc-400
                       flex items-center justify-between"
          >
            <span>Notifications</span>
            {notifications.length > 0 && (
              <span className="text-gray-300 dark:text-zinc-600 text-[10px]">
                {notifications.length} total
              </span>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto w-full">
            {notifications.length === 0 ? (
              <div className="w-full py-10">
                <div className="flex items-center justify-center">
                  <Bell className="text-3xl mb-2" />
                </div>
                <p
                  className="text-sm font-bold font-display flex items-center justify-center"
                  style={{ color: "#888"  }}
                >
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-[#ebf4f5] dark:hover:bg-zinc-600 transition-colors"
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
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-black/10"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm text-[#333] leading-tight dark:text-zinc-400"
                    >
                      <span className="mr-1">
                        {getIcon(n.type, "dark:text-zinc-400")}
                      </span>
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
