import { redirect } from 'next/navigation';
import { getKycStatusAction } from '@/actions/kyc/kyc.action';
import { SellerKycView } from '@/features/seller/kyc/components/kyc-view';
import { KycStatusEnum } from '@/types/kyc.type';

export default async function SellerKycPage() {
  const { data } = await getKycStatusAction('SELLER');

  if (data?.status === KycStatusEnum.APPROVED) {
    redirect('/seller/dashboard');
  }

  return <SellerKycView />;
}
