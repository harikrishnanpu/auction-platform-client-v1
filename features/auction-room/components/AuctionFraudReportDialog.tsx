'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type FraudCategory = 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
type FraudLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';

type AuctionFraudReportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  submitLabel?: string;
  onSubmit: (input: {
    reason: string;
    category: FraudCategory;
    level: FraudLevel;
  }) => Promise<void>;
};

export function AuctionFraudReportDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = 'Submit report',
  onSubmit,
}: AuctionFraudReportDialogProps) {
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState<FraudCategory>('OTHER');
  const [level, setLevel] = useState<FraudLevel>('MEDIUM');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(
    () => reason.trim().length > 0 && !submitting,
    [reason, submitting]
  );

  const reset = () => {
    setReason('');
    setCategory('OTHER');
    setLevel('MEDIUM');
    setSubmitting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as FraudCategory)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OTHER">Other</SelectItem>
                <SelectItem value="AUCTION_FRAUD_CRITICAL">
                  Auction fraud critical
                </SelectItem>
                <SelectItem value="PAYMENT_CRITICAL">
                  Payment critical
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Level</Label>
            <Select
              value={level}
              onValueChange={(value) => setLevel(value as FraudLevel)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Reason</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe what happened"
              className="min-h-24"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={async () => {
              if (!canSubmit) return;
              setSubmitting(true);
              await onSubmit({
                reason: reason.trim(),
                category,
                level,
              });
              handleOpenChange(false);
            }}
            disabled={!canSubmit}
          >
            {submitting ? 'Submitting…' : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
