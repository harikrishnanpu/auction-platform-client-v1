'use client';

import { createSubscriptionPlanAction } from '@/actions/admin/admin.actions';
import { IAllowedSubscriptionFeatureMetadata } from '@/types/subscription.type';
import { useState, useTransition } from 'react';
import { ADMIN_SUBSCRIPTION_MESSAGES } from '@/constants/admin/messages.constants';
import { toast } from 'sonner';
import {
  SubscriptionPlanForm,
  SubscriptionPlanFormValue,
} from '@/features/admin/subscriptions/components/subscription-plan-form';

export function SubscriptionPlansView({
  allowedFeatures,
}: {
  allowedFeatures: IAllowedSubscriptionFeatureMetadata[];
}) {
  const [formValue, setFormValue] = useState<SubscriptionPlanFormValue>({
    name: '',
    description: '',
    price: '0',
    durationDays: '30',
    isDefault: false,
    isActive: true,
    features: [],
  });
  const [isPending, startTransition] = useTransition();

  const handleCreatePlan = () => {
    const payloadFeatures = formValue.features
      .filter((feature) => feature.featureId && feature.value.trim())
      .map((feature) => ({
        featureId: feature.featureId,
        value: feature.value.trim(),
      }));

    if (payloadFeatures.length === 0) {
      toast.error(ADMIN_SUBSCRIPTION_MESSAGES.FEATURE_REQUIRED);
      return;
    }

    const priceNum = Number(formValue.price);
    const durationDaysNum = Number(formValue.durationDays);

    if (!formValue.name.trim() || !formValue.description.trim()) {
      toast.error(ADMIN_SUBSCRIPTION_MESSAGES.PLAN_FIELDS_REQUIRED);
      return;
    }
    if (Number.isNaN(priceNum) || Number.isNaN(durationDaysNum)) {
      toast.error(ADMIN_SUBSCRIPTION_MESSAGES.PLAN_NUMBERS_INVALID);
      return;
    }

    startTransition(async () => {
      const response = await createSubscriptionPlanAction({
        name: formValue.name.trim(),
        description: formValue.description.trim(),
        price: priceNum,
        durationDays: durationDaysNum,
        isDefault: formValue.isDefault,
        features: payloadFeatures,
      });

      if (!response.success || !response.data) {
        toast.error(
          response.error ?? ADMIN_SUBSCRIPTION_MESSAGES.CREATE_FAILED
        );
        return;
      }
      setFormValue({
        name: '',
        description: '',
        price: '0',
        durationDays: '30',
        isDefault: false,
        isActive: true,
        features: [],
      });
      toast.success(ADMIN_SUBSCRIPTION_MESSAGES.CREATED);
    });
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <h2 className="text-lg font-semibold">Create subscription plan</h2>
      <SubscriptionPlanForm
        value={formValue}
        allowedFeatures={allowedFeatures}
        onChange={setFormValue}
      />

      <button
        type="button"
        disabled={isPending}
        onClick={handleCreatePlan}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isPending ? 'Creating...' : 'Create plan'}
      </button>
    </div>
  );
}
