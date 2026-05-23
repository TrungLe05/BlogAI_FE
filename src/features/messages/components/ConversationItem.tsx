import { ConversationResponse } from "@/types/response/conversationResponse.types";

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

interface Props {
  conv: ConversationResponse;
  isActive: boolean;
  userId?: string;
  onSelect: (c: ConversationResponse) => void;
}

export default function ConversationItem({ conv, isActive, userId, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(conv)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer border-b border-black/7 dark:border-white/5
        ${isActive
          ? "bg-[#0d0d0d] dark:bg-zinc-700"
          : "bg-transparent hover:bg-[#ebf4f5] dark:hover:bg-zinc-800"
        }`}
    >
      <div className="relative shrink-0">
        <img
          src={
            conv.otherUser.avatarUrl ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.otherUser.fullName)}&background=d32f2f&color=fff`
          }
          alt={conv.otherUser.fullName}
          className={`w-10 h-10 rounded-full object-cover border-2 ${isActive ? "border-white" : "border-[#0d0d0d] dark:border-zinc-600"}`}
        />
        {conv.unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white bg-[#d32f2f]"
            style={{ fontSize: "9px", fontWeight: 900, fontFamily: "var(--font-display)" }}
          >
            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p
            className={`text-xs font-black truncate ${isActive ? "text-white" : "text-[#0d0d0d] dark:text-zinc-100"}`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {conv.otherUser.fullName}
          </p>
          {conv.lastMessageAt && (
            <span
              className={`text-xs shrink-0 ${isActive ? "text-white/60" : "text-[#aaa] dark:text-zinc-500"}`}
              style={{ fontSize: "10px" }}
            >
              {formatTime(conv.lastMessageAt)}
            </span>
          )}
        </div>
        {conv.lastMessage && (
          <p
            className={`text-xs truncate mt-0.5 ${
              isActive
                ? "text-white/70"
                : conv.unreadCount > 0
                  ? "text-[#0d0d0d] dark:text-zinc-200 font-bold"
                  : "text-[#888] dark:text-zinc-500"
            }`}
          >
            {conv.lastMessageSenderId === userId ? "Bạn: " : ""}
            {conv.lastMessage}
          </p>
        )}
      </div>
    </button>
  );
}