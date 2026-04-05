import { OTP_CHANNEL, OTP_PURPOSE } from '@/constants/auth/otp.constants';
import z from 'zod';

export const verifyEmailSchema = z.object({
  otp: z.string().min(6, 'Please enter the complete 6-digit code.'),
  email: z.email('Invalid email address'),
  purpose: z.enum(OTP_PURPOSE),
  channel: z.enum(OTP_CHANNEL),
});

export type ZodVerifyEmailValues = z.infer<typeof verifyEmailSchema>;
