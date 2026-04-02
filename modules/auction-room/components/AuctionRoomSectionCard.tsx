'use client';

import type { ReactNode } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type AuctionRoomSectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AuctionRoomSectionCard({
  title,
  description,
  children,
}: AuctionRoomSectionCardProps) {
  return (
    <Card className="rounded-lg border-border/60 bg-card/70 shadow-sm">
      <CardHeader className="px-3 py-2 pb-1">
        <CardTitle className="text-xs font-semibold">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-[10px] leading-tight">
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2 px-3 pb-3">{children}</CardContent>
    </Card>
  );
}
