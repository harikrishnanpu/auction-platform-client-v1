import z from 'zod';
import { COMMON_VALIDATION } from '@/constants/common/validation.constants';

export const forgotPasswordSchema = z.object({
  email: z.email(COMMON_VALIDATION.EMAIL_INVALID),
});

export type ZodForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
