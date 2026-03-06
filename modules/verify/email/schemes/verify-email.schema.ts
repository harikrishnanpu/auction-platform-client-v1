import z from 'zod';

export const verifyEmailSchema = z.object({
  otp: z.array(z.string()).length(6, 'Please enter the complete 6-digit code.'),
});

export type VerifyEmailSchemaType = z.infer<typeof verifyEmailSchema>;
