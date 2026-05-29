import { describe, expect, it, vi } from 'vitest';
import {
  useAuctionRoomMenu,
  SellerRoomMenuProvider,
  useSellerRoomMenu,
} from '../auction-room-menu-context';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

function SellerTestComponent() {
  const onMenuOpen = useSellerRoomMenu();
  return (
    <button onClick={onMenuOpen ?? undefined} data-testid="seller-trigger-btn">
      Seller Trigger
    </button>
  );
}

describe('AuctionRoomMenuContext', () => {
  it('should provide onMenuOpen callback through useAuctionRoomMenu hook', async () => {
    const onMenuOpenMock = vi.fn();

    const { getByTestId } = await render(
      <SellerRoomMenuProvider onMenuOpen={onMenuOpenMock}>
        <SellerTestComponent />
      </SellerRoomMenuProvider>
    );

    const button = getByTestId('seller-trigger-btn');
    await userEvent.click(button);

    expect(onMenuOpenMock).toHaveBeenCalledTimes(1);
  });

  it('should return null when consumed outside of Provider', async () => {
    function ComponentOutside() {
      const value = useAuctionRoomMenu();
      return (
        <span data-testid="value-span">
          {value === null ? 'null' : 'exists'}
        </span>
      );
    }

    const { getByTestId } = await render(<ComponentOutside />);
    await expect.element(getByTestId('value-span')).toHaveTextContent('null');
  });
});
