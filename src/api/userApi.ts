import axiosClient from "./axiosClient"
import { ApiResponse, updateUserRequest, User } from "@/types/auth.types"

export const userApi = {
  getMe: () =>
    axiosClient.get<ApiResponse<User>>("/auth/me"),
  updateMe: (data: updateUserRequest) =>
  {
    const formData = new FormData();

  if (data.fullName) formData.append("fullName", data.fullName);
  if (data.avatarUrl instanceof File) formData.append("avatarUrl", data.avatarUrl);

  return axiosClient.put<ApiResponse<User>>("/auth/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  }   
}