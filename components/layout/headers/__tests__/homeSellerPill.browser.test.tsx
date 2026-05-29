import { describe, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { expect } from 'vitest';
import { HomeSellerPill } from '../home-seller-pill';

describe('HomeSellerPill', () => {
  it('should render the HomeSellerPill component with seller link', async () => {
    const { getByTestId } = await render(<HomeSellerPill isSeller={true} />);
    const sellerLink = getByTestId('home-seller-pill-seller');
    await expect
      .element(getByTestId('home-seller-pill-seller'))
      .toHaveTextContent('Seller');
    await expect
      .element(sellerLink)
      .toHaveAttribute('href', '/seller/dashboard');
  });

  it('should render the HomeSellerPill component with home link', async () => {
    const { getByTestId } = await render(<HomeSellerPill isSeller={false} />);
    const homeLink = getByTestId('home-seller-pill-home');
    await expect
      .element(getByTestId('home-seller-pill-home'))
      .toHaveTextContent('Home');
    await expect.element(homeLink).toHaveAttribute('href', '/home');
  });
});
