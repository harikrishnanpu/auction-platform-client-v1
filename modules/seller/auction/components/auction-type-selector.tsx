'use client';

import { Clock, Video, Lock } from 'lucide-react';
import type { AuctionType } from '@/types/auction.type';
import { getAuctionTypeLabel } from '@/lib/auction-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TYPES: {
  value: AuctionType;
  label: string;
  description: string;
  icon: typeof Clock;
}[] = [
  {
    value: 'LONG',
    label: 'Long',
    description: 'Multi-day auction with extended bidding period.',
    icon: Clock,
  },
  {
    value: 'LIVE',
    label: 'Live',
    description: 'Real-time auction with live bidding.',
    icon: Video,
  },
  {
    value: 'SEALED',
    label: 'Sealed',
    description: 'Sealed-bid auction. Bids are hidden until end.',
    icon: Lock,
  },
];

export interface AuctionTypeSelectorProps {
  onSelect: (type: AuctionType) => void;
}

export function AuctionTypeSelector({ onSelect }: AuctionTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
          Choose auction type
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select the type of auction you want to create.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TYPES.map(({ value, label, description, icon: Icon }) => (
          <Card
            key={value}
            className="cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:shadow-md"
            onClick={() => onSelect(value)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{description}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full"
              >
                Create {label} auction
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
