import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { AdminHeader } from '../admin-header';

const APP_BRAND = 'Hammer Down';

describe('AdminHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the AdminHeader component', async () => {
    const { getByTestId } = await render(<AdminHeader />);
    await expect
      .element(getByTestId('admin-header-logo'))
      .toHaveTextContent(APP_BRAND);
    await expect
      .element(getByTestId('admin-header-logo'))
      .toHaveAttribute('href', '/admin/dashboard');
    await expect
      .element(getByTestId('admin-header-mode-toggle'))
      .toBeInTheDocument();
  });
});
