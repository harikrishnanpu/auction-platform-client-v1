export function InfoGroup({
  icon,
  label,
  value,
  fullWidth,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
  mono?: boolean;
}) {
  return (
    <div
      data-testid="info-group"
      className={`space-y-1 ${fullWidth ? 'col-span-full' : ''}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {icon} {label}
      </div>
      <div
        className={`pl-5 text-[13px] font-medium text-foreground ${mono ? 'inline-block rounded bg-muted/50 px-1.5 py-0.5 font-mono text-xs' : ''}`}
      >
        {value}
      </div>
    </div>
  );
}
