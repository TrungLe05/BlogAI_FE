import { ApiResponse } from "@/types/auth.types";
import axiosClient from "./axiosClient";
import { TagStatsResponse } from "@/types/tag.types";

const tagApi = {
  getTopTagsByViews: (limit = 10) =>
    axiosClient.get<ApiResponse<TagStatsResponse[]>>("/tags/top-views", {
      params: { limit },
    }),

  getTopTagsByLikes: (limit = 10) =>
    axiosClient.get<ApiResponse<TagStatsResponse[]>>("/tags/top-likes", {
      params: { limit },
    }),
  getTrendingGroups: (limit = 3) =>
    axiosClient.get<ApiResponse<TagStatsResponse[]>>("/tags/trending-groups", {
      params: { limit },
    }),
};

export default tagApi;
