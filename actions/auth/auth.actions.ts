'use server';

import { OtpPurpose } from '@/constants/auth/otp.constants';
import { ZodLoginFormValues } from '@/modules/auth/schemes/login-from.schema';
import { ZodRegisterFormValues } from '@/modules/auth/schemes/register-form.schema';
import { ZodCompleteProfileValues } from '@/modules/complete-profile/schemes/complete-profile-schema';
import { ZodChangePasswordValues } from '@/modules/reset/password/schems/change-password.schema';
import { ZodForgotPasswordValues } from '@/modules/reset/password/schems/forget-password.schema';
import { ZodVerifyEmailValues } from '@/modules/verify/email/schemes/verify-email.schema';
import { authService } from '@/services/auth/auth.service';
import { ApiResponse } from '@/types/api.index';
import { IUser } from '@/types/user.type';

export const authGetSesssion = async (): Promise<ApiResponse<IUser>> => {
  return await authService.getSession();
};

export const registerAction = async (
  data: ZodRegisterFormValues
): Promise<ApiResponse<{ userId: string }>> => {
  return await authService.register(data);
};

export const loginAction = async (
  data: ZodLoginFormValues
): Promise<
  ApiResponse<{ user: IUser; accessToken: string; refreshToken: string }>
> => {
  return await authService.login(data);
};

export const sendVerificationCodeAction = async (data: {
  email: string;
  purpose: OtpPurpose;
}): Promise<ApiResponse<{ userId: string }>> => {
  return await authService.sendVerificationCode(data);
};

export const verifyEmailAction = async (
  data: ZodVerifyEmailValues
): Promise<
  ApiResponse<{ user: IUser; accessToken: string; refreshToken: string }>
> => {
  return await authService.verifyEmail(data);
};

export const completeProfileAction = async (
  data: ZodCompleteProfileValues
): Promise<ApiResponse<IUser>> => {
  return await authService.completeProfile(data);
};

export const logoutAction = async (): Promise<ApiResponse<null>> => {
  return await authService.logout();
};

export const forgotPasswordAction = async (
  data: ZodForgotPasswordValues
): Promise<ApiResponse<null>> => {
  return await authService.forgotPassword(data);
};

export const changePasswordAction = async (
  data: ZodChangePasswordValues
): Promise<ApiResponse<null>> => {
  return await authService.changePassword(data);
};
