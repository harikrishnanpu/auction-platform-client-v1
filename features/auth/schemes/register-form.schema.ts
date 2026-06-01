import z from 'zod';
import { AUTH_VALIDATION } from '@/constants/auth/validation.constants';

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, AUTH_VALIDATION.FIRST_NAME_MIN)
    .max(50, AUTH_VALIDATION.FIRST_NAME_MAX)
    .regex(/^[a-zA-Z\s]+$/, AUTH_VALIDATION.FIRST_NAME_LETTERS_ONLY),
  lastName: z
    .string()
    .trim()
    .min(1, AUTH_VALIDATION.LAST_NAME_REQUIRED)
    .max(50, AUTH_VALIDATION.LAST_NAME_MAX)
    .regex(/^[a-zA-Z\s]+$/, AUTH_VALIDATION.LAST_NAME_LETTERS_ONLY),
  email: z.string().trim().email(AUTH_VALIDATION.EMAIL_INVALID),
  phone: z
    .string()
    .trim()
    .min(10, AUTH_VALIDATION.PHONE_MIN)
    .max(15, AUTH_VALIDATION.PHONE_MAX)
    .regex(/^[+]?[0-9]+$/, AUTH_VALIDATION.PHONE_FORMAT),
  address: z
    .string()
    .trim()
    .min(5, AUTH_VALIDATION.ADDRESS_MIN_5)
    .max(200, AUTH_VALIDATION.ADDRESS_MAX_200)
    .regex(/^[a-zA-Z0-9\s,.\#'\/\-]+$/, AUTH_VALIDATION.ADDRESS_INVALID_CHARS),
  password: z
    .string()
    .min(6, AUTH_VALIDATION.PASSWORD_MIN_LENGTH)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      AUTH_VALIDATION.PASSWORD_COMPLEXITY
    ),
  avatar_url: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: AUTH_VALIDATION.TERMS_REQUIRED,
  }),
});

export type ZodRegisterFormValues = z.infer<typeof registerSchema>;
