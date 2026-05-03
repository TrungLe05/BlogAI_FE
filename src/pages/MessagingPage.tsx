import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Send,
  ArrowLeft,
  MessageCircle,
  CheckCheck,
  Check,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";
import conversationApi from "@/api/conversationApi";
import { toast } from "sonner";
import { extractApiError } from "@/utils/apiError";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useWebSocketStore from "@/stores/websocketStore";
import messageApi from "@/api/messageApi";
import { ConversationResponse } from "@/types/response/conversationResponse.types";
import { MessageResponse } from "@/types/response/messageResponse.types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-end gap-1 px-4 py-3" style={{ width: 60 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-2 h-2 rounded-full bg-gray-400"
          style={{
            animation: "typingBounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function formatTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function MessagingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [conversations, setConversations] = useState<ConversationResponse[]>(
    [],
  );
  const [selectedConv, setSelectedConv] = useState<ConversationResponse | null>(
    null,
  );
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [inputText, setInputText] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedConvRef = useRef<ConversationResponse | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const {
    chatMessageQueue,
    shiftChatMessage,
    sendTyping,
    setCurrentConversationId,
  } = useWebSocketStore();

  // Sync ref với state để dùng trong closure WS
  useEffect(() => {
    selectedConvRef.current = selectedConv;
  }, [selectedConv]);

  // Cleanup currentConversationId khi unmount
  useEffect(() => () => setCurrentConversationId(null), []);

  // Scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOtherTyping]);

  // ── Load conversations ────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { data } = await conversationApi.getAllConversation();
        setConversations(data.result);
      } catch (e) {
        toast.error(extractApiError(e));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // ── Auto-focus conversation từ notification ───────────────────────────────────

  useEffect(() => {
    const focusId = location.state?.focusConversationId as string | undefined;
    if (!focusId || conversations.length === 0) return;

    const target = conversations.find((c) => c.id === focusId);
    if (target) {
      handleSelectConv(target);
      // Xoá state khỏi history để không re-focus khi back/forward
      window.history.replaceState({}, "");
    }
  }, [location.state, conversations]);

  // ── Select conversation ───────────────────────────────────────────────────────

  const handleSelectConv = useCallback(async (conv: ConversationResponse) => {
    setCurrentConversationId(conv.id);
    setSelectedConv(conv);
    setIsOtherTyping(false);
    setMessages([]);
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c)),
    );
    try {
      const { data } = await messageApi.getMessages(conv.id);
      setMessages(data.result);
      await messageApi.markAsRead(conv.id);
    } catch (e) {
      toast.error(extractApiError(e));
    }
    inputRef.current?.focus();
  }, []);

  // ── WebSocket queue processor ─────────────────────────────────────────────────

  useEffect(() => {
    if (chatMessageQueue.length === 0) return;

    const payload = chatMessageQueue[0];
    const currentConv = selectedConvRef.current;

    if (payload.type === "NEW_MESSAGE") {
      if (payload.conversationId === currentConv?.id) {
        const newMsg: MessageResponse = {
          id: payload.messageId!,
          conversationId: payload.conversationId,
          senderId: payload.senderId!,
          senderName: payload.senderName!,
          senderAvatar: payload.senderAvatar!,
          content: payload.content!,
          type: (payload.messageType ?? "TEXT") as "TEXT" | "IMAGE" | "FILE",
          isRead: false,
          createdAt: payload.createdAt ?? new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
        messageApi.markAsRead(payload.conversationId);
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === payload.conversationId
              ? {
                  ...c,
                  unreadCount: c.unreadCount + 1,
                  lastMessage: payload.content ?? null,
                  lastMessageAt: payload.createdAt ?? null,
                  lastMessageSenderId: payload.senderId ?? null,
                }
              : c,
          ),
        );
      }
    }

    if (
      payload.type === "TYPING" &&
      payload.conversationId === currentConv?.id
    ) {
      setIsOtherTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(
        () => setIsOtherTyping(false),
        3000,
      );
    }

    if (
      payload.type === "STOP_TYPING" &&
      payload.conversationId === currentConv?.id
    ) {
      setIsOtherTyping(false);
    }

    if (payload.type === "READ" && payload.conversationId === currentConv?.id) {
      setMessages((prev) =>
        prev.map((m) => (m.senderId === user?.id ? { ...m, isRead: true } : m)),
      );
    }

    shiftChatMessage();
  }, [chatMessageQueue]);

  // ── Send message ──────────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!inputText.trim() || !selectedConv || isSending) return;

    const content = inputText.trim();
    setInputText("");
    setIsSending(true);
    sendTyping(selectedConv.id, selectedConv.otherUser.id, false);

    const optimistic: MessageResponse = {
      id: `optimistic-${Date.now()}`,
      conversationId: selectedConv.id,
      senderId: user?.id ?? "",
      senderName: user?.fullName ?? "",
      senderAvatar: user?.avatarUrl ?? "",
      content,
      type: "TEXT",
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const { data } = await messageApi.sendMessage(selectedConv.id, content);
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? data.result : m)),
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConv.id
            ? {
                ...c,
                lastMessage: content,
                lastMessageAt: data.result.createdAt,
                lastMessageSenderId: user?.id ?? null,
              }
            : c,
        ),
      );
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      toast.error("Không thể gửi tin nhắn");
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!selectedConv) return;
    sendTyping(selectedConv.id, selectedConv.otherUser.id, true);
    if (stopTypingTimeoutRef.current)
      clearTimeout(stopTypingTimeoutRef.current);
    stopTypingTimeoutRef.current = setTimeout(() => {
      sendTyping(selectedConv.id, selectedConv.otherUser.id, false);
    }, 2000);
  };

  // ── Derived state ─────────────────────────────────────────────────────────────

  const filteredConvs = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.otherUser.fullName.toLowerCase().includes(q) ||
      c.otherUser.email.toLowerCase().includes(q)
    );
  });

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      {isLoading && <LoadingSpinner />}
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
        {/* Top Bar */}
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

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Conversation List */}
          <ConversationList
            conversations={filteredConvs}
            selectedConv={selectedConv}
            searchQuery={searchQuery}
            userId={user?.id}
            onSelect={handleSelectConv}
            onSearch={setSearchQuery}
          />

          {/* Right: Chat Window */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedConv ? (
              <ChatWindow
                conv={selectedConv}
                messages={messages}
                inputText={inputText}
                isOtherTyping={isOtherTyping}
                isSending={isSending}
                userId={user?.id}
                inputRef={inputRef}
                messagesEndRef={messagesEndRef}
                onInputChange={handleInputChange}
                onSend={handleSend}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ConversationList({
  conversations,
  selectedConv,
  searchQuery,
  userId,
  onSelect,
  onSearch,
}: {
  conversations: ConversationResponse[];
  selectedConv: ConversationResponse | null;
  searchQuery: string;
  userId?: string;
  onSelect: (c: ConversationResponse) => void;
  onSearch: (q: string) => void;
}) {
  return (
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
            onChange={(e) => onSearch(e.target.value)}
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
        {conversations.length === 0 ? (
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
          conversations.map((conv) => (
            <ConversationItem
              key={conv.otherUser.id}
              conv={conv}
              isActive={selectedConv?.otherUser.id === conv.otherUser.id}
              userId={userId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

function ConversationItem({
  conv,
  isActive,
  userId,
  onSelect,
}: {
  conv: ConversationResponse;
  isActive: boolean;
  userId?: string;
  onSelect: (c: ConversationResponse) => void;
}) {
  return (
    <button
      onClick={() => onSelect(conv)}
      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
      style={{
        background: isActive ? "#0d0d0d" : "transparent",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = "#ebf4f5";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = "transparent";
      }}
    >
      <div className="relative shrink-0">
        <img
          src={conv.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.otherUser.fullName)}&background=d32f2f&color=fff`}
          alt={conv.otherUser.fullName}
          className="w-10 h-10 rounded-full object-cover"
          style={{ border: `2px solid ${isActive ? "white" : "#0d0d0d"}` }}
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
            {conv.otherUser.fullName}
          </p>
          {conv.lastMessageAt && (
            <span
              className="text-xs shrink-0"
              style={{
                color: isActive ? "rgba(255,255,255,0.6)" : "#aaa",
                fontSize: "10px",
              }}
            >
              {formatTime(conv.lastMessageAt)}
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
            {conv.lastMessageSenderId === userId ? "Bạn: " : ""}
            {conv.lastMessage}
          </p>
        )}
      </div>
    </button>
  );
}

function ChatWindow({
  conv,
  messages,
  inputText,
  isOtherTyping,
  isSending,
  userId,
  inputRef,
  messagesEndRef,
  onInputChange,
  onSend,
}: {
  conv: ConversationResponse;
  messages: MessageResponse[];
  inputText: string;
  isOtherTyping: boolean;
  isSending: boolean;
  userId?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  messagesEndRef?: React.RefObject<HTMLDivElement | null>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}) {
  return (
    <>
      {/* Chat Header */}
      <div
        className="shrink-0 flex items-center px-5 py-3 bg-white"
        style={{ borderBottom: "3px solid #0d0d0d" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={conv.otherUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.otherUser.fullName)}&background=d32f2f&color=fff`}
              alt={conv.otherUser.fullName}
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
              style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
            >
              {conv.otherUser.fullName}
            </p>
            <p
              className="text-xs"
              style={{ color: "#888", fontFamily: "var(--font-sans)" }}
            >
              {conv.otherUser.email}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4"
        style={{ background: "#ebf4f5" }}
      >
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === userId;
          const isLastMine = isMine && idx === messages.length - 1;
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
                  {isLastMine &&
                    (msg.isRead ? (
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
                    ) : (
                      <span
                        className="flex items-center gap-0.5 text-xs"
                        style={{ color: "#aaa", fontSize: "10px" }}
                      >
                        <Check size={11} /> Sent
                      </span>
                    ))}
                </div>
              </div>
            </div>
          );
        })}

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
          onChange={onInputChange}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Nhập tin nhắn... (Enter để gửi)"
          className="flex-1 px-4 py-2.5 text-sm outline-none"
          style={{
            border: "2px solid #0d0d0d",
            fontFamily: "var(--font-sans)",
            background: "#ebf4f5",
          }}
        />
        <button
          onClick={onSend}
          disabled={!inputText.trim() || isSending}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase transition-all"
          style={{
            fontFamily: "var(--font-display)",
            background: inputText.trim() ? "#d32f2f" : "#ccc",
            color: "white",
            border: "2px solid #0d0d0d",
            boxShadow: inputText.trim() ? "3px 3px 0 #0d0d0d" : "none",
            cursor: inputText.trim() ? "pointer" : "not-allowed",
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
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      <div
        className="w-20 h-20 flex items-center justify-center bg-white"
        style={{ border: "3px solid #0d0d0d", boxShadow: "6px 6px 0 #0d0d0d" }}
      >
        <MessageCircle size={36} style={{ color: "#d32f2f" }} />
      </div>
      <div className="text-center">
        <p
          className="text-lg font-black uppercase tracking-widest mb-1"
          style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
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
  );
}
