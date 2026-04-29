import { User } from "./authResponse.type"; 

// types/conversation.types.ts
export interface ConversationResponse {
    id: string;
    otherUser: User;
    createdAt: string;
    lastMessage: string | null;
    lastMessageAt: string | null;      // ← string | null, không phải Instant
    lastMessageSenderId: string | null; // ← thêm
    unreadCount: number;
}