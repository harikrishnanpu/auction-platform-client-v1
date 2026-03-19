'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AuctionCategory, AuctionCategoryStatus } from '@/types/auction.type';
import {
  AuctionCategoryStatusBadge,
  YesNoBadge,
} from './seller-auction-category-badges';

export function SellerAuctionCategoriesTable({
  rows,
  showRejectedReason = false,
}: {
  rows: AuctionCategory[];
  showRejectedReason?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Active</TableHead>
            {showRejectedReason ? <TableHead>Rejected reason</TableHead> : null}
            <TableHead>Submitted By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-mono text-xs">{r.id}</TableCell>
              <TableCell className="font-medium">{r.name}</TableCell>
              <TableCell className="text-xs font-mono text-muted-foreground">
                {r.slug}
              </TableCell>
              <TableCell>{r.parentId ? 'Child' : 'Root'}</TableCell>
              <TableCell>
                <AuctionCategoryStatusBadge status={r.status} />
              </TableCell>
              <TableCell>
                <YesNoBadge value={r.isVerified} />
              </TableCell>
              <TableCell>
                <YesNoBadge value={r.isActive} />
              </TableCell>
              {showRejectedReason ? (
                <TableCell className="text-sm">
                  {r.status === AuctionCategoryStatus.REJECTED ? (
                    r.rejectionReason || '-'
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              ) : null}
              <TableCell className="text-xs text-muted-foreground">
                {r.submittedBy ?? r.sellerName ?? r.sellerId ?? '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
