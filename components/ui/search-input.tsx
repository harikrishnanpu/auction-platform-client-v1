'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  debounceMs?: number;
  /** Applied to the inner text field (e.g. borderless inside a split control). */
  inputClassName?: string;
}

export function SearchInput({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  className,
  debounceMs = 500,
  inputClassName,
}: SearchInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(
    () => controlledValue ?? ''
  );
  const displayValue = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    const timer = setTimeout(() => onChange(displayValue), debounceMs);
    return () => clearTimeout(timer);
  }, [displayValue, debounceMs, onChange]);

  const handleChange = (next: string) => {
    if (isControlled) onChange(next);
    else setInternalValue(next);
  };

  return (
    <div className={cn('relative flex-1 min-w-0', className)}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        size={15}
      />
      <input
        type="text"
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full h-9 pl-9 pr-9 text-sm bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition',
          inputClassName
        )}
      />
      {displayValue && (
        <button
          type="button"
          onClick={() => handleChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
