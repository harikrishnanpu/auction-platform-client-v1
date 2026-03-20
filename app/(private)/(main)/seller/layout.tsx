import { Suspense } from 'react';

import { getKycStatusAction } from '@/actions/kyc/kyc.action';
import { SellerShellSkeleton } from '@/modules/seller/components/seller-shell-skeleton';
import SellerLayoutInitializer from './seller-layout-initializer';

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error } = await getKycStatusAction('SELLER');

  return (
    <SellerLayoutInitializer kycData={data} error={error}>
      <Suspense fallback={<SellerShellSkeleton />}>{children}</Suspense>
    </SellerLayoutInitializer>
  );
}
