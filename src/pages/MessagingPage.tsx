import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Send,
  MoreVertical,
  BellOff,
  EyeOff,
  Trash2,
  ArrowLeft,
  MessageCircle,
  CheckCheck,
  Check,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { messageApi } from "@/api/messageApi";
import { Message, Conversation } from "@/types/message.types";

// ── Typing dots animation ──────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-end gap-1 px-4 py-3" style={{ width: 60 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-2 h-2 rounded-full bg-gray-400"
          style={{
            animation: `typingBounce 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Mock conversations (fallback khi chưa có API) ──────────────────
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    user: {
      id: "u1",
      fullName: "Nguyễn Văn An",
      email: "vanan@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    lastMessage: {
      id: "m1",
      senderId: "u1",
      receiverId: "me",
      content: "Bạn đọc bài mình viết chưa?",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      seen: true,
    },
    unreadCount: 0,
    muteSetting: { notification: false, seenReceipt: true },
  },
  {
    user: {
      id: "u2",
      fullName: "Trần Thị Bình",
      email: "thibinh@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
    },
    lastMessage: {
      id: "m2",
      senderId: "u2",
      receiverId: "me",
      content: "Cho mình hỏi về React hooks nhé!",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      seen: false,
    },
    unreadCount: 3,
    muteSetting: { notification: false, seenReceipt: true },
  },
  {
    user: {
      id: "u3",
      fullName: "Lê Minh Đức",
      email: "minhduc@example.com",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    lastMessage: {
      id: "m3",
      senderId: "me",
      receiverId: "u3",
      content: "Cảm ơn bạn nhiều!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      seen: true,
    },
    unreadCount: 0,
    muteSetting: { notification: false, seenReceipt: true },
  },
];

const MOCK_MESSAGES_MAP: Record<string, Message[]> = {
  u1: [
    {
      id: "a1",
      senderId: "u1",
      receiverId: "me",
      content: "Hey! Mình vừa publish bài mới rồi 🎉",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      seen: true,
    },
    {
      id: "a2",
      senderId: "me",
      receiverId: "u1",
      content: "Thật á, mình sẽ đọc ngay!",
      createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      seen: true,
    },
    {
      id: "a3",
      senderId: "u1",
      receiverId: "me",
      content: "Bạn đọc bài mình viết chưa?",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      seen: true,
    },
  ],
  u2: [
    {
      id: "b1",
      senderId: "u2",
      receiverId: "me",
      content: "Cho mình hỏi về React hooks nhé!",
      createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
      seen: false,
    },
    {
      id: "b2",
      senderId: "u2",
      receiverId: "me",
      content: "Cụ thể là useCallback với useMemo khác nhau thế nào?",
      createdAt: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
      seen: false,
    },
    {
      id: "b3",
      senderId: "u2",
      receiverId: "me",
      content: "Mình đang bị confuse quá 😅",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      seen: false,
    },
  ],
  u3: [
    {
      id: "c1",
      senderId: "me",
      receiverId: "u3",
      content: "Bài bạn viết về TypeScript rất hay!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      seen: true,
    },
    {
      id: "c2",
      senderId: "u3",
      receiverId: "me",
      content: "Cảm ơn bạn! Mình sẽ viết thêm 😊",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
      seen: true,
    },
    {
      id: "c3",
      senderId: "me",
      receiverId: "u3",
      content: "Cảm ơn bạn nhiều!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      seen: true,
    },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────
function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

// ── Conversation Options Dropdown ──────────────────────────────────
function ConvOptions({
  muteSetting,
  onMuteNotification,
  onMuteSeen,
  onDelete,
}: {
  muteSetting: Conversation["muteSetting"];
  onMuteNotification: () => void;
  onMuteSeen: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = [
    {
      icon: <BellOff size={13} />,
      label: muteSetting?.notification
        ? "Bật thông báo"
        : "Tắt thông báo",
      onClick: onMuteNotification,
    },
    {
      icon: <EyeOff size={13} />,
      label: muteSetting?.seenReceipt
        ? "Tắt hiển thị đã xem"
        : "Bật hiển thị đã xem",
      onClick: onMuteSeen,
    },
    {
      icon: <Trash2 size={13} />,
      label: "Xóa cuộc trò chuyện",
      onClick: onDelete,
      danger: true,
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-100"
        style={{ border: "2px solid #0d0d0d" }}
        title="Options"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-52 bg-white z-[100]"
          style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.78rem",
                color: item.danger ? "#d32f2f" : "#0d0d0d",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = item.danger ? "#d32f2f" : "#0d0d0d";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = item.danger ? "#d32f2f" : "#0d0d0d";
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main MessagingPage ─────────────────────────────────────────────
export default function MessagingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // state
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtered conversations by search
  const filteredConvs = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.user.fullName.toLowerCase().includes(q) ||
      c.user.email.toLowerCase().includes(q)
    );
  });

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOtherTyping]);

  // Select a conversation → load messages + mark as read
  const handleSelectConv = useCallback(
    async (conv: Conversation) => {
      setSelectedConv(conv);
      setIsOtherTyping(false);

      // Mark as read optimistically
      setConversations((prev) =>
        prev.map((c) =>
          c.user.id === conv.user.id ? { ...c, unreadCount: 0 } : c
        )
      );

      // Load messages (try API, fall back to mock)
      try {
        const { data } = await messageApi.getMessages(conv.user.id);
        setMessages(data.result);
        await messageApi.markAsRead(conv.user.id);
      } catch {
        setMessages(MOCK_MESSAGES_MAP[conv.user.id] ?? []);
      }

      // Simulate other user typing after 2s (demo)
      setTimeout(() => {
        setIsOtherTyping(true);
        setTimeout(() => setIsOtherTyping(false), 3000);
      }, 4000);

      inputRef.current?.focus();
    },
    []
  );

  // Send message
  const handleSend = async () => {
    if (!inputText.trim() || !selectedConv) return;
    const newMsg: Message = {
      id: `local-${Date.now()}`,
      senderId: user?.id ?? "me",
      receiverId: selectedConv.user.id,
      content: inputText.trim(),
      createdAt: new Date().toISOString(),
      seen: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.user.id === selectedConv.user.id ? { ...c, lastMessage: newMsg } : c
      )
    );
    setInputText("");

    try {
      await messageApi.sendMessage(selectedConv.user.id, newMsg.content);
    } catch {
      // message already shown locally
    }
  };

  // Typing indicator — emit on keystroke
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (typingTimeout) clearTimeout(typingTimeout);
    // In real app: emit ws event "typing"
    const t = setTimeout(() => {
      // emit "stop_typing"
    }, 1500);
    setTypingTimeout(t);
  };

  // Conversation options handlers
  const handleMuteNotification = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.user.id === convId
          ? {
              ...c,
              muteSetting: {
                ...c.muteSetting!,
                notification: !c.muteSetting?.notification,
              },
            }
          : c
      )
    );
  };
  const handleMuteSeen = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.user.id === convId
          ? {
              ...c,
              muteSetting: {
                ...c.muteSetting!,
                seenReceipt: !c.muteSetting?.seenReceipt,
              },
            }
          : c
      )
    );
  };
  const handleDeleteConv = (convId: string) => {
    if (!window.confirm("Xóa cuộc trò chuyện này?")) return;
    setConversations((prev) => prev.filter((c) => c.user.id !== convId));
    if (selectedConv?.user.id === convId) {
      setSelectedConv(null);
      setMessages([]);
    }
  };

  // Last message in chat → check seen
  const lastMsg = messages[messages.length - 1];
  const isLastMsgMine = lastMsg?.senderId === user?.id;
  const showSeen =
    isLastMsgMine &&
    lastMsg?.seen &&
    selectedConv?.muteSetting?.seenReceipt !== false;

  return (
    <>
      {/* Typing indicator keyframe */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      <div
        style={{
          background: "#ebf4f5",
          fontFamily: "var(--font-sans)",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Top Bar ── */}
        <div
          className="shrink-0 flex items-center gap-3 px-6 h-14 bg-white"
          style={{ borderBottom: "3px solid #0d0d0d", zIndex: 50 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ border: "2px solid #0d0d0d" }}
          >
            <ArrowLeft size={16} />
          </button>
          <span
            className="text-base font-black uppercase tracking-widest"
            style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
          >
            Messages
          </span>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* ── Left: Conversations ── */}
          <div
            className="w-72 shrink-0 flex flex-col bg-white"
            style={{ borderRight: "3px solid #0d0d0d" }}
          >
            {/* Search */}
            <div className="p-3" style={{ borderBottom: "2px solid #0d0d0d" }}>
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#999" }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên hoặc email..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white outline-none"
                  style={{
                    border: "2px solid #0d0d0d",
                    fontFamily: "var(--font-sans)",
                    color: "#0d0d0d",
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 px-4 text-center">
                  <Search size={28} style={{ color: "#ccc" }} />
                  <p
                    className="text-xs font-bold uppercase"
                    style={{ fontFamily: "var(--font-display)", color: "#aaa" }}
                  >
                    {searchQuery
                      ? "Không tìm thấy người dùng"
                      : "Chưa có cuộc trò chuyện"}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "#bbb", fontFamily: "var(--font-sans)" }}
                  >
                    Chỉ hiển thị người dùng đã follow nhau
                  </p>
                </div>
              ) : (
                filteredConvs.map((conv) => {
                  const isActive = selectedConv?.user.id === conv.user.id;
                  return (
                    <button
                      key={conv.user.id}
                      onClick={() => handleSelectConv(conv)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                      style={{
                        background: isActive ? "#0d0d0d" : "transparent",
                        borderBottom: "1px solid rgba(0,0,0,0.07)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "#ebf4f5";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={conv.user.avatarUrl}
                          alt={conv.user.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                          style={{
                            border: `2px solid ${isActive ? "white" : "#0d0d0d"}`,
                          }}
                        />
                        {conv.unreadCount > 0 && (
                          <span
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
                            style={{
                              fontSize: "9px",
                              fontWeight: 900,
                              background: "#d32f2f",
                              fontFamily: "var(--font-display)",
                            }}
                          >
                            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className="text-xs font-black truncate"
                            style={{
                              fontFamily: "var(--font-display)",
                              color: isActive ? "white" : "#0d0d0d",
                            }}
                          >
                            {conv.user.fullName}
                          </p>
                          {conv.lastMessage && (
                            <span
                              className="text-xs shrink-0"
                              style={{
                                color: isActive
                                  ? "rgba(255,255,255,0.6)"
                                  : "#aaa",
                                fontSize: "10px",
                              }}
                            >
                              {formatTime(conv.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <p
                            className="text-xs truncate mt-0.5"
                            style={{
                              color: isActive
                                ? "rgba(255,255,255,0.7)"
                                : conv.unreadCount > 0
                                ? "#0d0d0d"
                                : "#888",
                              fontWeight: conv.unreadCount > 0 ? 700 : 400,
                            }}
                          >
                            {conv.lastMessage.senderId === user?.id
                              ? "Bạn: "
                              : ""}
                            {conv.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Right: Chat Window ── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedConv ? (
              <>
                {/* Chat header */}
                <div
                  className="shrink-0 flex items-center justify-between px-5 py-3 bg-white"
                  style={{ borderBottom: "3px solid #0d0d0d" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={selectedConv.user.avatarUrl}
                        alt={selectedConv.user.fullName}
                        className="w-9 h-9 rounded-full object-cover"
                        style={{ border: "2px solid #0d0d0d" }}
                      />
                      <span
                        className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500"
                        style={{ border: "2px solid white" }}
                      />
                    </div>
                    <div>
                      <p
                        className="text-sm font-black"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "#0d0d0d",
                        }}
                      >
                        {selectedConv.user.fullName}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "#888", fontFamily: "var(--font-sans)" }}
                      >
                        {selectedConv.user.email}
                      </p>
                    </div>
                  </div>

                  <ConvOptions
                    muteSetting={selectedConv.muteSetting}
                    onMuteNotification={() =>
                      handleMuteNotification(selectedConv.user.id)
                    }
                    onMuteSeen={() => handleMuteSeen(selectedConv.user.id)}
                    onDelete={() => handleDeleteConv(selectedConv.user.id)}
                  />
                </div>

                {/* Messages */}
                <div
                  className="flex-1 overflow-y-auto px-5 py-4"
                  style={{ background: "#ebf4f5" }}
                >
                  {messages.map((msg, idx) => {
                    const isMine = msg.senderId === user?.id;
                    const isLastMine =
                      isMine && idx === messages.length - 1;
                    return (
                      <div
                        key={msg.id}
                        className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="flex flex-col gap-0.5"
                          style={{ maxWidth: "65%" }}
                        >
                          <div
                            className="px-4 py-2.5 text-sm"
                            style={{
                              background: isMine ? "#0d0d0d" : "white",
                              color: isMine ? "white" : "#0d0d0d",
                              border: "2px solid #0d0d0d",
                              boxShadow: isMine
                                ? "3px 3px 0 #d32f2f"
                                : "3px 3px 0 #0d0d0d",
                              fontFamily: "var(--font-sans)",
                              lineHeight: 1.5,
                            }}
                          >
                            {msg.content}
                          </div>
                          <div
                            className={`flex items-center gap-1 ${isMine ? "justify-end" : "justify-start"}`}
                          >
                            <span
                              className="text-xs"
                              style={{ color: "#aaa", fontSize: "10px" }}
                            >
                              {formatTime(msg.createdAt)}
                            </span>
                            {isLastMine && showSeen && (
                              <span
                                className="flex items-center gap-0.5 text-xs"
                                style={{
                                  color: "#d32f2f",
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  fontFamily: "var(--font-display)",
                                }}
                              >
                                <CheckCheck size={11} /> Seen
                              </span>
                            )}
                            {isLastMine && !lastMsg?.seen && (
                              <span
                                className="flex items-center gap-0.5 text-xs"
                                style={{
                                  color: "#aaa",
                                  fontSize: "10px",
                                }}
                              >
                                <Check size={11} /> Sent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  {isOtherTyping && (
                    <div className="flex justify-start mb-2">
                      <div
                        style={{
                          background: "white",
                          border: "2px solid #0d0d0d",
                          boxShadow: "3px 3px 0 #0d0d0d",
                        }}
                      >
                        <TypingDots />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div
                  className="shrink-0 flex items-center gap-3 px-5 py-3 bg-white"
                  style={{ borderTop: "3px solid #0d0d0d" }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Nhập tin nhắn... (Enter để gửi)"
                    className="flex-1 px-4 py-2.5 text-sm outline-none"
                    style={{
                      border: "2px solid #0d0d0d",
                      fontFamily: "var(--font-sans)",
                      background: "#ebf4f5",
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase transition-all"
                    style={{
                      fontFamily: "var(--font-display)",
                      background: inputText.trim() ? "#d32f2f" : "#ccc",
                      color: "white",
                      border: "2px solid #0d0d0d",
                      boxShadow: inputText.trim() ? "3px 3px 0 #0d0d0d" : "none",
                      cursor: inputText.trim() ? "pointer" : "not-allowed",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (inputText.trim()) {
                        e.currentTarget.style.transform = "translate(-2px,-2px)";
                        e.currentTarget.style.boxShadow = "5px 5px 0 #0d0d0d";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translate(0,0)";
                      e.currentTarget.style.boxShadow = inputText.trim()
                        ? "3px 3px 0 #0d0d0d"
                        : "none";
                    }}
                  >
                    <Send size={13} /> Send
                  </button>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center flex-1 gap-4">
                <div
                  className="w-20 h-20 flex items-center justify-center bg-white"
                  style={{
                    border: "3px solid #0d0d0d",
                    boxShadow: "6px 6px 0 #0d0d0d",
                  }}
                >
                  <MessageCircle size={36} style={{ color: "#d32f2f" }} />
                </div>
                <div className="text-center">
                  <p
                    className="text-lg font-black uppercase tracking-widest mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#0d0d0d",
                    }}
                  >
                    Chọn cuộc trò chuyện
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "#888", fontFamily: "var(--font-sans)" }}
                  >
                    Chỉ người dùng đã follow nhau mới có thể nhắn tin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
