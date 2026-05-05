import { IAllowedSubscriptionFeatureMetadata } from '@/types/subscription.type';

export function SubscriptionFeaturesView({
  features,
}: {
  features: IAllowedSubscriptionFeatureMetadata[];
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h1 className="text-xl font-semibold">Allowed subscription features</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Admins pick these when building a plan. Value type and description are
        fixed; only the value is set per plan.
      </p>

      <div className="mt-4 space-y-2">
        {features.map((item) => (
          <div key={item.key} className="rounded-md border px-3 py-2 text-sm">
            <div className="font-semibold">{item.key}</div>
            <div className="text-muted-foreground text-xs mt-0.5">
              Type: {item.valueType}
            </div>
            <div className="text-muted-foreground mt-1">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
