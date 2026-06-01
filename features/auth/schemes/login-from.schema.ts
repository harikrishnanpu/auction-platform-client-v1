import z from 'zod';
import { AUTH_VALIDATION } from '@/constants/auth/validation.constants';

export const loginSchema = z.object({
  email: z.email(AUTH_VALIDATION.EMAIL_INVALID),
  password: z.string().trim().min(6, AUTH_VALIDATION.PASSWORD_MIN_LENGTH),
});

export type ZodLoginFormValues = z.infer<typeof loginSchema>;
