import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { toast } from "sonner";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import useWebSocketStore from "@/stores/websocketStore";
import messageApi from "@/api/messageApi";
import { ConversationResponse } from "@/types/response/conversationResponse.types";

import { useConversations } from "@/features/messages/hooks/useConversations";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { useFileUpload } from "@/features/messages/hooks/useFileUpload";
import { useChatSocket } from "@/features/messages/hooks/useChatSocket";

import ChatWindow from "@/features/messages/components/ChatWindow";
import ImageLightbox from "@/features/messages/components/ImageLightbox";
import ConversationList from "@/features/messages/components/ConversationList";

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

  // Sync ref
  useEffect(() => {
    selectedConvRef.current = selectedConv;
  }, [selectedConv]);
  useEffect(() => () => setCurrentConversationId(null), []);

  // Scroll effects
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
      window.history.replaceState({}, "");
    }
  }, [location.state, conversations]);

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
    try {
      await loadMessages(conv.id);
    } catch (e) {
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

    let type: "TEXT" | "IMAGE" | "FILE" = "TEXT";
    let fileData:
      | { fileUrl: string; fileName: string; fileSize: number }
      | undefined;
    const capturedFile = pendingFile;
    if (capturedFile) clearFile();

    const optimisticId = `optimistic-${Date.now()}`;

    try {
      if (capturedFile) {
        toast.loading("Đang upload...", { id: "upload" });
        const { data: uploadRes } = await messageApi.uploadChatFile(
          capturedFile.file,
          selectedConv.id,
        );
        toast.dismiss("upload");
        type = capturedFile.isImage ? "IMAGE" : "FILE";
        fileData = {
          fileUrl: uploadRes.result.url,
          fileName: uploadRes.result.fileName,
          fileSize: uploadRes.result.fileSize,
        };
      }

      appendMessage({
        id: optimisticId,
        conversationId: selectedConv.id,
        senderId: user?.id ?? "",
        senderName: user?.fullName ?? "",
        senderAvatar: user?.avatarUrl ?? "",
        content: content || "",
        type,
        fileUrl: fileData?.fileUrl,
        fileName: fileData?.fileName,
        fileSize: fileData?.fileSize,
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      const { data } = await messageApi.sendMessage(
        selectedConv.id,
        content,
        type,
        fileData,
      );
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
      toast.dismiss("upload");
      toast.error("Không thể gửi");
      removeOptimistic(optimisticId);
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

      <div className="h-screen flex flex-col bg-[#ebf4f5] dark:bg-zinc-950 font-sans">
        <div className="shrink-0 flex items-center gap-3 px-6 h-14 bg-white dark:bg-zinc-900 border-b-[3px] border-[#0d0d0d] dark:border-zinc-700 z-50">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center border-2 border-[#0d0d0d] dark:border-zinc-600 text-[#0d0d0d] dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-400 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-base font-black uppercase tracking-widest text-[#0d0d0d] dark:text-white font-display">
            Messages
          </span>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <ConversationList
            conversations={filteredConvs}
            selectedConv={selectedConv}
            searchQuery={searchQuery}
            userId={user?.id}
            onSelect={handleSelectConv}
            onSearch={setSearchQuery}
          />

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
              />
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 bg-[#ebf4f5] dark:bg-zinc-950">
                <div className="w-20 h-20 flex items-center justify-center bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[6px_6px_0_#0d0d0d]">
                  <MessageCircle size={36} className="text-[#d32f2f]" />
                </div>
                <p className="text-lg font-display font-bold uppercase tracking-widest text-[#0d0d0d] dark:text-white ">
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
