import axiosClient from "./axiosClient"
import { LoginRequest, RegisterRequest, AuthResponse, LoginResponse, ApiResponse, User, ChangePasswordRequest } from "@/types/auth.types"

export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<ApiResponse<LoginResponse>>("/auth/login", data),

  register: (data: RegisterRequest) =>
    axiosClient.post<AuthResponse>("/users/register", data),

  loginWithGoogle: () =>
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`,

  loginWithGithub: () =>
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/github`,
  logout: () => 
    axiosClient.post("/auth/logout"),
  changePassword: (data: ChangePasswordRequest) => 
    axiosClient.put<ApiResponse<User>>("/auth/me/change-password", data)
}