'use client';

export function PaymentDueDate({ dueAt }: { dueAt: string }) {
  const d = new Date(dueAt);
  if (Number.isNaN(d.getTime())) {
    return <p className="text-xs text-muted-foreground">Due: —</p>;
  }

  return (
    <p className="text-xs text-muted-foreground">
      Due:{' '}
      <span className="font-medium text-foreground">
        {d.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </span>
    </p>
  );
}
