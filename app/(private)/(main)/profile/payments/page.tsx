import { getUserPaymentsAction } from '@/actions/user/payments.actions';
import { ProfilePaymentsView } from '@/features/user/payments/components/ProfilePaymentsView';
import { readPageParam } from '@/lib/listing-search-params';
import type { PaymentStatus } from '@/features/user/payments/types/payments.types';

const PAGE_LIMIT = 10;

function readStatus(
  params: Record<string, string | string[] | undefined>
): PaymentStatus | 'ALL' {
  const raw = params.status;
  const value = typeof raw === 'string' ? raw : raw?.[0];
  if (value === 'PENDING' || value === 'COMPLETED' || value === 'DECLINED') {
    return value;
  }
  return 'ALL';
}

export default async function ProfilePaymentsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const page = readPageParam(params);
  const status = readStatus(params);

  const res = await getUserPaymentsAction({
    page,
    limit: PAGE_LIMIT,
    status: status === 'ALL' ? undefined : status,
  });

  return (
    <section>
      <ProfilePaymentsView
        page={page}
        limit={PAGE_LIMIT}
        status={status}
        data={res.success ? (res.data ?? null) : null}
        error={res.success ? null : (res.error ?? 'Failed to load payments')}
      />
    </section>
  );
}
