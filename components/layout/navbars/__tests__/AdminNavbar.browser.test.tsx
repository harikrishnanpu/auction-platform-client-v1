import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { AdminNavbar } from '../AdminNavbar';

const mockUseUserStore = vi.fn();
const mockRouterReplace = vi.fn();
const mockLogoutAction = vi.fn();

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

describe('AdminNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the AdminNavbar brand and logo link', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'Admin User',
        avatar_url: 'http://avatar.jpg',
        roles: ['ADMIN'],
      },
    });

    const { getByText } = await render(<AdminNavbar />);
    await expect.element(getByText('HammerDown')).toBeInTheDocument();
    await expect.element(getByText('Admin')).toBeInTheDocument();
  });

  it('should open administration dropdown on clicking the user avatar button', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'Admin User',
        avatar_url: 'http://avatar.jpg',
        roles: ['ADMIN'],
      },
      setUser: vi.fn(),
    });

    const { getByRole, getByText } = await render(<AdminNavbar />);
    const avatarButton = getByRole('button', { name: /Admin/i });
    await userEvent.click(avatarButton);

    await expect
      .element(getByText('Administrator').first())
      .toBeInTheDocument();
    await expect.element(getByText('Logout Session')).toBeInTheDocument();
  });
});
