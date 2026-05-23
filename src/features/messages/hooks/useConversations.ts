import { useState, useEffect } from "react";
import conversationApi from "@/api/conversationApi";
import { toast } from "sonner";
import { extractApiError } from "@/utils/apiError";
import { ConversationResponse } from "@/types/response/conversationResponse.types";
import { ChatMessagePayload } from "@/stores/websocketStore";

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const updateConversationFromPayload = (
    payload: ChatMessagePayload,
    currentConvId: string | null,
  ) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === payload.conversationId
          ? {
              ...c,
              unreadCount:
                payload.conversationId === currentConvId ? 0 : c.unreadCount + 1,
              lastMessage: payload.content ?? null,
              lastMessageAt: payload.createdAt ?? null,
              lastMessageSenderId: payload.senderId ?? null,
            }
          : c,
      ),
    );
  };

  const markConversationAsRead = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c)),
    );
  };

  const updateLastMessage = (
    convId: string,
    lastMessage: string,
    lastMessageAt: string,
    senderId: string,
  ) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, lastMessage, lastMessageAt, lastMessageSenderId: senderId }
          : c,
      ),
    );
  };

  return {
    conversations,
    setConversations,
    isLoading,
    updateConversationFromPayload,
    markConversationAsRead,
    updateLastMessage,
  };
}