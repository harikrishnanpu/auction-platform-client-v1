'use client';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type AuctionIrreversibleConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  /** What will happen (shown below the irreversible warning). */
  actionDescription: string;
  confirmLabel: string;
  confirmVariant?: 'default' | 'destructive';
  pending?: boolean;
  /** Return true to close the dialog; false keeps it open (e.g. on failure). */
  onConfirm: () => Promise<boolean>;
};

export function AuctionIrreversibleConfirmDialog({
  open,
  onOpenChange,
  title = 'Are you sure?',
  actionDescription,
  confirmLabel,
  confirmVariant = 'destructive',
  pending = false,
  onConfirm,
}: AuctionIrreversibleConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && pending) return;
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="gap-3 p-4 sm:max-w-md"
        showCloseButton={!pending}
      >
        <DialogHeader className="gap-2 text-left">
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 text-left text-sm text-muted-foreground">
              <p className="flex gap-2 rounded-md border border-amber-500/25 bg-amber-500/10 px-2.5 py-2 text-xs text-amber-950 dark:text-amber-100">
                <AlertTriangle
                  className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400"
                  aria-hidden
                />
                <span>
                  This action is{' '}
                  <strong className="font-semibold">irreversible</strong>. You
                  cannot undo it afterwards.
                </span>
              </p>
              <p className="text-foreground/90">{actionDescription}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            variant={confirmVariant}
            className="h-8"
            disabled={pending}
            onClick={async () => {
              const ok = await onConfirm();
              if (ok) onOpenChange(false);
            }}
          >
            {pending ? 'Please wait…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
