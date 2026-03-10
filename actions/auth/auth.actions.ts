'use server';

import { OtpChannel, OtpPurpose } from '@/constants/auth/otp.constants';
import { LoginFormValues } from '@/modules/auth/schemes/login-from.schema';
import { RegisterFormValues } from '@/modules/auth/schemes/register-form.schema';
import { authService } from '@/services/auth/auth.service';
import { ApiResponse } from '@/types/api.index';
import { UserInfo } from '@/types/user.type';

export const authGetSesssion = async (): Promise<ApiResponse<UserInfo>> => {
  return await authService.getSession();
};

export const registerAction = async (
  data: RegisterFormValues
): Promise<ApiResponse<{ userId: string }>> => {
  return await authService.register(data);
};

export const loginAction = async (
  data: LoginFormValues
): Promise<
  ApiResponse<{ user: UserInfo; accessToken: string; refreshToken: string }>
> => {
  return await authService.login(data);
};

export const sendVerificationCodeAction = async (data: {
  otp: string;
  email: string;
  purpose: string;
}): Promise<ApiResponse<{ userId: string }>> => {
  return await authService.sendVerificationCode(data);
};

export const verifyEmailAction = async (data: {
  otp: string;
  email: string;
  purpose: OtpPurpose;
  channel: OtpChannel;
}): Promise<
  ApiResponse<{ user: UserInfo; accessToken: string; refreshToken: string }>
> => {
  return await authService.verifyEmail(data);
};

export const completeProfileAction = async (data: {
  phone: string;
  address: string;
}): Promise<ApiResponse<UserInfo>> => {
  return await authService.completeProfile(data);
};

export const logoutAction = async (): Promise<ApiResponse<null>> => {
  return await authService.logout();
};

export const forgotPasswordAction = async (data: {
  email: string;
}): Promise<ApiResponse<null>> => {
  return await authService.forgotPassword(data);
};

export const changePasswordAction = async (data: {
  newPassword: string;
  token: string;
}): Promise<ApiResponse<null>> => {
  return await authService.changePassword(data);
};
