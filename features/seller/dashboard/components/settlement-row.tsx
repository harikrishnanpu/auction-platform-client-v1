import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface SettlementRowProps {
  image: string;
  title: string;
  category: string;
  date: string;
  soldPrice: string;
  fee: string;
  net: string;
  status: string;
  onClick?: () => void;
}

const statusVariant: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
> = {
  Settled: 'default',
  Processing: 'secondary',
  Draft: 'outline',
  Active: 'default',
};

export function SettlementRow({
  image,
  title,
  category,
  date,
  soldPrice,
  fee,
  net,
  status,
  onClick,
}: SettlementRowProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'p-5 hover:bg-muted/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4 group cursor-pointer border-b border-border last:border-0',
        onClick && 'cursor-pointer'
      )}
    >
      <div className="h-16 w-16 bg-muted rounded-xl shrink-0 overflow-hidden relative shadow-sm">
        <Image
          src={image}
          width={64}
          height={64}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="grow w-full min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
            {title}
          </h4>
          <Badge
            variant={statusVariant[status] ?? 'secondary'}
            className="shrink-0"
          >
            {status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {category} • Sold on {date}
        </p>

        <div className="grid grid-cols-3 gap-2 text-xs bg-muted/50 rounded-lg p-2 border">
          <div className="flex flex-col">
            <span className="uppercase tracking-wider text-[10px] text-muted-foreground">
              Sold
            </span>
            <span className="font-semibold">{soldPrice}</span>
          </div>
          <div className="flex flex-col border-l border-border pl-2">
            <span className="uppercase tracking-wider text-[10px] text-muted-foreground">
              Fee
            </span>
            <span className="font-semibold text-destructive">{fee}</span>
          </div>
          <div className="flex flex-col border-l border-border pl-2">
            <span className="uppercase tracking-wider text-[10px] text-muted-foreground">
              Net
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {net}
            </span>
          </div>
        </div>
      </div>

      {onClick && (
        <div className="hidden sm:block text-muted-foreground group-hover:text-primary transition-colors shrink-0">
          <ChevronRight size={20} />
        </div>
      )}
    </div>
  );
}
