import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { DashboardHeader } from '../navbar';

const mockUseUserStore = vi.fn();
const mockRouterReplace = vi.fn();
const mockLogoutAction = vi.fn();
const mockUseNotifications = vi.fn();

vi.mock('@/store/user.store', () => ({
  __esModule: true,
  default: () => mockUseUserStore(),
}));

vi.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}));

vi.mock('@/actions/auth/auth.actions', () => ({
  __esModule: true,
  logoutAction: () => mockLogoutAction(),
}));

vi.mock('@/features/user/notifications/hooks/use-notifications', () => ({
  __esModule: true,
  useNotifications: () => mockUseNotifications(),
}));

describe('navbar (DashboardHeader)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseNotifications.mockReturnValue({
      notifications: [],
      totalCount: 0,
      loading: false,
      error: null,
    });
  });

  it('should render the navbar header and brand text', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    const { getByText } = await render(<DashboardHeader />);
    await expect.element(getByText('HammerDown')).toBeInTheDocument();
  });

  it('should display badge with notification count if totalCount > 0', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
        email: 'john@example.com',
      },
    });

    mockUseNotifications.mockReturnValue({
      notifications: [],
      totalCount: 3,
      loading: false,
      error: null,
    });

    const { getByText } = await render(<DashboardHeader />);
    await expect.element(getByText('3')).toBeInTheDocument();
  });
});
