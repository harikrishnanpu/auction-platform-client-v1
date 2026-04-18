import z from 'zod';

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First Name must be at least 2 characters')
    .max(50, 'First Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'First Name can only contain letters and spaces'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last Name is required')
    .max(50, 'Last Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Last Name can only contain letters and spaces'),
  email: z.string().trim().email('Invalid email address'),
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
      /^[a-zA-Z0-9\s,.\#'\/\-]+$/,
      'Address contains invalid characters (like $, %, etc.)'
    ),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  avatar_url: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and privacy policy',
  }),
});

export type ZodRegisterFormValues = z.infer<typeof registerSchema>;
