'use client';

import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { AuctionCategory } from '@/types/auction.type';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CategoryOption = {
  value: string;
  label: string;
};

type CategoryGroup = {
  id: string;
  name: string;
  children: CategoryOption[];
};

export function SellerCategorySelect({
  id,
  value,
  onChange,
  categories,
  placeholder = 'Select category',
  disabled,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  categories: AuctionCategory[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeRootId, setActiveRootId] = useState<string | null>(null);

  const groupedOptions = useMemo(() => {
    const verified = categories.filter((c) => c.isVerified && c.isActive);
    const byParent = new Map<string, AuctionCategory[]>();

    verified.forEach((c) => {
      const parentKey = c.parentId ?? 'ROOT';
      const list = byParent.get(parentKey) ?? [];
      list.push(c);
      byParent.set(parentKey, list);
    });

    const roots = (byParent.get('ROOT') ?? []).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const groups: CategoryGroup[] = roots.map((root) => {
      const children = (byParent.get(root.id) ?? [])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((child) => ({
          value: child.id,
          label: child.name,
        }));

      return {
        id: root.id,
        name: root.name,
        children,
      };
    });

    return groups;
  }, [categories]);

  const selectedLabel = useMemo(() => {
    for (const root of groupedOptions) {
      const hit = root.children.find((child) => child.value === value);
      if (hit) return hit.label;
    }
    return '';
  }, [groupedOptions, value]);

  const hasSelectableChildren = groupedOptions.some(
    (g) => g.children.length > 0
  );
  const activeRoot = groupedOptions.find((g) => g.id === activeRootId) ?? null;

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!wrapperRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div ref={wrapperRef} className="space-y-1 relative">
      <Button
        id={id}
        type="button"
        variant="outline"
        disabled={disabled || !hasSelectableChildren}
        onClick={() => {
          setOpen((prev) => {
            const next = !prev;
            if (next && !activeRootId) {
              const selectedRoot = groupedOptions.find((g) =>
                g.children.some((child) => child.value === value)
              );
              if (selectedRoot?.id) {
                setActiveRootId(selectedRoot.id);
              } else {
                const firstRootWithChildren = groupedOptions.find(
                  (g) => g.children.length > 0
                );
                if (firstRootWithChildren)
                  setActiveRootId(firstRootWithChildren.id);
              }
            }
            return next;
          });
        }}
        className="mt-1 h-12 w-full justify-between font-normal"
      >
        <span
          className={cn(
            'truncate',
            selectedLabel ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {selectedLabel ||
            (hasSelectableChildren
              ? placeholder
              : 'No child categories available')}
        </span>
        <ChevronDown className="h-4 w-4 opacity-60" />
      </Button>

      {open && hasSelectableChildren ? (
        <div className="absolute left-0 top-[calc(100%+0.4rem)] z-50">
          <div className="flex rounded-md border border-border bg-popover text-popover-foreground shadow-md overflow-hidden min-w-[520px]">
            <div className="w-64 border-r border-border max-h-72 overflow-y-auto">
              {groupedOptions.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onMouseEnter={() => setActiveRootId(group.id)}
                  onFocus={() => setActiveRootId(group.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-left text-sm',
                    activeRootId === group.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/70'
                  )}
                >
                  <span className="truncate">{group.name}</span>
                  <ChevronRight className="h-4 w-4 opacity-60" />
                </button>
              ))}
            </div>

            <div className="w-64 max-h-72 overflow-y-auto p-1">
              <div className="px-2 py-1 text-xs text-muted-foreground">
                Child categories
              </div>
              {activeRoot?.children.length ? (
                activeRoot.children.map((child) => (
                  <button
                    key={`${activeRoot.id}-${child.value}`}
                    type="button"
                    onClick={() => {
                      onChange(child.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'w-full rounded-sm px-2 py-2 text-left text-sm hover:bg-accent',
                      value === child.value
                        ? 'bg-accent text-accent-foreground'
                        : ''
                    )}
                  >
                    {child.label}
                  </button>
                ))
              ) : (
                <div className="px-2 py-2 text-sm text-muted-foreground">
                  No child categories
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <p className="text-[11px] text-muted-foreground">
        Only child categories can be selected. Root categories are shown as
        group labels.
      </p>
      <div className="flex items-center justify-between gap-3">
        {error ? <p className="text-destructive text-xs">{error}</p> : <span />}
        <Link
          href="/seller/auction/categories"
          className="text-xs font-semibold text-primary hover:underline"
        >
          Request a new category
        </Link>
      </div>
    </div>
  );
}
