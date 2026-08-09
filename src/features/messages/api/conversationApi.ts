import { ApiResponse } from "@/features/auth/types/auth.types";
import axiosClient from "../../../shared/lib/axiosClient";
import { ConversationResponse } from "../types/message.types";
const conversationApi = {
  getAllConversation: () =>
    axiosClient.get<ApiResponse<ConversationResponse[]>>("/conversations"),
  openConversation: (targetUserId: string) =>
    axiosClient.post<ApiResponse<ConversationResponse>>(
      `/conversations/open?targetUserId=${targetUserId}`,
    ),
};

export default conversationApi;
