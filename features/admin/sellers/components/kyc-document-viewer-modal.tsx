'use client';

import { useMemo } from 'react';
import { ExternalLink, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IKycDocumentResponseDto } from '@/types/kyc.type';
import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';

function labelForDoc(doc: IKycDocumentResponseDto) {
  const type = String(doc.documentType).replace(/_/g, ' ');
  const side = doc.side ? ` (${doc.side})` : '';
  return `${type}${side}`;
}

export function KycDocumentViewerModal({
  isOpen,
  doc,
  onClose,
}: {
  isOpen: boolean;
  doc: IKycDocumentResponseDto | null;
  onClose: () => void;
}) {
  const title = useMemo(() => (doc ? labelForDoc(doc) : 'KYC document'), [doc]);
  const src = useMemo(
    () => buildApiUrl(API_ENDPOINTS.admin.viewKycDocument(doc?.id ?? '')),
    [doc]
  );

  if (!isOpen || !doc) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[calc(100%-2rem)] h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-3">
          <div className="flex items-start justify-between gap-3 mt-5">
            <div className="min-w-0">
              <DialogTitle className="flex items-center gap-2">
                <FileText className="size-5 text-muted-foreground" />
                <span className="truncate">{title}</span>
              </DialogTitle>
              <DialogDescription className="mt-1">
                Loaded securely via admin session.
              </DialogDescription>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2 shrink-0"
            >
              <a href={src} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" />
                Open
              </a>
            </Button>
          </div>
        </DialogHeader>

        <div className="h-[calc(80vh-92px)] border-t border-border bg-black/5 dark:bg-white/5">
          <iframe
            key={doc.id}
            src={src}
            title={title}
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
