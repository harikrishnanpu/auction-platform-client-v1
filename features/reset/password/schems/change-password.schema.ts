import z from 'zod';
import { COMMON_VALIDATION } from '@/constants/common/validation.constants';

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6, COMMON_VALIDATION.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string().min(6, COMMON_VALIDATION.PASSWORD_MIN_LENGTH),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: COMMON_VALIDATION.PASSWORDS_DONT_MATCH,
    path: ['confirmPassword'],
  });

export type ZodChangePasswordValues = z.infer<typeof changePasswordSchema>;
