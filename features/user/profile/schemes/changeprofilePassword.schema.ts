import { z } from 'zod';
import { PROFILE_VALIDATION } from '@/constants/profile/constants';

export const changePasswordSchema = z
  .object({
    otp: z.string().length(6, PROFILE_VALIDATION.OTP_LENGTH),
    oldPassword: z
      .string()
      .trim()
      .min(6, PROFILE_VALIDATION.PASSWORD_MIN_LENGTH),
    newPassword: z
      .string()
      .trim()
      .min(6, PROFILE_VALIDATION.PASSWORD_MIN_LENGTH),
    confirmPassword: z
      .string()
      .trim()
      .min(6, PROFILE_VALIDATION.PASSWORD_MIN_LENGTH),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: PROFILE_VALIDATION.PASSWORDS_DO_NOT_MATCH,
    path: ['confirmPassword'],
  });

export type ZodChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
