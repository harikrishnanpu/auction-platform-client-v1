'use client';

import { useEffect } from 'react';
import useKycStore from '@/store/kyc.store';
import { IKycStatusOutput, KycProfile, KycStatusEnum } from '@/types/kyc.type';

interface SellerLayoutInitializerProps {
  children: React.ReactNode;
  kycData?: IKycStatusOutput | null;
  error?: string;
}

export default function SellerLayoutInitializer({
  children,
  kycData,
  error,
}: SellerLayoutInitializerProps) {
  const setKycData = useKycStore((state) => state.setKycData);

  useEffect(() => {
    if (kycData) {
      setKycData(kycData.kyc, kycData.status);
    } else if (error) {
      setKycData(null, KycStatusEnum.PENDING);
    }
  }, [kycData, error, setKycData]);

  return <>{children}</>;
}
