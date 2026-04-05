import { getKycStatusAction } from '@/actions/kyc/kyc.action';
import SellerAreaShell from '@/features/seller/components/seller-area-shell';
import SellerLayoutInitializer from './seller-layout-initializer';

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error } = await getKycStatusAction('SELLER');

  return (
    <SellerLayoutInitializer kycData={data} error={error}>
      <SellerAreaShell>{children}</SellerAreaShell>
    </SellerLayoutInitializer>
  );
}
