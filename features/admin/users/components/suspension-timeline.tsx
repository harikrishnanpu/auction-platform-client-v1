import { ISuspensionTimelineItem } from '@/types/fraud-report.type';

export function SuspensionTimeline({
  items,
}: {
  items: ISuspensionTimelineItem[];
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        No suspension timeline.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{item.type}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(item.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm mt-1">{item.reason}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Start: {new Date(item.startsAt).toLocaleString()} | End:{' '}
            {item.endsAt ? new Date(item.endsAt).toLocaleString() : 'Permanent'}
          </p>
        </div>
      ))}
    </div>
  );
}
