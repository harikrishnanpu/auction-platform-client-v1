import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { DashboardHeader } from '../dashboard-header';

vi.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: () => '/home',
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

vi.mock('@/store/user.store', () => ({
  __esModule: true,
  default: () => ({
    user: {
      name: 'John Doe',
    },
  }),
}));

vi.mock('../contexts/auction-room-menu-context', () => ({
  __esModule: true,
  useAuctionRoomMenu: () => vi.fn(),
}));

vi.mock('../notification-dropdown', () => ({
  __esModule: true,
  NotificationDropdown: () => (
    <div data-testid="notification-dropdown">Notifications</div>
  ),
}));

describe('DashboardHeader', () => {
  it('should render the DashboardHeader component', async () => {
    const { getByTestId } = await render(
      <DashboardHeader title="Test Title" subtitle="Test Subtitle" />
    );
    await expect
      .element(getByTestId('dashboard-header-mobile-layout'))
      .toBeInTheDocument();
    await expect
      .element(getByTestId('dashboard-header-desktop-layout'))
      .toBeInTheDocument();
  });
});
