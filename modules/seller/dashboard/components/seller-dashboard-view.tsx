import type { ReactNode } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Gavel, Layers, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DUMMY_STATS = {
  total: 1,
  drafts: 1,
  published: 0,
};

const DUMMY_ROWS = [
  { id: '—', title: '—', status: '—', updated: '—' },
  { id: '—', title: '—', status: '—', updated: '—' },
  { id: '—', title: '—', status: '—', updated: '—' },
];

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-lg bg-muted p-2">
              {icon}
            </span>
            <CardTitle className="text-base">{label}</CardTitle>
          </div>
          <Badge variant="outline">{value}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function SellerDashboardView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold font-serif text-foreground leading-tight">
            Seller Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your auctions and track their status.
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/seller/auction/categories">
              <Layers className="size-4" />
              Categories
            </Link>
          </Button>
          <Button asChild className="rounded-xl">
            <Link href="/seller/auction/create">
              <Plus className="size-4" />
              Create Auction
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Gavel className="size-4" />}
          label="Total auctions"
          value={DUMMY_STATS.total}
          description="All auctions created by you."
        />
        <StatCard
          icon={<Clock className="size-4" />}
          label="Drafts"
          value={DUMMY_STATS.drafts}
          description="Auctions saved but not published."
        />
        <StatCard
          icon={<CheckCircle2 className="size-4" />}
          label="Published"
          value={DUMMY_STATS.published}
          description="Auctions visible to buyers."
        />
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg">Auction Listing</CardTitle>
            <CardDescription>
              Your auctions will appear here. This section is being rebuilt.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-muted">
            Coming soon
          </Badge>
        </CardHeader>
        <div className="h-px w-full bg-border" />
        <CardContent className="pt-5 space-y-4">
          <div className="rounded-xl border border-dashed border-border bg-background/50 p-4 text-center">
            <div className="font-semibold text-foreground">
              Auction listing coming soon.
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              For now, use “Create Auction” to start a draft.
            </div>
          </div>

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
                {DUMMY_ROWS.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">
                      {row.id}
                    </TableCell>
                    <TableCell className="text-sm">{row.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">—</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.updated}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
