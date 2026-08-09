import { ApiResponse, User } from "@/types/response/authResponse.type";
import axiosClient from "../../../shared/lib/axiosClient";

const followApi = {
  follow: (id: string) => axiosClient.post(`/follows/${id}`),
  unfollow: (id: string) => axiosClient.delete(`/follows/${id}`),
  getFollowers: () =>
    axiosClient.get<ApiResponse<User[]>>("/follows/followers"),
  getFollowing: () =>
    axiosClient.get<ApiResponse<User[]>>("/follows/following"),
};

export default followApi;
