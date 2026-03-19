'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
    rejection_reason_message:
      anyKyc.rejection_reason_message ?? anyKyc.rejectionReason,
  } as KycProfile;
}

export default function SellerLayoutInitializer({
  children,
  kycData,
  error,
}: SellerLayoutInitializerProps) {
  const setKycData = useKycStore((state) => state.setKycData);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (kycData) {
      const kyc = normalizeKyc(kycData.kyc);
      setKycData(kyc, kycData.status);
    } else {
      // If we don't have KYC data (or the request failed), treat it as "not verified yet"
      // to avoid leaving the store in an indeterminate "null" state.
      setKycData(null, KycStatusEnum.PENDING);
    }
  }, [kycData, error, setKycData]);

  useEffect(() => {
    if (!kycData || kycData.status !== KycStatusEnum.APPROVED) return;
    const path = pathname ?? '';
    if (
      path === '/seller' ||
      path === '/seller/landing' ||
      path === '/seller/kyc'
    ) {
      router.replace('/seller/dashboard');
    }
  }, [kycData, pathname, router]);

  return <>{children}</>;
}
