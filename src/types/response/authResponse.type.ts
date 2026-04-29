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


export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: "USER" | "ADMIN";
  following?: boolean;
}

export interface TotpSetupResponse{
    qrCodeBase64: string;
    totpSecret: string;
}

export interface TwoFAConfirmResponse{
  recoveryCodes: string[]
}