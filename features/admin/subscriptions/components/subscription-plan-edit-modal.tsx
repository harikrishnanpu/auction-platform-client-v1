'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  SubscriptionPlanForm,
  SubscriptionPlanFormValue,
} from '@/features/admin/subscriptions/components/subscription-plan-form';
import {
  IAllowedSubscriptionFeatureMetadata,
  ISubscriptionPlan,
} from '@/types/subscription.type';

function getInitialPlanFormValue(
  plan: ISubscriptionPlan,
  allowedFeatures: IAllowedSubscriptionFeatureMetadata[]
): SubscriptionPlanFormValue {
  const mappedFeatures = plan.features
    .map((feature) => {
      const metadata = allowedFeatures.find(
        (item) => item.key === feature.featureKey
      );
      if (!metadata) return null;
      return {
        featureId: metadata.id,
        value: feature.value,
      };
    })
    .filter((item): item is { featureId: string; value: string } =>
      Boolean(item)
    );

  return {
    name: plan.name,
    description: plan.description,
    price: String(plan.price),
    durationDays: String(plan.durationDays),
    isDefault: plan.isDefault,
    isActive: plan.isActive,
    features: mappedFeatures,
  };
}

export function SubscriptionPlanEditModal({
  isOpen,
  plan,
  allowedFeatures,
  saving,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  plan: ISubscriptionPlan | null;
  allowedFeatures: IAllowedSubscriptionFeatureMetadata[];
  saving: boolean;
  onClose: () => void;
  onSave: (
    planId: string,
    value: SubscriptionPlanFormValue
  ) => Promise<{ success: boolean; error?: string | null }>;
}) {
  if (!isOpen || !plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <SubscriptionPlanEditModalContent
        key={`${plan.id}-${plan.updatedAt}`}
        plan={plan}
        allowedFeatures={allowedFeatures}
        saving={saving}
        onClose={onClose}
        onSave={onSave}
      />
    </Dialog>
  );
}

function SubscriptionPlanEditModalContent({
  plan,
  allowedFeatures,
  saving,
  onClose,
  onSave,
}: {
  plan: ISubscriptionPlan;
  allowedFeatures: IAllowedSubscriptionFeatureMetadata[];
  saving: boolean;
  onClose: () => void;
  onSave: (
    planId: string,
    value: SubscriptionPlanFormValue
  ) => Promise<{ success: boolean; error?: string | null }>;
}) {
  const [formValue, setFormValue] = useState<SubscriptionPlanFormValue>(() =>
    getInitialPlanFormValue(plan, allowedFeatures)
  );

  const handleSave = async () => {
    if (!formValue.name.trim() || !formValue.description.trim()) {
      toast.error('Plan name and description are required');
      return;
    }

    const price = Number(formValue.price);
    const durationDays = Number(formValue.durationDays);
    if (Number.isNaN(price) || Number.isNaN(durationDays)) {
      toast.error('Plan amount and duration must be valid numbers');
      return;
    }

    const validFeatures = formValue.features
      .filter((feature) => feature.featureId && feature.value.trim())
      .map((feature) => ({
        featureId: feature.featureId,
        value: feature.value.trim(),
      }));

    if (validFeatures.length === 0) {
      toast.error('Add at least one feature with a value');
      return;
    }

    const res = await onSave(plan.id, {
      ...formValue,
      price: String(price),
      durationDays: String(durationDays),
      features: validFeatures,
    });

    if (!res.success) {
      toast.error(res.error ?? 'Failed to update plan');
      return;
    }

    toast.success('Subscription plan updated');
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit subscription plan</DialogTitle>
        <DialogDescription>
          Update name, description, default, active, amount, duration, and plan
          features.
        </DialogDescription>
      </DialogHeader>

      <SubscriptionPlanForm
        value={formValue}
        allowedFeatures={allowedFeatures}
        onChange={setFormValue}
        includeActiveField
      />

      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
