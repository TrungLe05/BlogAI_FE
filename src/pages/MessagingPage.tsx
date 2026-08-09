import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import useAuthStore from "@/features/auth/stores/authStore";
import { toast } from "sonner";
import LoadingSpinner from "@/shared/components/common/LoadingSpinner";
import useWebSocketStore from "@/features/messages/stores/websocketStore";
import messageApi from "@/features/messages/api/messageApi";

import { useConversations } from "@/features/messages/hooks/useConversations";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { useFileUpload } from "@/features/messages/hooks/useFileUpload";
import { useChatSocket } from "@/features/messages/hooks/useChatSocket";

import ChatWindow from "@/features/messages/components/ChatWindow";
import ImageLightbox from "@/features/messages/components/ImageLightbox";
import ConversationList from "@/features/messages/components/ConversationList";
import { ConversationResponse } from "@/features/messages/types/message.types";
import DashboardSidebar from "@/features/dashboard/components/layout/DashboardSidebar";

export default function MessagingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedConv, setSelectedConv] = useState<ConversationResponse | null>(
    null,
  );
  const [inputText, setInputText] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lightbox, setLightbox] = useState<{
    images: { url: string; fileName?: string }[];
    currentIndex: number;
  } | null>(null);
  // Mobile: "list" | "chat" — quyết định panel nào hiển thị
  const [mobilePanel, setMobilePanel] = useState<"list" | "chat">("list");

  const selectedConvRef = useRef<ConversationResponse | null>(null);
  const stopTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialLoad = useRef(true);

  const { sendTyping, setCurrentConversationId } = useWebSocketStore();

  const {
    conversations,
    isLoading,
    updateConversationFromPayload,
    markConversationAsRead,
    updateLastMessage,
  } = useConversations();

  const {
    messages,
    hasMore,
    isLoadingMore,
    isLoadingMoreRef,
    prevMessageCountRef,
    scrollContainerRef,
    loadMessages,
    loadMore,
    appendMessage,
    replaceOptimistic,
    removeOptimistic,
    markAllAsRead,
  } = useMessages();

  const { pendingFile, handleFileSelect, clearFile } = useFileUpload();

  useEffect(() => {
    selectedConvRef.current = selectedConv;
  }, [selectedConv]);
  useEffect(() => () => setCurrentConversationId(null), []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length === 0 || isLoadingMoreRef.current) return;
    const prevCount = prevMessageCountRef.current;
    prevMessageCountRef.current = messages.length;
    if (messages.length > prevCount) {
      messagesEndRef.current?.scrollIntoView({
        behavior: isInitialLoad.current ? "instant" : "smooth",
      });
      isInitialLoad.current = false;
    }
  }, [messages]);

  useEffect(() => {
    if (isLoadingMoreRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom < 200)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isOtherTyping]);

  // Auto-focus from notification
  useEffect(() => {
    const focusId = location.state?.focusConversationId as string | undefined;
    if (!focusId || conversations.length === 0) return;
    const target = conversations.find((c) => c.id === focusId);
    if (target) {
      handleSelectConv(target);
      // Xoá state của React Router để useEffect không bị trigger lại khi conversations thay đổi
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, conversations, navigate]);

  useChatSocket({
    selectedConvRef,
    appendMessage,
    markAllAsRead: () => markAllAsRead(user?.id ?? ""),
    updateConversationFromPayload,
    setIsOtherTyping,
    userId: user?.id,
  });

  const handleSelectConv = useCallback(async (conv: ConversationResponse) => {
    isInitialLoad.current = true;
    setCurrentConversationId(conv.id);
    setSelectedConv(conv);
    setIsOtherTyping(false);
    markConversationAsRead(conv.id);
    setMobilePanel("chat"); // chuyển sang chat panel trên mobile
    try {
      await loadMessages(conv.id);
    } catch {
      toast.error("Không thể tải tin nhắn");
    }
    inputRef.current?.focus();
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !selectedConv) return;
    if (container.scrollTop < 100) loadMore(selectedConv.id);
  }, [selectedConv, loadMore]);

  const handleSend = async () => {
    if (!inputText.trim() && !pendingFile) return;
    if (!selectedConv || isSending) return;

    const content = inputText.trim();
    setInputText("");
    setIsSending(true);
    sendTyping(selectedConv.id, selectedConv.otherUser.id, false);

    const capturedFile = pendingFile;
    if (capturedFile) clearFile();

    const type: "TEXT" | "IMAGE" | "FILE" = capturedFile
      ? capturedFile.isImage
        ? "IMAGE"
        : "FILE"
      : "TEXT";

    // Tạo url tạm ngay trên máy để hiển thị preview trong lúc upload
    const localPreviewUrl = capturedFile
      ? URL.createObjectURL(capturedFile.file)
      : undefined;

    const optimisticId = `optimistic-${Date.now()}`;

    // 1. Hiện bubble ngay lập tức, kèm cờ isUploading — spinner sẽ dựa vào cờ này
    appendMessage({
      id: optimisticId,
      conversationId: selectedConv.id,
      senderId: user?.id ?? "",
      senderName: user?.fullName ?? "",
      senderAvatar: user?.avatarUrl ?? "",
      content: content || "",
      type,
      fileUrl: localPreviewUrl,
      fileName: capturedFile?.file.name,
      fileSize: capturedFile?.file.size,
      isRead: false,
      createdAt: new Date().toISOString(),
      isUploading: !!capturedFile,
    });

    try {
      let fileData:
        | { fileUrl: string; fileName: string; fileSize: number }
        | undefined;

      // 2. Upload chạy nền — bubble vẫn đang hiện ảnh preview + spinner
      if (capturedFile) {
        const { data: uploadRes } = await messageApi.uploadChatFile(
          capturedFile.file,
          selectedConv.id,
        );
        fileData = {
          fileUrl: uploadRes.result.url,
          fileName: uploadRes.result.fileName,
          fileSize: uploadRes.result.fileSize,
        };
      }

      const { data } = await messageApi.sendMessage(
        selectedConv.id,
        content,
        type,
        fileData,
      );

      // 3. Thay optimistic bằng message thật từ server (đã có fileUrl thật, isUploading không còn true)
      replaceOptimistic(optimisticId, data.result);
      updateLastMessage(
        selectedConv.id,
        type === "IMAGE"
          ? "Đã gửi ảnh"
          : type === "FILE"
            ? `File: ${fileData?.fileName}`
            : content,
        data.result.createdAt,
        user?.id ?? "",
      );
    } catch {
      toast.error("Không thể gửi");
      removeOptimistic(optimisticId);
    } finally {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
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

  const conversationImages = useMemo(
    () =>
      messages
        .filter((m) => m.type === "IMAGE" && m.fileUrl)
        .map((m) => ({ url: m.fileUrl!, fileName: m.fileName })),
    [messages],
  );

  const handleOpenLightbox = useCallback(
    (fileUrl: string) => {
      const index = conversationImages.findIndex((img) => img.url === fileUrl);
      if (index !== -1)
        setLightbox({ images: conversationImages, currentIndex: index });
    },
    [conversationImages],
  );

  const filteredConvs = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.otherUser.fullName.toLowerCase().includes(q) ||
      c.otherUser.email.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <style>{`@keyframes typingBounce { 0%,60%,100%{transform:translateY(0);opacity:0.5} 30%{transform:translateY(-6px);opacity:1} }`}</style>
      <div className=" h-screen flex bg-[#ebf4f5] dark:bg-zinc-950 font-sans">
        {/* ── BODY ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Conversation List:
              - Mobile (< sm): absolute, full width, z-index trên để che chat. Ẩn khi mobilePanel=chat.
              - Desktop (≥ sm): fixed sidebar 288px, luôn hiển thị. */}
          <div
            className={`
              shrink-0 flex flex-col bg-white dark:bg-zinc-900 border-r-[3px] border-[#0d0d0d] dark:border-zinc-700
              sm:w-72 sm:flex
              ${mobilePanel === "list" ? "flex w-full" : "hidden"}
            `}
          >
            <ConversationList
              conversations={filteredConvs}
              selectedConv={selectedConv}
              searchQuery={searchQuery}
              userId={user?.id}
              onSelect={handleSelectConv}
              onSearch={setSearchQuery}
            />
          </div>

          {/* Chat Area: full width trên mobile khi mobilePanel=chat */}
          <div
            className={`
              flex-1 flex flex-col overflow-hidden
              ${mobilePanel === "chat" ? "flex" : "hidden sm:flex"}
            `}
          >
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
                scrollContainerRef={scrollContainerRef}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                pendingFile={pendingFile}
                onInputChange={handleInputChange}
                onSend={handleSend}
                onScroll={handleScroll}
                onFileSelect={handleFileSelect}
                onClearFile={clearFile}
                onImageClick={handleOpenLightbox}
                onBack={() => {
                  setSelectedConv(null);
                  setMobilePanel("list");
                }}
              />
            ) : (
              <div className="hidden sm:flex flex-col items-center justify-center flex-1 gap-4 bg-[#ebf4f5] dark:bg-zinc-950">
                <div className="w-20 h-20 flex items-center justify-center bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[6px_6px_0_#0d0d0d]">
                  <MessageCircle size={36} className="text-[#d32f2f]" />
                </div>
                <p className="text-lg font-display font-bold uppercase tracking-widest text-[#0d0d0d] dark:text-white">
                  Select a conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          currentIndex={lightbox.currentIndex}
          onClose={() => setLightbox(null)}
          onNavigate={(idx) =>
            setLightbox((prev) =>
              prev ? { ...prev, currentIndex: idx } : null,
            )
          }
        />
      )}
    </>
  );
}
