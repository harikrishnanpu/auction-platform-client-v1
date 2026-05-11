import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { ZodLoginFormValues } from '@/features/auth/schemes/login-from.schema';
import { ZodRegisterFormValues } from '@/features/auth/schemes/register-form.schema';
import { cookies } from 'next/headers';
import { ApiResponse } from '@/types/api.index';
import { getErrorMessage } from '@/utils/get-app-error';
import { IUser } from '@/types/user.type';
import { apiFetch } from '@/lib/fetch';
import { OtpPurpose } from '@/constants/auth/otp.constants';
import { ZodVerifyEmailValues } from '@/features/verify/email/schemes/verify-email.schema';
import { ZodCompleteProfileValues } from '@/features/complete-profile/schemes/complete-profile-schema';
import { ZodForgotPasswordValues } from '@/features/reset/password/schems/forget-password.schema';
import { ZodChangePasswordValues } from '@/features/reset/password/schems/change-password.schema';

const getSession = async (): Promise<ApiResponse<IUser>> => {
  const cookieStorage = await cookies();
  return await apiFetch<IUser>(
    buildApiUrl(API_ENDPOINTS.auth.me),
    { method: 'GET' },
    cookieStorage,
    'no-store'
  );
};

const login = async (
  data: ZodLoginFormValues
): Promise<
  ApiResponse<{ user: IUser; accessToken: string; refreshToken: string }>
> => {
  const cookieStorage = await cookies();
  const response = await apiFetch<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }>(
    buildApiUrl(API_ENDPOINTS.auth.login),
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    cookieStorage
  );

  if (!response.success || !response.data) {
    return response;
  }

  cookieStorage.set('accessToken', response.data.accessToken);
  cookieStorage.set('refreshToken', response.data.refreshToken);

  return response;
};

const register = async (
  data: ZodRegisterFormValues
): Promise<ApiResponse<{ userId: string }>> => {
  const cookieStorage = await cookies();

  return await apiFetch<{ userId: string }>(
    buildApiUrl(API_ENDPOINTS.auth.register),
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    cookieStorage
  );
};

const sendVerificationCode = async (data: {
  email: string;
  purpose: OtpPurpose;
}): Promise<ApiResponse<{ userId: string }>> => {
  const cookieStorage = await cookies();
  return await apiFetch<{ userId: string }>(
    buildApiUrl(API_ENDPOINTS.auth.sendVerificationCode),
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    cookieStorage
  );
};

const verifyEmail = async (
  data: ZodVerifyEmailValues
): Promise<
  ApiResponse<{ user: IUser; accessToken: string; refreshToken: string }>
> => {
  const cookieStorage = await cookies();

  const response = await apiFetch<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }>(
    buildApiUrl(API_ENDPOINTS.auth.verifyEmail),
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    cookieStorage
  );

  if (!response.success || !response.data) {
    return response;
  }

  cookieStorage.set('accessToken', response.data.accessToken);
  cookieStorage.set('refreshToken', response.data.refreshToken);

  return response;
};

const completeProfile = async (
  data: ZodCompleteProfileValues
): Promise<ApiResponse<IUser>> => {
  const cookieStorage = await cookies();

  return await apiFetch<IUser>(
    buildApiUrl(API_ENDPOINTS.auth.completeProfile),
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    cookieStorage
  );
};

const logout = async (): Promise<ApiResponse<null>> => {
  try {
    const cookieStorage = await cookies();
    cookieStorage.delete('accessToken');
    cookieStorage.delete('refreshToken');
    return { success: true, data: null };
  } catch (error: unknown) {
    return { success: false, data: null, error: getErrorMessage(error) };
  }
};

const forgotPassword = async (
  data: ZodForgotPasswordValues
): Promise<ApiResponse<null>> => {
  const cookieStorage = await cookies();
  return await apiFetch<null>(
    buildApiUrl(API_ENDPOINTS.auth.forgotPassword),
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    cookieStorage
  );
};

const changePassword = async (
  data: ZodChangePasswordValues & { token: string }
): Promise<ApiResponse<null>> => {
  const cookieStorage = await cookies();
  return await apiFetch<null>(
    buildApiUrl(API_ENDPOINTS.auth.changePassword),
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    cookieStorage
  );
};

export const authService = {
  getSession,
  login,
  register,
  sendVerificationCode,
  verifyEmail,
  completeProfile,
  logout,
  forgotPassword,
  changePassword,
};
