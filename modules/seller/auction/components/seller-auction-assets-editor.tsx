'use client';

import Image from 'next/image';
import { Loader2, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getAuctionAssetUrl } from '@/lib/auction-utils';

export type AuctionAssetEditorStatus = 'idle' | 'uploading' | 'done' | 'error';

export type AuctionAssetEditorItem = {
  id: string;
  file?: File;
  fileKey?: string;
  position: number;
  assetType: 'IMAGE' | 'VIDEO';
  status: AuctionAssetEditorStatus;
  previewUrl?: string;
};

export function SellerAuctionAssetsEditor({
  items,
  onAddFiles,
  onUploadOne,
  onRemoveOne,
  disabled,
}: {
  items: AuctionAssetEditorItem[];
  onAddFiles: (files: FileList | null) => void;
  onUploadOne: (index: number) => void;
  onRemoveOne: (index: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4"
        multiple
        className="hidden"
        id="auction-media"
        onChange={(e) => onAddFiles(e.target.files)}
        disabled={disabled}
      />

      <label
        htmlFor="auction-media"
        className="flex items-center justify-center gap-2 h-12 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Add images or video
        </span>
      </label>

      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => {
          const url = getAuctionAssetUrl(item.fileKey);
          const shouldRenderImage = Boolean(url) && item.assetType !== 'VIDEO';

          return (
            <div
              key={item.id}
              className="relative w-24 h-24 rounded-lg border border-border overflow-hidden bg-muted/30 shrink-0"
            >
              {shouldRenderImage ? (
                <Image
                  src={url}
                  alt="Asset preview"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              ) : url ? (
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted/20">
                  <span className="text-[10px] font-medium text-muted-foreground">
                    Asset
                  </span>
                </div>
              )}

              {item.status === 'uploading' ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              ) : null}

              {item.status === 'error' ? (
                <div className="absolute inset-0 flex items-center justify-center bg-destructive/20 text-destructive text-xs p-1">
                  Error
                </div>
              ) : null}

              {item.status === 'done' && item.fileKey ? (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              ) : null}

              {item.status === 'idle' ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="absolute inset-0 h-full w-full opacity-0 hover:opacity-100 transition-opacity rounded-none"
                  onClick={() => onUploadOne(index)}
                  disabled={disabled}
                >
                  Upload
                </Button>
              ) : null}

              <button
                type="button"
                onClick={() => onRemoveOne(index)}
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                disabled={disabled}
                aria-label="Remove asset"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
