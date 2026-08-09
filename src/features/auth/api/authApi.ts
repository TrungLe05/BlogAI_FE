import {
  ApiResponse,
  AuthResponse,
  ChangePasswordRequest,
  ConfirmTotpRequest,
  LoginRequest,
  LoginResponse,
  RecoveryCodeRequest,
  RegisterRequest,
  TotpSetupResponse,
  TwoFAConfirmResponse,
} from "@/features/auth/types/auth.types";
import axiosClient from "../../../shared/lib/axiosClient";
import { User } from "@/features/user/types/user.types";

export const authApi = {
  login: (data: LoginRequest) =>
    axiosClient.post<ApiResponse<LoginResponse>>("/auth/login", data),

  register: (data: RegisterRequest) =>
    axiosClient.post<AuthResponse>("/auth/register", data),

  loginWithGoogle: () =>
    (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`),

  loginWithGithub: () =>
    (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/github`),
  logout: () => axiosClient.post("/auth/logout"),
  changePassword: (data: ChangePasswordRequest) =>
    axiosClient.put<ApiResponse<User>>("/auth/me/change-password", data),

  //2FA
  enable2FA: () =>
    axiosClient.post<ApiResponse<TotpSetupResponse>>("/2fa/enable"),

  confirm2FA: (data: ConfirmTotpRequest) =>
    axiosClient.post<ApiResponse<TwoFAConfirmResponse>>("/2fa/confirm", data),

  disable2FA: (data: ConfirmTotpRequest) =>
    axiosClient.post<ApiResponse<null>>("/2fa/disable", data),

  verifyLoginOtp: (data: { tempToken: string; otpCode: string }) =>
    axiosClient.post<ApiResponse<LoginResponse>>(
      "/auth/login/verify-otp",
      data,
    ),

  get2FAStatus: () => axiosClient.get<ApiResponse<boolean>>("/2fa/status"),

  disableWithRecovery: (data: RecoveryCodeRequest) =>
    axiosClient.post<ApiResponse<void>>("/2fa/disable-with-recovery", data),
};
