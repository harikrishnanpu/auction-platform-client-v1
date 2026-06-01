import { getMyAuctionsAction } from '@/actions/user/my-auctions.actions';
import { ProfileMyAuctionsView } from '@/features/user/auctions/components/profile-my-auctions-view';
import {
  countMyAuctionsActiveFilters,
  parseMyAuctionsFilters,
} from '@/lib/listing-search-params';

export default async function ProfileMyAuctionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const filters = parseMyAuctionsFilters(params);

  const res = await getMyAuctionsAction(filters);

  return (
    <section>
      <ProfileMyAuctionsView
        filters={filters}
        data={res.success ? (res.data ?? null) : null}
        error={res.success ? null : (res.error ?? 'Failed to load auctions')}
        activeFilterCount={countMyAuctionsActiveFilters(filters)}
      />
    </section>
  );
}
