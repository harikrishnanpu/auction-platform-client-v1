import { z } from 'zod';

export const completeProfileSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Phone number must be 10 digits starting with 6-9'),
  address: z
    .string()
    .trim()
    .min(10, 'Address must be at least 10 characters long')
    .max(500, 'Address is too long')
    .regex(
      /^[a-zA-Z0-9\s,.\#'\/\-]+$/,
      'Address contains invalid characters (like $, %, etc.)'
    ),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
