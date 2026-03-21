import { AdminAuctionsSidebar } from '@/modules/admin/auctions/components/auctions-sidebar';
import { AdminAuctionsMobileSidebar } from '@/modules/admin/auctions/components/mobile-sidebar';

export default function AdminAuctionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-0px)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start gap-6">
          <div className="hidden md:block w-64 shrink-0">
            <div className="sticky top-6 rounded-2xl border border-border bg-background/80 backdrop-blur">
              <AdminAuctionsSidebar />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="md:hidden mb-4">
              <AdminAuctionsMobileSidebar />
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
