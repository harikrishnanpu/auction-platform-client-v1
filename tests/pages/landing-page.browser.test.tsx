import { describe, expect, it } from 'vitest';
import LandingPage from '@/app/(public)/(landing)/page';
import { render } from 'vitest-browser-react';

describe('Landing Home Page & MSW Integration', () => {
  it('should render the static Landing Page correctly', async () => {
    const { getByText } = await render(<LandingPage />);

    await expect
      .element(getByText(/Next-Gen Live Bidding Infrastructure/i))
      .toBeInTheDocument();
    await expect.element(getByText(/Bidding Reimagined/i)).toBeInTheDocument();
    await expect.element(getByText(/For the Future./i)).toBeInTheDocument();
    await expect
      .element(getByText(/Trusted by 500\+ Premium Auction Houses/i))
      .toBeInTheDocument();
  });
});
