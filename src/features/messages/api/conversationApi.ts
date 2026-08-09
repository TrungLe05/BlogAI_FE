import { ApiResponse } from "@/types/response/authResponse.type";
import axiosClient from "../../../shared/lib/axiosClient";
import { ConversationResponse } from "@/types/response/conversationResponse.types";
const conversationApi = {
  getAllConversation: () =>
    axiosClient.get<ApiResponse<ConversationResponse[]>>("/conversations"),
  openConversation: (targetUserId: string) =>
    axiosClient.post<ApiResponse<ConversationResponse>>(
      `/conversations/open?targetUserId=${targetUserId}`,
    ),
};

export default conversationApi;
