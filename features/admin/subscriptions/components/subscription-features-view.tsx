export function SubscriptionFeaturesView({
  featureKeys,
}: {
  featureKeys: string[];
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h1 className="text-xl font-semibold">Subscription feature keys</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Use these keys while creating subscription plans.
      </p>

      <div className="mt-4 space-y-2">
        {featureKeys.map((key) => (
          <div
            key={key}
            className="rounded-md border px-3 py-2 text-sm font-medium"
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
}
