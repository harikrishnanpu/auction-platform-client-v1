import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { PlaceBidButton } from './place-bid-button';

describe('PlaceBidButton', () => {
  it("should render with 'Place bid' label by default in idle state", async () => {
    const { getByRole } = await render(
      <PlaceBidButton cooldownRemainingSeconds={0} disabled={false} />
    );
    await expect
      .element(getByRole('button', { name: 'Place bid' }))
      .toBeInTheDocument();
  });

  it("should render with 'Wait 10s' label when in cooldown state", async () => {
    const { getByRole } = await render(
      <PlaceBidButton cooldownRemainingSeconds={10} disabled={false} />
    );
    await expect
      .element(getByRole('button', { name: 'Wait 10s' }))
      .toBeInTheDocument();
  });

  it("should render with 'Placing bid…' label when in pending state", async () => {
    const { getByRole } = await render(
      <PlaceBidButton
        cooldownRemainingSeconds={0}
        disabled={false}
        pending={true}
      />
    );
    await expect
      .element(getByRole('button', { name: 'Placing bid…' }))
      .toBeInTheDocument();
  });
});
