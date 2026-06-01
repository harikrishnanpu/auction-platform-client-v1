import { z } from 'zod';
import { COMPLETE_PROFILE_VALIDATION } from '@/constants/profile/constants';

export const completeProfileSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, COMPLETE_PROFILE_VALIDATION.PHONE_FORMAT),
  address: z
    .string()
    .trim()
    .min(10, COMPLETE_PROFILE_VALIDATION.ADDRESS_MIN)
    .max(500, COMPLETE_PROFILE_VALIDATION.ADDRESS_MAX)
    .regex(
      /^[a-zA-Z0-9\s,.\#'\/\-]+$/,
      COMPLETE_PROFILE_VALIDATION.ADDRESS_INVALID_CHARS
    ),
});

export type ZodCompleteProfileValues = z.infer<typeof completeProfileSchema>;
