import axiosClient from "./axiosClient";
import { ApiResponse } from "@/types/auth.types";
import { MessageResponse } from "@/types/message.types";

const messageApi = {
    getMessages: (conversationId: string) =>
        axiosClient.get<ApiResponse<MessageResponse[]>>(`/messages/${conversationId}`),

    sendMessage: (conversationId: string, content: string, type = "TEXT") =>
        axiosClient.post<ApiResponse<MessageResponse>>(`/messages/${conversationId}`, {
            content,
            type,
        }),

    markAsRead: (conversationId: string) =>
        axiosClient.patch(`/messages/${conversationId}/read`),
};

export default messageApi;
