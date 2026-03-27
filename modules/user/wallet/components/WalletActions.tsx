'use client';

import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function WalletActions() {
  const onAddAmount = () => {
    toast.info('Add amount is a placeholder for now');
  };

  const onWithdrawAmount = () => {
    toast.info('Withdraw amount is a placeholder for now');
  };

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button type="button" onClick={onAddAmount} className="w-full">
          <ArrowDownToLine className="h-4 w-4" />
          Add Amount
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onWithdrawAmount}
          className="w-full"
        >
          <ArrowUpFromLine className="h-4 w-4" />
          Withdraw Amount
        </Button>
      </CardContent>
    </Card>
  );
}
