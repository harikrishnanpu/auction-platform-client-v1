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
  isCheckoutDisabled: boolean;
  actionLabel: string;
  onCheckout: (planId: string) => void;
}

export function SubscriptionPlanCard({
  plan,
  isCheckoutDisabled,
  actionLabel,
  onCheckout,
}: SubscriptionPlanCardProps) {
  return (
    <Card className="border-border/60">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">
            {plan.name}
            <span className="ml-2 text-xs font-medium text-muted-foreground">
              Rank {plan.rank}
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {plan.isCurrentPlan ? (
              <Badge variant="default" className="shrink-0">
                Current
              </Badge>
            ) : null}
            {plan.isDefault ? (
              <Badge variant="secondary" className="shrink-0">
                Default
              </Badge>
            ) : null}
          </div>
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
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
