'use client';

import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  getUserSubscriptionPlansAction,
  startUserSubscriptionCheckoutAction,
} from '@/actions/user/subscription.actions';
import type { IPublicSubscriptionPlan } from '@/types/user-subscription.type';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function UserSubscriptionPage() {
  const [plans, setPlans] = useState<IPublicSubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await getUserSubscriptionPlansAction();
      if (cancelled) return;
      if (!res.success || !res.data) {
        toast.error(res.error ?? 'Could not load plans');
        setPlans([]);
      } else {
        setPlans(res.data);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubscribe = (planId: string) => {
    startTransition(async () => {
      const res = await startUserSubscriptionCheckoutAction(planId);
      if (!res.success || !res.data) {
        toast.error(res.error ?? 'Could not start checkout');
        return;
      }
      window.location.assign(res.data.shortUrl);
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground">
        Loading plans…
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Subscription plans</CardTitle>
          <CardDescription>
            No upgrade plans are available right now. Check back later or
            contact support.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Subscription</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a plan to pay securely on Razorpay. Your account updates
          automatically after payment.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription className="line-clamp-3">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="text-2xl font-semibold text-foreground">
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>
                <span> / {plan.durationDays} days</span>
              </div>
              <Button
                type="button"
                disabled={isPending}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isPending ? 'Redirecting…' : 'Subscribe with Razorpay'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
