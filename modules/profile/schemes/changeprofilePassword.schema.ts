import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
    oldPassword: z.string().optional(),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
