import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import AuthNavbar from '../AuthNavbar';
import { APP_BRAND } from '../../config/app-nav';
import { userEvent } from 'vitest/browser';

describe('AuthNavbar', () => {
  it('should render the brand logo and Back to Home link', async () => {
    const { getByText, getByTestId } = await render(<AuthNavbar />);
    await expect
      .element(getByTestId('auth-navbar-back-to-home'))
      .toBeInTheDocument();
    await expect.element(getByText(APP_BRAND)).toBeInTheDocument();
    await userEvent.click(getByTestId('auth-navbar-back-to-home'));
  });
});
