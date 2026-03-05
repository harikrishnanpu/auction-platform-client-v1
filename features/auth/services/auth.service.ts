import { api } from '@/lib/axios';
import { RegisterFormValues } from '../schemes/register-schema';
import { ApiResponse } from '@/shared/types/api.type';
import { User } from '../types/user.type';

export const authService = {
  async register(
    data: RegisterFormValues
  ): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post<ApiResponse<{ user: User }>>(
      `/auth/register`,
      data
    );
    console.log('Register Response', response);
    return response.data;
  },

  async resendVerificationCode(email: string): Promise<ApiResponse<void>> {
    const response = await api.post<ApiResponse<void>>(
      `/auth/send-verification-code`,
      { email, purpose: 'VERIFY_EMAIL', channel: 'EMAIL' }
    );
    return response.data;
  },

  async verifyEmail(
    email: string,
    code: string
  ): Promise<ApiResponse<{ user: User }>> {
    const response = await api.post<ApiResponse<{ user: User }>>(
      `/auth/verify-credentials`,
      { email, otp: code, purpose: 'VERIFY_EMAIL', channel: 'EMAIL' }
    );
    return response.data;
  },
};
