'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  label: string;
  placeholder?: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  className?: string;
  icon?: React.ReactNode;
}

export function FilterSelect({
  label,
  placeholder = 'All',
  value,
  options,
  onChange,
  className,
  icon,
}: FilterSelectProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        {icon && <span className="opacity-70">{icon}</span>}
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-9 text-sm bg-background border-input rounded-lg focus:ring-1 focus:ring-ring">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
