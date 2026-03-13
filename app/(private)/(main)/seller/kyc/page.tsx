import { getKycStatusAction } from '@/actions/kyc/kyc.action';
import { SellerKycView } from '@/modules/seller/kyc/components/kyc-view';

export default async function SellerKycPage() {
  const { data, error } = await getKycStatusAction('SELLER');

  return (
    <SellerKycView
      initialProfile={data?.kyc ?? null}
      initialStatus={data?.status ?? null}
      initialError={error}
    />
  );
}
