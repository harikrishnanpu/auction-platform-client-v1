import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function AuctionCardSkeleton({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Card
      className={cn(
        'flex h-full min-w-0 flex-col gap-0 overflow-hidden border border-border/50 bg-card p-0 py-0 shadow-none',
        compact ? 'rounded-md' : 'rounded-2xl border-l-2 border-l-muted',
        className
      )}
    >
      <Skeleton
        className={cn(
          'w-full rounded-b-none',
          compact ? 'aspect-4/3 rounded-t-md' : 'aspect-5/4 rounded-t-2xl'
        )}
      />
      <CardHeader
        className={cn('gap-1 space-y-0 pb-0 pt-2', compact ? 'px-2' : 'px-2.5')}
      >
        <div className="flex gap-1">
          <Skeleton
            className={cn('rounded-full', compact ? 'h-3 w-10' : 'h-4 w-14')}
          />
          <Skeleton
            className={cn('rounded-full', compact ? 'h-3 w-8' : 'h-4 w-10')}
          />
        </div>
        <Skeleton
          className={cn('w-full max-w-[92%]', compact ? 'h-3' : 'h-3.5')}
        />
        <Skeleton
          className={cn('max-w-[70%]', compact ? 'h-3 w-full' : 'h-3.5 w-full')}
        />
      </CardHeader>
      <CardContent
        className={cn(
          'flex flex-1 flex-col gap-1 pb-2 pt-1',
          compact ? 'px-2' : 'px-2.5'
        )}
      >
        <Skeleton className={cn('w-full', compact ? 'h-2' : 'h-2.5')} />
        <Skeleton className={cn('w-full', compact ? 'h-2' : 'h-2.5')} />
      </CardContent>
      <CardFooter
        className={cn(
          'mt-auto border-t border-border/35 py-1.5',
          compact ? 'px-2' : 'px-2.5'
        )}
      >
        <Skeleton className="h-7 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
