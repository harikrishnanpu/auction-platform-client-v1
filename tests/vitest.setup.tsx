import '@testing-library/jest-dom';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { vi } from 'vitest';

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    onClick,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children?: ReactNode;
  }) => (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick(e);
      }}
      {...props}
    >
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));
