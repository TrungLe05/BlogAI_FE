// types/message.types.ts
export interface MessageResponse {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    type: "TEXT" | "IMAGE" | "FILE";
    isRead: boolean;
    createdAt: string;
}

export interface ChatMessagePayload {
    type: "NEW_MESSAGE" | "TYPING" | "STOP_TYPING" | "READ";
    conversationId: string;
    messageId?: string;
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
    content?: string;
    messageType?: string;
    createdAt?: string;
}