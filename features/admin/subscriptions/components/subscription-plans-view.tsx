'use client';

import { createSubscriptionPlanAction } from '@/actions/admin/admin.actions';
import { ISubscriptionPlan } from '@/types/subscription.type';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function SubscriptionPlansView({
  initialPlans,
  allowedFeatureKeys,
  allowedValueTypes,
}: {
  initialPlans: ISubscriptionPlan[];
  allowedFeatureKeys: string[];
  allowedValueTypes: string[];
}) {
  const [plans, setPlans] = useState(initialPlans);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [durationDays, setDurationDays] = useState('30');
  const [isPending, startTransition] = useTransition();

  const [features, setFeatures] = useState<
    {
      featureKey: string;
      value: string;
      type: 'BOOLEAN' | 'NUMBER' | 'STRING';
    }[]
  >(
    allowedFeatureKeys.map((featureKey) => ({
      featureKey,
      value: '',
      type: 'STRING',
    }))
  );

  const handleFeatureValueChange = (featureKey: string, value: string) => {
    setFeatures((prev) =>
      prev.map((item) =>
        item.featureKey === featureKey ? { ...item, value } : item
      )
    );
  };

  const handleFeatureTypeChange = (
    featureKey: string,
    type: 'BOOLEAN' | 'NUMBER' | 'STRING'
  ) => {
    setFeatures((prev) =>
      prev.map((item) =>
        item.featureKey === featureKey ? { ...item, type } : item
      )
    );
  };

  const handleCreatePlan = () => {
    startTransition(async () => {
      const response = await createSubscriptionPlanAction({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        durationDays: Number(durationDays),
        features: features.filter((feature) => feature.value.trim().length > 0),
      });

      if (!response.success || !response.data) {
        toast.error(response.error ?? 'Failed to create plan');
        return;
      }

      setPlans((prev) => [response.data!, ...prev]);
      setName('');
      setDescription('');
      toast.success('Subscription plan created');
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4 space-y-4">
        <h2 className="text-lg font-semibold">Create subscription plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Plan name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            className="rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Duration days"
            type="number"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {features.map((feature) => (
            <div
              key={feature.featureKey}
              className="grid grid-cols-1 md:grid-cols-3 gap-2"
            >
              <input
                className="rounded-md border bg-muted px-3 py-2 text-sm"
                value={feature.featureKey}
                disabled
              />
              <select
                className="rounded-md border bg-background px-3 py-2 text-sm"
                value={feature.type}
                onChange={(e) =>
                  handleFeatureTypeChange(
                    feature.featureKey,
                    e.target.value as 'BOOLEAN' | 'NUMBER' | 'STRING'
                  )
                }
              >
                {allowedValueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                className="rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Feature value"
                value={feature.value}
                onChange={(e) =>
                  handleFeatureValueChange(feature.featureKey, e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={handleCreatePlan}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isPending ? 'Creating...' : 'Create plan'}
        </button>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold mb-3">All subscription plans</h2>
        <div className="space-y-3">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-md border p-3">
              <div className="font-semibold">{plan.name}</div>
              <div className="text-sm text-muted-foreground">
                {plan.description}
              </div>
              <div className="text-sm mt-1">
                Price: {plan.price} | Duration: {plan.durationDays} days
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {plan.features.map((feature) => (
                  <span
                    key={feature.id}
                    className="rounded bg-muted px-2 py-1 text-xs font-medium"
                  >
                    {feature.featureKey}: {feature.value} ({feature.type})
                  </span>
                ))}
              </div>
            </div>
          ))}
          {plans.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No plans created yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
