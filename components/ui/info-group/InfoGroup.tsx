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
    <div className={`space-y-1 ${fullWidth ? 'col-span-full' : ''}`}>
      <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
        {icon} {label}
      </div>
      <div
        className={`text-base font-medium text-foreground pl-6 ${mono ? 'font-mono text-sm bg-muted/50 inline-block px-1.5 py-0.5 rounded' : ''}`}
      >
        {value}
      </div>
    </div>
  );
}
