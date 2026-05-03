'use client';

import { Crown } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { IPublicSubscriptionPlan } from '@/types/user-subscription.type';
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
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="flex items-center gap-2 text-xl font-semibold sm:text-2xl">
          <Crown className="h-5 w-5" />
          Subscription
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick the best plan for your bidding needs.
        </p>
      </header>

      {plans.length === 0 ? (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Subscription plans</CardTitle>
            <CardDescription>
              No plans are available right now. Please check again later.
            </CardDescription>
          </CardHeader>
        </Card>
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
    </section>
  );
}
