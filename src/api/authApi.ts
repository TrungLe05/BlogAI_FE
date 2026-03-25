import axiosClient from "./axiosClient"
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth.types"

export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<AuthResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    axiosClient.post<AuthResponse>("/auth/register", data),

  loginWithGoogle: () =>
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`,

  loginWithGithub: () =>
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`,
}