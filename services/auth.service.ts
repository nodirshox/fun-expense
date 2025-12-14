import { apiClient } from './api-client';

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponse {
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface VerifyOtpResponse {
  user: User;
  token: TokenResponse;
}

export const authService = {
  sendOtp: async (email: string): Promise<SendOtpResponse> => {
    const response = await apiClient.post<SendOtpResponse>('/v1/auth/send-otp', {
      email,
    });
    return response.data;
  },

  verifyOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await apiClient.post<VerifyOtpResponse>('/v1/auth/verify-otp', {
      email,
      otp,
    });
    return response.data;
  },
};
