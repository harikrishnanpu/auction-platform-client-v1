import { z } from 'zod';
import { SELLER_KYC_VALIDATION } from '@/constants/seller/kyc.constants';

export const kycSubmissionSchema = z.object({
  idFront: z.string().min(1, SELLER_KYC_VALIDATION.ID_FRONT_REQUIRED),
  idBack: z.string().min(1, SELLER_KYC_VALIDATION.ID_BACK_REQUIRED),
  addressProof: z.string().min(1, SELLER_KYC_VALIDATION.ADDRESS_PROOF_REQUIRED),
  livenessCheck: z
    .boolean()
    .refine((val) => val === true, SELLER_KYC_VALIDATION.LIVENESS_REQUIRED),
});

export type KycSubmissionData = z.infer<typeof kycSubmissionSchema>;
