// websocketStore.ts
import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;

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
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

export interface NotificationPayload {
  type: "FOLLOW" | "CHAT_UNLOCKED" | "CHAT_SETUP_FAILED" | "NEW_MESSAGE";
  fromUserId: string;
  fromUserName: string;
  fromAvatarUrl?: string;
  timestamp: string;
  conversationId?: string;
  messageCount?: number; // số tin nhắn gộp từ cùng 1 user
}

interface WebSocketStore {
  isConnected: boolean;
  notifications: NotificationPayload[];
  unreadCount: number;
  chatMessageQueue: ChatMessagePayload[];
  currentConversationId: string | null;
  connect: (token: string, userId: string) => void;
  disconnect: () => void;
  clearUnread: () => void;
  shiftChatMessage: () => void;
  sendTyping: (
    conversationId: string,
    receiverId: string,
    typing: boolean,
  ) => void;
  setCurrentConversationId: (id: string | null) => void;
}

const useWebSocketStore = create<WebSocketStore>((set) => ({
  isConnected: false,
  notifications: [],
  unreadCount: 0,
  chatMessageQueue: [],
  currentConversationId: null,

  connect: (token, userId) => {
    if (stompClient?.active) {
      console.log("=== ALREADY CONNECTED, SKIP ===");
      return;
    }

    console.log("=== CREATING WS CLIENT ===", userId);

    stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("=== ON CONNECT FIRED ===", userId);
        set({ isConnected: true });

        // ── Notification channel ──────────────────────────────────────────
        stompClient!.subscribe(`/user/queue/notifications`, (msg) => {
          try {
            const payload: NotificationPayload = JSON.parse(msg.body);

            set((state) => {
              // Gộp nếu là NEW_MESSAGE từ cùng 1 user
              if (payload.type === "NEW_MESSAGE") {
                const existingIndex = state.notifications.findIndex(
                  (n) =>
                    n.type === "NEW_MESSAGE" &&
                    n.fromUserId === payload.fromUserId,
                );

                if (existingIndex !== -1) {
                  const existing = state.notifications[existingIndex];
                  const merged: NotificationPayload = {
                    ...existing,
                    messageCount: (existing.messageCount ?? 1) + 1,
                    timestamp: payload.timestamp, // cập nhật thời gian mới nhất
                  };
                  // Xoá noti cũ, đưa noti gộp lên đầu
                  const rest = state.notifications.filter(
                    (_, i) => i !== existingIndex,
                  );
                  return {
                    notifications: [merged, ...rest],
                    unreadCount: state.unreadCount + 1,
                  };
                }
              }

              // Noti mới hoàn toàn (FOLLOW, CHAT_UNLOCKED, hoặc NEW_MESSAGE lần đầu)
              return {
                notifications: [
                  { ...payload, messageCount: 1 },
                  ...state.notifications,
                ],
                unreadCount: state.unreadCount + 1,
              };
            });
          } catch (e) {
            console.error("=== NOTIFICATION PARSE ERROR ===", e);
          }
        });

        // ── Chat message channel ──────────────────────────────────────────
        stompClient!.subscribe(`/user/queue/messages`, (msg) => {
          try {
            console.log("=== CHAT MESSAGE RECEIVED ===", msg.body);
            const payload: ChatMessagePayload = JSON.parse(msg.body);

            set((state) => ({
              chatMessageQueue: [...state.chatMessageQueue, payload],
            }));
          } catch (e) {
            console.error("=== MESSAGE PARSE ERROR ===", e);
          }
        });
      },

      onStompError: (frame) => {
        console.error("=== STOMP ERROR ===", frame);
        set({ isConnected: false });
      },

      onDisconnect: () => {
        console.log("=== DISCONNECTED ===");
        set({ isConnected: false });
      },
    });

    stompClient.activate();
  },

  disconnect: () => {
    stompClient?.deactivate();
    stompClient = null;
    set({
      isConnected: false,
      notifications: [],
      unreadCount: 0,
      chatMessageQueue: [],
      currentConversationId: null,
    });
  },

  clearUnread: () => set({ unreadCount: 0 }),

  shiftChatMessage: () =>
    set((state) => ({ chatMessageQueue: state.chatMessageQueue.slice(1) })),

  sendTyping: (conversationId, receiverId, typing) => {
    stompClient?.publish({
      destination: "/app/typing",
      body: JSON.stringify({ conversationId, receiverId, typing }),
    });
  },

  setCurrentConversationId: (id) => set({ currentConversationId: id }),
}));

export default useWebSocketStore;
