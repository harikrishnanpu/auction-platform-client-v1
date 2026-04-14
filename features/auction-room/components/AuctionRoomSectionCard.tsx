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
    <Card className="rounded-xl border-border/50 bg-card/30 shadow-none">
      <CardHeader className="space-y-0 px-2.5 py-1.5 pb-0">
        <CardTitle className="text-[10px] font-semibold">{title}</CardTitle>
        {description ? (
          <CardDescription className="text-[9px] leading-snug">
            {description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-1.5 px-2.5 pb-2 pt-1">
        {children}
      </CardContent>
    </Card>
  );
}
