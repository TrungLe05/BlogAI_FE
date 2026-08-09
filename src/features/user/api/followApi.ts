import { ApiResponse } from "@/features/auth/types/auth.types";
import axiosClient from "../../../shared/lib/axiosClient";
import { User } from "../types/user.types";

const followApi = {
  follow: (id: string) => axiosClient.post(`/follows/${id}`),
  unfollow: (id: string) => axiosClient.delete(`/follows/${id}`),
  getFollowers: () =>
    axiosClient.get<ApiResponse<User[]>>("/follows/followers"),
  getFollowing: () =>
    axiosClient.get<ApiResponse<User[]>>("/follows/following"),
};

export default followApi;
