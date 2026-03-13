import { KycProfile, KycStatusEnum } from '@/types/kyc.type';
import { create } from 'zustand';

interface KycState {
  kycProfile: KycProfile | null;
  kycStatus: KycStatusEnum | string | null;
  setKycData: (profile: KycProfile | null, status: string | null) => void;
}

const useKycStore = create<KycState>((set) => ({
  kycProfile: null,
  kycStatus: null,
  setKycData: (kycProfile, kycStatus) => set({ kycProfile, kycStatus }),
}));

export default useKycStore;
