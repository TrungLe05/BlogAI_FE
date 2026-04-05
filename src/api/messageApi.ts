import axiosClient from "./axiosClient";
import { ApiResponse } from "@/types/auth.types";
import { Message, Conversation } from "@/types/message.types";

export const messageApi = {
  // Lấy danh sách conversations (mutual follows)
  getConversations: () =>
    axiosClient.get<ApiResponse<Conversation[]>>("/messages/conversations"),

  // Lấy tin nhắn với một user cụ thể
  getMessages: (userId: string) =>
    axiosClient.get<ApiResponse<Message[]>>(`/messages/${userId}`),

  // Gửi tin nhắn
  sendMessage: (receiverId: string, content: string) =>
    axiosClient.post<ApiResponse<Message>>("/messages", { receiverId, content }),

  // Đánh dấu đã xem
  markAsRead: (userId: string) =>
    axiosClient.put<ApiResponse<void>>(`/messages/${userId}/read`),

  // Tìm kiếm user (mutual follows) theo email hoặc tên
  searchMutualFollows: (query: string) =>
    axiosClient.get<ApiResponse<Conversation[]>>(
      `/messages/conversations/search?q=${encodeURIComponent(query)}`
    ),
};
