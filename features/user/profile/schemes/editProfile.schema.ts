import { z } from 'zod';

export const editProfileSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  phone: z
    .string()
    .trim()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(
      /^\+?[0-9]+$/,
      "Phone number can only contain digits and an optional '+' prefix"
    ),
  address: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address is too long')
    .regex(
      /^[a-zA-Z0-9\s,.\-#'\/]+$/,
      'Address contains invalid characters (like $, %, etc.)'
    ),
});

export type ZodEditProfileFormValues = z.infer<typeof editProfileSchema>;
