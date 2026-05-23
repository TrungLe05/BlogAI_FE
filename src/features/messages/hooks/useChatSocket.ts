import { useEffect, useRef } from "react";
import messageApi from "@/api/messageApi";
import useWebSocketStore from "@/stores/websocketStore";
import { MessageResponse } from "../types/message.types";
import { ConversationResponse } from "@/types/response/conversationResponse.types";

interface Props {
  selectedConvRef: React.MutableRefObject<ConversationResponse | null>;
  appendMessage: (msg: MessageResponse) => void;
  markAllAsRead: (userId: string) => void;
  updateConversationFromPayload: (payload: any, currentConvId: string | null) => void;
  setIsOtherTyping: (v: boolean) => void;
  userId?: string;
}

export function useChatSocket({
  selectedConvRef,
  appendMessage,
  markAllAsRead,
  updateConversationFromPayload,
  setIsOtherTyping,
  userId,
}: Props) {
  const { chatMessageQueue, shiftChatMessage } = useWebSocketStore();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (chatMessageQueue.length === 0) return;

    const payload = chatMessageQueue[0];
    const currentConv = selectedConvRef.current;

    if (payload.type === "NEW_MESSAGE") {
      if (payload.conversationId === currentConv?.id) {
        appendMessage({
          id: payload.messageId!,
          conversationId: payload.conversationId,
          senderId: payload.senderId!,
          senderName: payload.senderName!,
          senderAvatar: payload.senderAvatar ?? "",
          content: payload.content ?? "",
          type: (payload.messageType ?? "TEXT") as "TEXT" | "IMAGE" | "FILE",
          fileUrl: payload.fileUrl,
          fileName: payload.fileName,
          fileSize: payload.fileSize,
          isRead: false,
          createdAt: payload.createdAt ?? new Date().toISOString(),
        });
        messageApi.markAsRead(payload.conversationId);
      }
      updateConversationFromPayload(payload, currentConv?.id ?? null);
    }

    if (payload.type === "TYPING" && payload.conversationId === currentConv?.id) {
      setIsOtherTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 3000);
    }

    if (payload.type === "STOP_TYPING" && payload.conversationId === currentConv?.id) {
      setIsOtherTyping(false);
    }

    if (payload.type === "READ" && payload.conversationId === currentConv?.id) {
      if (userId) markAllAsRead(userId);
    }

    shiftChatMessage();
  }, [chatMessageQueue]);
}