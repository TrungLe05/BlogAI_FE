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
