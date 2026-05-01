'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { IPublicSubscriptionPlan } from '@/types/user-subscription.type';

interface SubscriptionPlanCardProps {
  plan: IPublicSubscriptionPlan;
  isCheckoutPending: boolean;
  onCheckout: (planId: string) => void;
}

export function SubscriptionPlanCard({
  plan,
  isCheckoutPending,
  onCheckout,
}: SubscriptionPlanCardProps) {
  const isCheckoutDisabled = isCheckoutPending || plan.isCurrentPlan;

  return (
    <Card className="border-border/60">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          {plan.isDefault ? (
            <Badge variant="secondary" className="shrink-0">
              Default
            </Badge>
          ) : null}
        </div>
        <CardDescription className="line-clamp-1">
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

        <div className="text-sm text-muted-foreground">
          <h3 className="text-sm font-medium">Features:</h3>
          <ul className="list-disc list-inside">
            {plan.features.map((feature) => (
              <li className="mx-auto text-center" key={feature.id}>
                <span className="font-medium">{feature.description}:</span>
                <span className="text-muted-foreground ml-2">
                  {feature.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          type="button"
          disabled={isCheckoutDisabled}
          onClick={() => onCheckout(plan.id)}
        >
          {plan.isCurrentPlan
            ? 'Current plan'
            : isCheckoutPending
              ? 'Redirecting...'
              : 'Subscribe'}
        </Button>
      </CardContent>
    </Card>
  );
}
