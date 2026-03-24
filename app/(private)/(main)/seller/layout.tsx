import { getKycStatusAction } from '@/actions/kyc/kyc.action';
import SellerLayoutInitializer from './seller-layout-initializer';

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error } = await getKycStatusAction('SELLER');

  return (
    <SellerLayoutInitializer kycData={data} error={error}>
      {children}
    </SellerLayoutInitializer>
  );
}
