export default function SellerAuctionDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-3 py-6 space-y-4">
        <div className="h-6 w-64 rounded bg-muted/40 animate-pulse" />
        <div className="h-24 w-full rounded bg-muted/30 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-24 rounded bg-muted/30 animate-pulse" />
          <div className="h-24 rounded bg-muted/30 animate-pulse" />
          <div className="h-24 rounded bg-muted/30 animate-pulse" />
          <div className="h-24 rounded bg-muted/30 animate-pulse" />
        </div>
        <div className="h-20 w-full rounded bg-muted/30 animate-pulse" />
      </div>
    </div>
  );
}
