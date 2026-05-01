import { getUserSubscriptionPlansAction } from '@/actions/user/subscription.actions';
import { ProfileSubscriptionView } from '@/features/user/profile/components/profile-subscription-view';

export default async function UserSubscriptionPage() {
  const response = await getUserSubscriptionPlansAction();

  return (
    <section>
      <ProfileSubscriptionView
        initialPlans={response.success && response.data ? response.data : []}
        initialError={
          response.success ? null : (response.error ?? 'Could not load plans')
        }
      />
    </section>
  );
}
