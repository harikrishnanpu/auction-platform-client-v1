'use client';

import { IAllowedSubscriptionFeatureMetadata } from '@/types/subscription.type';
import { SubscriptionPlanField } from '@/features/admin/subscriptions/components/subscription-plan-field';
import {
  FeatureInput,
  SubscriptionFeatureRow,
} from '@/features/admin/subscriptions/components/subscription-feature-row';

export type SubscriptionPlanFormValue = {
  name: string;
  description: string;
  price: string;
  durationDays: string;
  isDefault: boolean;
  isActive: boolean;
  features: FeatureInput[];
};

export function SubscriptionPlanForm({
  value,
  allowedFeatures,
  onChange,
  includeActiveField = false,
}: {
  value: SubscriptionPlanFormValue;
  allowedFeatures: IAllowedSubscriptionFeatureMetadata[];
  onChange: (next: SubscriptionPlanFormValue) => void;
  includeActiveField?: boolean;
}) {
  const updateFeature = (index: number, nextFeature: FeatureInput) => {
    onChange({
      ...value,
      features: value.features.map((item, itemIndex) =>
        itemIndex === index ? nextFeature : item
      ),
    });
  };

  const removeFeature = (index: number) => {
    onChange({
      ...value,
      features: value.features.filter((_, itemIndex) => itemIndex !== index),
    });
  };

  const addFeature = () => {
    onChange({
      ...value,
      features: [
        ...value.features,
        {
          featureId: '',
          value: '',
        },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <SubscriptionPlanField
          label="Plan name"
          value={value.name}
          onChange={(name) => onChange({ ...value, name })}
          placeholder="Basic Plan"
        />
        <SubscriptionPlanField
          label="Plan description"
          value={value.description}
          onChange={(description) => onChange({ ...value, description })}
          placeholder="Suitable for beginners"
        />
        <SubscriptionPlanField
          label="Plan amount"
          value={value.price}
          onChange={(price) => onChange({ ...value, price })}
          placeholder="499"
          type="number"
        />
        <SubscriptionPlanField
          label="Duration (days)"
          value={value.durationDays}
          onChange={(durationDays) => onChange({ ...value, durationDays })}
          placeholder="30"
          type="number"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="flex items-center gap-2 rounded-md border px-3 py-2">
          <input
            id="default-plan"
            type="checkbox"
            checked={value.isDefault}
            onChange={(e) =>
              onChange({ ...value, isDefault: e.target.checked })
            }
          />
          <label htmlFor="default-plan" className="text-sm font-medium">
            Set as default plan
          </label>
        </div>

        {includeActiveField && (
          <div className="flex items-center gap-2 rounded-md border px-3 py-2">
            <input
              id="active-plan"
              type="checkbox"
              checked={value.isActive}
              onChange={(e) =>
                onChange({ ...value, isActive: e.target.checked })
              }
            />
            <label htmlFor="active-plan" className="text-sm font-medium">
              Set as active
            </label>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {value.features.map((feature, index) => (
          <SubscriptionFeatureRow
            key={`${feature.featureId || 'feature'}-${index}`}
            feature={feature}
            allowedFeatures={allowedFeatures}
            onChange={(next) => updateFeature(index, next)}
            onRemove={() => removeFeature(index)}
          />
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          + Add feature
        </button>
      </div>
    </div>
  );
}
