import { OTP_CHANNEL, OTP_PURPOSE } from '@/constants/auth/otp.constants';
import { COMMON_VALIDATION } from '@/constants/common/validation.constants';
import z from 'zod';

export const verifyEmailSchema = z.object({
  otp: z.string().min(6, COMMON_VALIDATION.OTP_COMPLETE),
  email: z.email(COMMON_VALIDATION.EMAIL_INVALID),
  purpose: z.enum(OTP_PURPOSE),
  channel: z.enum(OTP_CHANNEL),
});

export type ZodVerifyEmailValues = z.infer<typeof verifyEmailSchema>;
