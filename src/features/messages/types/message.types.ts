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

export type PendingFile = {
  file: File;
  isImage: boolean;
  previewUrl: string;
};