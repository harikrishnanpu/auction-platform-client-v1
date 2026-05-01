'use client';

import { Crown } from 'lucide-react';
import { useEffect } from 'react';
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

      {initialPlans.length === 0 ? (
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
          {initialPlans.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              isCheckoutPending={isPending && activePlanId === plan.id}
              onCheckout={startCheckout}
            />
          ))}
        </div>
      )}
    </section>
  );
}
