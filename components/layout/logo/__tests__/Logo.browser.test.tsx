import { render, screen } from '@testing-library/react';
import { Logo } from '../Logo';
import { describe, expect, it } from 'vitest';

const APP_BRAND = 'Hammer Down';

describe('Logo', () => {
  it('should renders brand name and routes to home page', async () => {
    render(<Logo />);

    await expect.element(screen.getByText(APP_BRAND)).toBeInTheDocument();
    await expect.element(screen.getByText('H')).toBeInTheDocument();

    const link = screen.getByRole('link');
    await expect.element(link).toHaveAttribute('href', '/');
  });
});
