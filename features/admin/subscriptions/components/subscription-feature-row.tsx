'use client';

import { IAllowedSubscriptionFeatureMetadata } from '@/types/subscription.type';

export type FeatureInput = {
  featureId: string;
  value: string;
};

export function SubscriptionFeatureRow({
  feature,
  allowedFeatures,
  onChange,
  onRemove,
}: {
  feature: FeatureInput;
  allowedFeatures: IAllowedSubscriptionFeatureMetadata[];
  onChange: (feature: FeatureInput) => void;
  onRemove: () => void;
}) {
  const meta =
    allowedFeatures.find((item) => item.id === feature.featureId) ?? null;

  return (
    <div className="rounded-md border p-3 space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={feature.featureId}
          onChange={(e) =>
            onChange({
              featureId: e.target.value,
              value: feature.value,
            })
          }
        >
          <option value="">Select feature</option>
          {allowedFeatures.map((item) => (
            <option key={item.id} value={item.id}>
              {item.key}
            </option>
          ))}
        </select>

        <input
          className="rounded-md border bg-background px-3 py-2 text-sm"
          placeholder={
            meta?.valueType === 'BOOLEAN'
              ? 'true or false'
              : meta?.valueType === 'NUMBER'
                ? 'Number'
                : 'Value'
          }
          value={feature.value}
          onChange={(e) =>
            onChange({
              featureId: feature.featureId,
              value: e.target.value,
            })
          }
        />
      </div>

      {meta && (
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>{meta.description}</p>
          <p className="font-medium text-foreground/80">
            Value type: {meta.valueType} (set automatically)
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onRemove}
        className="text-xs font-medium text-red-600 hover:underline"
      >
        Remove feature
      </button>
    </div>
  );
}
