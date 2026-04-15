export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  passwordHash: string;
}

export interface updateUserRequest {
  fullName?: string;
  avatarUrl?: File;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: "USER" | "ADMIN";
  following?: boolean;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
