// types/message.types.ts
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
