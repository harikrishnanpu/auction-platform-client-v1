'use client';

import { useEffect } from 'react';
import useKycStore from '@/store/kyc.store';
import { IKycStatusOutput, KycProfile, KycStatusEnum } from '@/types/kyc.type';

interface SellerLayoutInitializerProps {
  children: React.ReactNode;
  kycData?: IKycStatusOutput | null;
  error?: string;
}

function normalizeKyc(kyc: IKycStatusOutput['kyc']): KycProfile | null {
  if (!kyc) return null;
  const anyKyc = kyc as KycProfile & { rejectionReason?: string };
  return {
    ...kyc,
    status: kyc.status as KycProfile['status'],
    rejection_reason_message: anyKyc.rejectionReason,
  } as KycProfile;
}

export default function SellerLayoutInitializer({
  children,
  kycData,
  error,
}: SellerLayoutInitializerProps) {
  const setKycData = useKycStore((state) => state.setKycData);

  useEffect(() => {
    if (kycData) {
      const kyc = normalizeKyc(kycData.kyc);
      setKycData(kyc, kycData.status);
    } else {
      setKycData(null, KycStatusEnum.PENDING);
    }
  }, [kycData, error, setKycData]);

  return <>{children}</>;
}
