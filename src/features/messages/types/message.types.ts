import { User } from "@/features/user/types/user.types";

export interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: "TEXT" | "IMAGE" | "FILE";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead: boolean;
  createdAt: string;
  isUploading?: boolean;
  localPreviewUrl?: string;
}

export type PendingFile = {
  file: File;
  isImage: boolean;
  previewUrl: string;
};

export interface ConversationResponse {
  id: string;
  otherUser: User;
  createdAt: string;
  lastMessage: string | null;
  lastMessageAt: string | null; // ← string | null, không phải Instant
  lastMessageSenderId: string | null; // ← thêm
  unreadCount: number;
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

export interface FileUploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  isImage: boolean;
}
