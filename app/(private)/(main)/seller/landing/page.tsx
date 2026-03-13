import { redirect } from 'next/navigation';
import { getKycStatusAction } from '@/actions/kyc/kyc.action';
import { SellerLandingView } from '@/modules/seller/landing/components/landing-view';
import { KycStatusEnum } from '@/types/kyc.type';

export default async function SellerLandingPage() {
  const { data, error } = await getKycStatusAction('SELLER');

  if (data?.status === KycStatusEnum.APPROVED) {
    redirect('/seller/dashboard');
  }

  return (
    <SellerLandingView kycStatus={data?.status ?? null} error={error ?? null} />
  );
}
