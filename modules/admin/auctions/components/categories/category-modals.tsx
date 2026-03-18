'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getErrorMessage } from '@/utils/get-app-error';

export type CategoryParentOption = {
  id: string;
  label: string;
};

export function EditCategoryModal({
  isOpen,
  title = 'Edit category',
  description = 'Update the category name and parent.',
  initialName,
  initialParentId,
  parentOptions,
  disabled,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  title?: string;
  description?: string;
  initialName: string;
  initialParentId: string | null;
  parentOptions: CategoryParentOption[];
  disabled?: boolean;
  onClose: () => void;
  onSave: (input: {
    name: string;
    parentId: string | null;
  }) => Promise<{ success: boolean; error?: string | null }>;
}) {
  const [name, setName] = useState(initialName);
  const [parentId, setParentId] = useState<string | null>(
    initialParentId ?? null
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName(initialName);
    setParentId(initialParentId ?? null);
  }, [isOpen, initialName, initialParentId]);

  const parentValue = parentId ?? '__root__';
  const parentLabel = useMemo(() => {
    if (parentId === null) return 'Root';
    return parentOptions.find((o) => o.id === parentId)?.label ?? 'Unknown';
  }, [parentId, parentOptions]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await onSave({ name: name.trim(), parentId });
      if (!res.success) {
        toast.error(res.error ?? 'Failed to update category');
        return;
      }
      toast.success('Category updated');
      onClose();
    } catch (e: unknown) {
      toast.error(getErrorMessage(e) ?? 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />
          </div>

          <div className="space-y-2">
            <Label>Parent</Label>
            <Select
              value={parentValue}
              onValueChange={(v) => setParentId(v === '__root__' ? null : v)}
              disabled={disabled || saving}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={parentLabel} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__root__">Root</SelectItem>
                {parentOptions.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={disabled || saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RejectReasonModal({
  isOpen,
  title = 'Reject request',
  description = 'Add a reason for rejection. This will be shown to the seller.',
  subjectLabel,
  disabled,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  title?: string;
  description?: string;
  subjectLabel?: string;
  disabled?: boolean;
  onClose: () => void;
  onSubmit: (
    reason: string
  ) => Promise<{ success: boolean; error?: string | null }>;
}) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setReason('');
  }, [isOpen]);

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error('Reject reason is required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await onSubmit(reason.trim());
      if (!res.success) {
        toast.error(res.error ?? 'Failed to reject request');
        return;
      }
      toast.success('Request rejected');
      onClose();
    } catch (e: unknown) {
      toast.error(getErrorMessage(e) ?? 'Failed to reject request');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
            {subjectLabel ? (
              <div className="mt-2 text-xs text-muted-foreground">
                Request: {subjectLabel}
              </div>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Reason</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Type the reason..."
            rows={4}
            disabled={disabled || submitting}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={disabled || submitting}
          >
            {submitting ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
