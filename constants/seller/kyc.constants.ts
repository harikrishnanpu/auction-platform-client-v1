export const SELLER_KYC_VALIDATION = {
  ID_FRONT_REQUIRED: 'ID Front is required',
  ID_BACK_REQUIRED: 'ID Back is required',
  ADDRESS_PROOF_REQUIRED: 'Address Proof is required',
  LIVENESS_REQUIRED: 'Liveness check must be completed',
} as const;

export const SELLER_KYC_MESSAGES = {
  STEPS_INCOMPLETE: 'Please complete all verification steps',
} as const;
