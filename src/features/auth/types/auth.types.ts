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

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ConfirmTotpRequest {
  otpCode: string;
}

export interface RecoveryCodeRequest{
  recoveryCode: string;
}


export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
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
  require2FA: boolean;
  tempToken: string;
}


export interface TotpSetupResponse{
    qrCodeBase64: string;
    totpSecret: string;
}

export interface TwoFAConfirmResponse{
  recoveryCodes: string[]
}