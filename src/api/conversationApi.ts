import { ApiResponse } from "@/types/auth.types";
import axiosClient from "./axiosClient";
import { ConversationResponse } from "@/types/conversation.types";

const conversationApi = {
    getAllConversation: () => 
        axiosClient.get<ApiResponse<ConversationResponse[]>>("/conversations"),
    openConversation: (targetUserId: string) =>
        axiosClient.post<ApiResponse<ConversationResponse>>(`/conversations/open?targetUserId=${targetUserId}`)
};

export default conversationApi;