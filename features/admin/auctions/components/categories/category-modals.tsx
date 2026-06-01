'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ADMIN_CATEGORY_MESSAGES } from '@/constants/admin/messages.constants';

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
  name: string;
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
  successMessage = 'Category updated',
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
  successMessage?: string;
}) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <EditCategoryModalForm
        key={`${initialName}-${initialParentId ?? 'root'}`}
        title={title}
        description={description}
        initialName={initialName}
        initialParentId={initialParentId}
        parentOptions={parentOptions}
        disabled={disabled}
        onClose={onClose}
        onSave={onSave}
        successMessage={successMessage}
      />
    </Dialog>
  );
}

function EditCategoryModalForm({
  title,
  description,
  initialName,
  initialParentId,
  parentOptions,
  disabled,
  onClose,
  onSave,
  successMessage,
}: {
  title: string;
  description: string;
  initialName: string;
  initialParentId: string | null;
  parentOptions: CategoryParentOption[];
  disabled?: boolean;
  onClose: () => void;
  onSave: (input: {
    name: string;
    parentId: string | null;
  }) => Promise<{ success: boolean; error?: string | null }>;
  successMessage: string;
}) {
  const [name, setName] = useState(initialName);
  const [parentId, setParentId] = useState<string | null>(
    initialParentId ?? null
  );
  const [saving, setSaving] = useState(false);

  const parentValue = parentId ?? '__root__';
  const parentLabel = useMemo(() => {
    if (parentId === null) return 'Root';
    return parentOptions.find((o) => o.id === parentId)?.name ?? 'Unknown';
  }, [parentId, parentOptions]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(ADMIN_CATEGORY_MESSAGES.NAME_REQUIRED);
      return;
    }
    setSaving(true);
    try {
      const res = await onSave({ name: name.trim(), parentId });
      if (!res.success) {
        toast.error(res.error ?? ADMIN_CATEGORY_MESSAGES.UPDATE_FAILED);
        return;
      }
      toast.success(successMessage);
      onClose();
    } catch (e: unknown) {
      toast.error(getErrorMessage(e) ?? ADMIN_CATEGORY_MESSAGES.UPDATE_FAILED);
    } finally {
      setSaving(false);
    }
  };

  return (
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
                  {o.name}
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
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <RejectReasonModalForm
        key="open"
        title={title}
        description={description}
        subjectLabel={subjectLabel}
        disabled={disabled}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
}

function RejectReasonModalForm({
  title,
  description,
  subjectLabel,
  disabled,
  onClose,
  onSubmit,
}: {
  title: string;
  description: string;
  subjectLabel?: string;
  disabled?: boolean;
  onClose: () => void;
  onSubmit: (
    reason: string
  ) => Promise<{ success: boolean; error?: string | null }>;
}) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error(ADMIN_CATEGORY_MESSAGES.REJECT_REASON_REQUIRED);
      return;
    }
    setSubmitting(true);
    try {
      const res = await onSubmit(reason.trim());
      if (!res.success) {
        toast.error(res.error ?? ADMIN_CATEGORY_MESSAGES.REJECT_FAILED);
        return;
      }
      toast.success(ADMIN_CATEGORY_MESSAGES.REJECTED);
      onClose();
    } catch (e: unknown) {
      toast.error(getErrorMessage(e) ?? ADMIN_CATEGORY_MESSAGES.REJECT_FAILED);
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
  );
}
