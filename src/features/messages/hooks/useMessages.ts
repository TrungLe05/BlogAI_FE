import { useState, useRef, useCallback } from "react";
import messageApi from "@/features/messages/api/messageApi";
import { toast } from "sonner";
import { extractApiError } from "@/utils/apiError";
import { MessageResponse } from "../types/message.types";

const PAGE_SIZE = 20;

export function useMessages() {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const oldestCreatedAt = useRef<string | null>(null);
  const isLoadingMoreRef = useRef(false);
  const prevMessageCountRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadMessages = async (convId: string) => {
    oldestCreatedAt.current = null;
    prevMessageCountRef.current = 0;
    setHasMore(true);
    setMessages([]);

    const { data } = await messageApi.getMessages(convId);
    const msgs: MessageResponse[] = data.result;
    setMessages(msgs);

    if (msgs.length < PAGE_SIZE) {
      setHasMore(false);
    } else {
      oldestCreatedAt.current = msgs[0].createdAt;
    }

    await messageApi.markAsRead(convId);
  };

  const loadMore = useCallback(
    async (convId: string) => {
      if (isLoadingMore || !hasMore || !oldestCreatedAt.current) return;

      setIsLoadingMore(true);
      isLoadingMoreRef.current = true;
      const container = scrollContainerRef.current;
      const prevScrollHeight = container?.scrollHeight ?? 0;

      try {
        const { data } = await messageApi.getMessages(
          convId,
          oldestCreatedAt.current,
        );
        const older: MessageResponse[] = data.result;

        if (older.length === 0 || older.length < PAGE_SIZE) setHasMore(false);
        if (older.length === 0) return;

        oldestCreatedAt.current = older[0].createdAt;
        prevMessageCountRef.current += older.length;
        setMessages((prev) => [...older, ...prev]);

        requestAnimationFrame(() => {
          if (container)
            container.scrollTop = container.scrollHeight - prevScrollHeight;
          isLoadingMoreRef.current = false;
        });
      } catch (e) {
        toast.error(extractApiError(e));
        isLoadingMoreRef.current = false;
      } finally {
        setIsLoadingMore(false);
      }
    },
    [isLoadingMore, hasMore],
  );

  const appendMessage = (msg: MessageResponse) => {
    setMessages((prev) => [...prev, msg]);
  };

  const replaceOptimistic = (optimisticId: string, real: MessageResponse) => {
    setMessages((prev) => prev.map((m) => (m.id === optimisticId ? real : m)));
  };

  const removeOptimistic = (optimisticId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
  };

  const markAllAsRead = (userId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.senderId === userId ? { ...m, isRead: true } : m)),
    );
  };

  return {
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
  };
}
