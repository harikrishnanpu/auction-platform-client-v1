import { cn } from '@/lib/utils';

type RibbonVariant = 'live' | 'hot' | 'new' | 'sold';

export function Ribbon({
  label,
  variant,
}: {
  label: string;
  variant: RibbonVariant;
}) {
  const colors: Record<RibbonVariant, string> = {
    live: 'bg-red-500 text-white',
    hot: 'bg-orange-500 text-white',
    new: 'bg-blue-600 text-white',
    sold: 'bg-slate-500 text-white',
  };
  return (
    <div
      className={cn(
        'absolute right-[-22px] top-[14px] z-10 w-[90px] rotate-[35deg]',
        'py-[3px] text-center text-[9px] font-bold uppercase tracking-[0.08em]',
        colors[variant]
      )}
    >
      {label}
    </div>
  );
}
