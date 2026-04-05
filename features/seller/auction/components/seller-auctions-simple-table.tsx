import type { IAuctionDto } from '@/types/auction.type';
import { auctionStatusLabel } from '@/utils/auction-utils';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function formatDate(value: unknown): string {
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function SellerAuctionsSimpleTable({
  auctions,
  limit,
}: {
  auctions: IAuctionDto[];
  limit?: number;
}) {
  const sorted = [...(auctions ?? [])].sort((a, b) => {
    const aTime = new Date(String(a.startAt)).getTime();
    const bTime = new Date(String(b.startAt)).getTime();
    return (
      (Number.isFinite(bTime) ? bTime : 0) -
      (Number.isFinite(aTime) ? aTime : 0)
    );
  });

  const rows = typeof limit === 'number' ? sorted.slice(0, limit) : sorted;

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background/50 p-6 text-center">
        <div className="font-semibold text-foreground">No auctions yet</div>
        <div className="text-sm text-muted-foreground mt-1">
          Create your first auction to start selling.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[120px]">Auction ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[160px]">Status</TableHead>
            <TableHead className="w-[160px]">Last updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-mono text-xs">{a.id}</TableCell>
              <TableCell className="text-sm font-medium">{a.title}</TableCell>
              <TableCell>
                <Badge
                  variant={a.status === 'PUBLISHED' ? 'secondary' : 'outline'}
                >
                  {auctionStatusLabel(a.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDate(a.endAt ?? a.startAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
