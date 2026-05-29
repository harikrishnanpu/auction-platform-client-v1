import { describe, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expect } from 'vitest';
import { UtilityActions } from '../utility-actions';

describe('UtilityActions', () => {
  it('should render the UtilityActions component', async () => {
    const { getByTestId } = await render(<UtilityActions />);
    await expect
      .element(getByTestId('utility-actions-wallet-link'))
      .toHaveTextContent('Wallet');
    await expect
      .element(getByTestId('utility-actions-wallet-link'))
      .toHaveAttribute('href', '/profile/wallet');
    await expect
      .element(getByTestId('utility-actions-plans-link'))
      .toHaveTextContent('Plans');
    await expect
      .element(getByTestId('utility-actions-plans-link'))
      .toHaveAttribute('href', '/profile/subscription');
    await expect
      .element(getByTestId('notification-dropdown'))
      .toBeInTheDocument();
    await expect.element(getByTestId('mode-toggle')).toBeInTheDocument();
    await expect.element(getByTestId('user-dropdown')).toBeInTheDocument();
  });
});
