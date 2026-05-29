import { describe, expect, it, vi } from 'vitest';
import {
  SellerRoomMenuProvider,
  useSellerRoomMenu,
} from '../seller-room-menu-context';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

function TestComponent() {
  const onMenuOpen = useSellerRoomMenu();
  return (
    <button onClick={onMenuOpen ?? undefined} data-testid="trigger-btn">
      Trigger
    </button>
  );
}

describe('SellerRoomMenuContext', () => {
  it('should provides onMenuOpen callback through useSellerRoomMenu hook', async () => {
    const onMenuOpenMock = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    const { getByTestId } = await render(
      <SellerRoomMenuProvider onMenuOpen={onMenuOpenMock}>
        <TestComponent />
      </SellerRoomMenuProvider>
    );

    const button = getByTestId('trigger-btn');
    await userEvent.click(button);

    expect(onMenuOpenMock).toHaveBeenCalledTimes(1);
  });

  it('should return null when consumed outside of Provider', async () => {
    function ComponentOutside() {
      const value = useSellerRoomMenu();
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
