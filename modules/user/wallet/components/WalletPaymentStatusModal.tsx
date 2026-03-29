'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type WalletPaymentStatusModalProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
};

export function WalletPaymentStatusModal({
  open,
  title,
  description,
  onClose,
}: WalletPaymentStatusModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
