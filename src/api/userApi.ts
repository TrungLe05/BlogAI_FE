import { ApiResponse, User } from "@/types/response/authResponse.type";
import axiosClient from "./axiosClient";
import { updateUserRequest } from "@/types/request/authRequest.types";

export interface PagedResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const userApi = {
  
  getMe: () => axiosClient.get<ApiResponse<User>>("/auth/me"),
  updateMe: (data: updateUserRequest) => {
    const formData = new FormData();

    if (data.fullName) formData.append("fullName", data.fullName);
    if (data.avatarUrl instanceof File)
      formData.append("avatarUrl", data.avatarUrl);

    return axiosClient.put<ApiResponse<User>>("/auth/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getAllUser: () => {
    return axiosClient.get<ApiResponse<User[]>>("/users");
  },
  /**
   * Tìm kiếm user theo keyword với phân trang, thực hiện server-side.
   * Gọi sau khi user ngừng gõ (debounce 300ms ở hook).
   */
  searchUsers: (keyword: string, page = 0, size = 8) => {
    return axiosClient.get<ApiResponse<PagedResponse<User>>>("/users/search", {
      params: { keyword, page, size },
    });
  },
};
