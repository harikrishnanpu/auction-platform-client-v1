import { getWalletAction } from '@/actions/user/wallet.actions';
import { WalletPageView } from '@/features/user/wallet/components/WalletPageView';

export default async function ProfileWalletPage() {
  const res = await getWalletAction();

  return (
    <section>
      <WalletPageView
        wallet={res.success ? (res.data ?? null) : null}
        error={res.success ? null : (res.error ?? 'Failed to load wallet')}
      />
    </section>
  );
}
