import { getKycStatusAction } from '@/actions/kyc/kyc.action';
import { SellerLandingView } from '@/modules/seller/landing/components/landing-view';

export default async function SellerLandingPage() {
  const { data, error } = await getKycStatusAction('SELLER');

  return (
    <SellerLandingView kycStatus={data?.status ?? null} error={error ?? null} />
  );
}
