import { z } from 'zod';

export const kycSubmissionSchema = z.object({
  idFront: z.string().min(1, 'ID Front is required'),
  idBack: z.string().min(1, 'ID Back is required'),
  addressProof: z.string().min(1, 'Address Proof is required'),
  livenessCheck: z
    .boolean()
    .refine((val) => val === true, 'Liveness check must be completed'),
});

export type KycSubmissionData = z.infer<typeof kycSubmissionSchema>;
