export default function AuctionDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-3 pb-10 pt-4 sm:px-4 lg:px-6">
        <div className="border-b border-border/40 pb-3">
          <div className="h-6 w-2/3 max-w-sm animate-pulse rounded-md bg-muted/50" />
          <div className="mt-2 flex flex-wrap gap-1">
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted/40" />
            <div className="h-5 w-14 animate-pulse rounded-full bg-muted/40" />
            <div className="h-5 w-12 animate-pulse rounded-full bg-muted/40" />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-5">
          <div className="space-y-3 xl:col-span-7">
            <div className="aspect-video w-full animate-pulse rounded-xl bg-muted/40" />
            <div className="space-y-2 rounded-xl border border-border/40 p-2.5">
              <div className="h-3 w-24 animate-pulse rounded bg-muted/40" />
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-lg bg-muted/30"
                  />
                ))}
              </div>
              <div className="h-16 animate-pulse rounded-lg bg-muted/25" />
            </div>
          </div>
          <div className="space-y-2 xl:col-span-5">
            <div className="h-16 animate-pulse rounded-xl bg-muted/35" />
            <div className="h-36 animate-pulse rounded-xl bg-muted/35" />
            <div className="h-28 animate-pulse rounded-xl bg-muted/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
