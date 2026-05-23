import { ApiResponse } from "@/types/response/authResponse.type";
import axiosClient from "./axiosClient";
import {
  FileUploadResponse,
  MessageResponse,
} from "@/types/response/messageResponse.types";

const messageApi = {
  getMessages: (conversationId: string, before?: string, limit = 20) =>
    axiosClient.get(`/messages/${conversationId}`, {
      params: { before, limit },
    }),

  sendMessage: (
    conversationId: string,
    content: string,
    type = "TEXT",
    fileData?: { fileUrl: string; fileName: string; fileSize: number },
  ) =>
    axiosClient.post<ApiResponse<MessageResponse>>(
      `/messages/${conversationId}`,
      {
        content,
        type,
        ...fileData
      },
    ),

  markAsRead: (conversationId: string) =>
    axiosClient.patch(`/messages/${conversationId}/read`),

  uploadChatFile: (file: File, conversationId: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("conversationId", conversationId);
    return axiosClient.post<ApiResponse<FileUploadResponse>>(
      "/messages/upload/chat",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },
};

export default messageApi;
