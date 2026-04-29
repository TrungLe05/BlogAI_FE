import { ApiResponse } from "@/types/response/authResponse.type";
import axiosClient from "./axiosClient";
import { MessageResponse } from "@/types/response/messageResponse.types";


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
