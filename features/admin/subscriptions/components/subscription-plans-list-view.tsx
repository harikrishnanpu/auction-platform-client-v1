'use client';

import { updateSubscriptionPlanAction } from '@/actions/admin/admin.actions';
import { SubscriptionPlanEditModal } from '@/features/admin/subscriptions/components/subscription-plan-edit-modal';
import { SubscriptionPlanFormValue } from '@/features/admin/subscriptions/components/subscription-plan-form';
import {
  IAllowedSubscriptionFeatureMetadata,
  ISubscriptionPlan,
} from '@/types/subscription.type';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

const PAGE_SIZE = 6;

export function SubscriptionPlansListView({
  initialPlans,
  allowedFeatures,
}: {
  initialPlans: ISubscriptionPlan[];
  allowedFeatures: IAllowedSubscriptionFeatureMetadata[];
}) {
  const [plans, setPlans] = useState(initialPlans);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [updatingPlanId, setUpdatingPlanId] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<ISubscriptionPlan | null>(
    null
  );

  const totalPages = Math.max(1, Math.ceil(plans.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return plans.slice(start, start + PAGE_SIZE);
  }, [plans, currentPage]);

  const handleUpdateStatus = (
    planId: string,
    nextStatus: { isDefault: boolean; isActive: boolean }
  ) => {
    const planToUpdate = plans.find((plan) => plan.id === planId);
    if (!planToUpdate) {
      toast.error('Unable to find selected plan');
      return;
    }

    const features = planToUpdate.features
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

    setUpdatingPlanId(planId);
    startTransition(async () => {
      const response = await updateSubscriptionPlanAction({
        planId,
        name: planToUpdate.name,
        description: planToUpdate.description,
        price: planToUpdate.price,
        durationDays: planToUpdate.durationDays,
        isDefault: nextStatus.isDefault,
        isActive: nextStatus.isActive,
        features,
      });

      setUpdatingPlanId(null);
      if (!response.success || !response.data) {
        toast.error(response.error ?? 'Failed to update subscription plan');
        return;
      }

      setPlans((prev) =>
        prev.map((plan) => (plan.id === planId ? response.data! : plan))
      );
      toast.success('Subscription plan updated');
    });
  };

  const handleSaveEditedPlan = async (
    planId: string,
    value: SubscriptionPlanFormValue
  ): Promise<{ success: boolean; error?: string | null }> => {
    const response = await updateSubscriptionPlanAction({
      planId,
      name: value.name.trim(),
      description: value.description.trim(),
      price: Number(value.price),
      durationDays: Number(value.durationDays),
      isDefault: value.isDefault,
      isActive: value.isActive,
      features: value.features
        .filter((feature) => feature.featureId && feature.value.trim())
        .map((feature) => ({
          featureId: feature.featureId,
          value: feature.value.trim(),
        })),
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error ?? 'Failed to update subscription plan',
      };
    }

    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === response.data!.id ? response.data! : plan
      )
    );

    return { success: true };
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <h2 className="text-lg font-semibold mb-3">All subscription plans</h2>
      <div className="space-y-3">
        {paginatedPlans.map((plan) => {
          const isUpdating = isPending && updatingPlanId === plan.id;
          return (
            <div key={plan.id} className="rounded-md border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">{plan.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {plan.description}
                  </div>
                  <div className="text-sm mt-1">
                    Price: {plan.price} | Duration: {plan.durationDays} days
                  </div>
                </div>
                {plan.isDefault && (
                  <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    Default
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={plan.isDefault}
                    disabled={isUpdating}
                    onChange={(e) =>
                      handleUpdateStatus(plan.id, {
                        isDefault: e.target.checked,
                        isActive: plan.isActive,
                      })
                    }
                  />
                  Default
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={plan.isActive}
                    disabled={isUpdating}
                    onChange={(e) =>
                      handleUpdateStatus(plan.id, {
                        isDefault: plan.isDefault,
                        isActive: e.target.checked,
                      })
                    }
                  />
                  Active
                </label>
              </div>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setEditingPlan(plan)}
                  className="rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                >
                  Edit
                </button>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {plan.features.map((feature) => (
                  <span
                    key={feature.id}
                    className="rounded bg-muted px-2 py-1 text-xs font-medium"
                  >
                    {feature.description}: {feature.value} ({feature.type})
                  </span>
                ))}
              </div>
            </div>
          );
        })}
        {plans.length === 0 && (
          <p className="text-sm text-muted-foreground">No plans created yet.</p>
        )}
      </div>

      {plans.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      )}

      <SubscriptionPlanEditModal
        isOpen={Boolean(editingPlan)}
        plan={editingPlan}
        allowedFeatures={allowedFeatures}
        saving={isPending}
        onClose={() => setEditingPlan(null)}
        onSave={handleSaveEditedPlan}
      />
    </div>
  );
}
