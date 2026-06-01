import { z } from 'zod';
import { PROFILE_VALIDATION } from '@/constants/profile/constants';

export const editProfileSchema = z.object({
  otp: z.string().length(6, PROFILE_VALIDATION.OTP_LENGTH),
  name: z
    .string()
    .trim()
    .min(3, PROFILE_VALIDATION.NAME_MIN_3)
    .max(100, PROFILE_VALIDATION.NAME_MAX)
    .regex(/^[a-zA-Z\s]+$/, PROFILE_VALIDATION.NAME_LETTERS_ONLY),
  phone: z
    .string()
    .trim()
    .min(10, PROFILE_VALIDATION.PHONE_MIN)
    .max(15, PROFILE_VALIDATION.PHONE_MAX)
    .regex(/^[+]?[0-9]+$/, PROFILE_VALIDATION.PHONE_FORMAT),
  address: z
    .string()
    .trim()
    .min(5, PROFILE_VALIDATION.ADDRESS_MIN_5)
    .max(200, PROFILE_VALIDATION.ADDRESS_MAX_200)
    .regex(
      /^[a-zA-Z0-9\s,.\-#'\/]+$/,
      PROFILE_VALIDATION.ADDRESS_INVALID_CHARS
    ),
});

export type ZodEditProfileFormValues = z.infer<typeof editProfileSchema>;
