import { render } from 'vitest-browser-react';
import { ComingSoon } from './coming-soon';
import { describe, expect, it } from 'vitest';

describe('ComingSoon', () => {
  it('should renders with default props correctly', async () => {
    const { getByText, getByRole } = await render(<ComingSoon />);
    await expect.element(getByText('Coming soon')).toBeInTheDocument();
    await expect
      .element(getByText('This section is being rebuilt.'))
      .toBeInTheDocument();

    const link = getByRole('link', { name: /go back/i });
    await expect.element(link).toBeInTheDocument();
    await expect.element(link).toHaveAttribute('href', '/');
  });

  it('should renders with custom props correctly', async () => {
    const { getByText, getByRole } = await render(
      <ComingSoon
        title="Under Construction"
        description="We are working hard to build this page."
        homeHref="/dashboard"
      />
    );
    await expect.element(getByText('Under Construction')).toBeInTheDocument();
    await expect
      .element(getByText('We are working hard to build this page.'))
      .toBeInTheDocument();

    const link = getByRole('link', { name: /go back/i });
    await expect.element(link).toBeInTheDocument();
    await expect.element(link).toHaveAttribute('href', '/dashboard');
  });
});
