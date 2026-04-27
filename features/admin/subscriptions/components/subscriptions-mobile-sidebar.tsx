'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AdminSubscriptionsSidebar } from './subscriptions-sidebar';

export function AdminSubscriptionsMobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2">
          <Menu className="size-4" />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b">
          <SheetTitle>Subscriptions</SheetTitle>
        </SheetHeader>
        <AdminSubscriptionsSidebar onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
