export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  seen: boolean;
}

export interface ConversationUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
}

export interface Conversation {
  user: ConversationUser;
  lastMessage?: Message;
  unreadCount: number;
  muteSetting?: {
    notification: boolean;
    seenReceipt: boolean;
  };
}
