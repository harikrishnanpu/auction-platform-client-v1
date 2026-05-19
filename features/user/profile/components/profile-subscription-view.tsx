'use client';

import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { appCard } from '@/lib/app-design';
import type { IPublicSubscriptionPlan } from '@/types/user-subscription.type';
import { ProfilePageShell } from '@/features/user/profile/components/profile-page-shell';

import { useSubscriptionCheckout } from '../hooks/use-subscription-checkout';
import { SubscriptionPlanCard } from './subscription-plan-card';

interface ProfileSubscriptionViewProps {
  initialPlans: IPublicSubscriptionPlan[];
  initialError: string | null;
}

export function ProfileSubscriptionView({
  initialPlans,
  initialError,
}: ProfileSubscriptionViewProps) {
  const { activePlanId, isPending, startCheckout } = useSubscriptionCheckout();
  const plans = useMemo(
    () => [...initialPlans].sort((a, b) => a.rank - b.rank),
    [initialPlans]
  );
  const currentPlan = useMemo(
    () => plans.find((plan) => plan.isCurrentPlan) ?? null,
    [plans]
  );

  useEffect(() => {
    if (!initialError) return;
    toast.error(initialError);
  }, [initialError]);

  return (
    <ProfilePageShell className="lg:max-w-5xl">
      {plans.length === 0 ? (
        <div className={appCard()}>
          <h2 className="app-section-title">Subscription plans</h2>
          <p className="mt-2 text-[13px] text-muted-foreground">
            No plans are available right now. Please check again later.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => {
            const isCurrentPlan = plan.isCurrentPlan;
            const isLowerOrEqualRankThanCurrent =
              !!currentPlan && plan.rank <= currentPlan.rank;
            const isCheckoutDisabled =
              isCurrentPlan ||
              isPending ||
              (!isCurrentPlan && isLowerOrEqualRankThanCurrent);

            let actionLabel = 'Subscribe';
            if (isCurrentPlan) actionLabel = 'Current plan';
            else if (isPending && activePlanId === plan.id)
              actionLabel = 'Opening...';
            else if (!currentPlan) actionLabel = 'Subscribe';
            else if (plan.rank > currentPlan.rank) actionLabel = 'Upgrade';
            else actionLabel = 'Subscribe';

            return (
              <SubscriptionPlanCard
                key={plan.id}
                plan={plan}
                isCheckoutDisabled={isCheckoutDisabled}
                actionLabel={actionLabel}
                onCheckout={startCheckout}
              />
            );
          })}
        </div>
      )}
    </ProfilePageShell>
  );
}
