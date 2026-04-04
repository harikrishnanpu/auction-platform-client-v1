export default function SellerAuctionsDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-4 px-3 py-6">
        <div className="h-6 w-64 animate-pulse rounded bg-muted/40" />
        <div className="h-24 w-full animate-pulse rounded bg-muted/30" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-24 animate-pulse rounded bg-muted/30" />
          <div className="h-24 animate-pulse rounded bg-muted/30" />
          <div className="h-24 animate-pulse rounded bg-muted/30" />
          <div className="h-24 animate-pulse rounded bg-muted/30" />
        </div>
        <div className="h-20 w-full animate-pulse rounded bg-muted/30" />
      </div>
    </div>
  );
}
