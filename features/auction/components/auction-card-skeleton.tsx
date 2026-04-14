import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function AuctionCardSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        'flex h-full min-w-0 flex-col gap-0 overflow-hidden rounded-2xl border border-border/40 bg-card/80 p-0 py-0 shadow-none',
        'border-l-2 border-l-muted',
        className
      )}
    >
      <Skeleton className="aspect-5/4 w-full rounded-t-2xl rounded-b-none" />
      <CardHeader className="gap-1 space-y-0 px-2.5 pb-0 pt-2">
        <div className="flex gap-1">
          <Skeleton className="h-4 w-14 rounded-full" />
          <Skeleton className="h-4 w-10 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-3.5 w-full max-w-[92%]" />
        <Skeleton className="h-3.5 w-full max-w-[70%]" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-1 px-2.5 pb-2 pt-1">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2 w-24" />
      </CardContent>
      <CardFooter className="mt-auto border-t border-border/35 px-2.5 py-1.5">
        <Skeleton className="h-7 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}
