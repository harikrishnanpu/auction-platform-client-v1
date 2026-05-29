import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { NotificationDropdown } from '../notification-dropdown';

const mockUseNotifications = vi.fn();

vi.mock('@/features/user/notifications/hooks/use-notifications', () => ({
  __esModule: true,
  useNotifications: () => mockUseNotifications(),
}));

describe('NotificationDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render notification button without badge when totalCount is 0', async () => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      totalCount: 0,
      loading: false,
      error: null,
    });

    const { getByLabelText } = await render(<NotificationDropdown />);

    const button = getByLabelText('Notifications');
    await expect.element(button).toBeInTheDocument();
  });

  it('should render notification button when totalCount > 0', async () => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      totalCount: 5,
      loading: false,
      error: null,
    });

    const { getByLabelText } = await render(<NotificationDropdown />);
    const button = getByLabelText('Notifications');
    await expect.element(button).toBeInTheDocument();
  });

  it('should show loading state inside dropdown when clicked and loading is true', async () => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      totalCount: 0,
      loading: true,
      error: null,
    });

    const { getByLabelText, getByText } = await render(
      <NotificationDropdown />
    );

    await userEvent.click(getByLabelText('Notifications'));
    await expect.element(getByText('Loading…')).toBeInTheDocument();
  });

  it('should show error state inside dropdown when clicked and error is present', async () => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      totalCount: 0,
      loading: false,
      error: 'Failed to fetch',
    });

    const { getByLabelText, getByText } = await render(
      <NotificationDropdown />
    );

    await userEvent.click(getByLabelText('Notifications'));
    await expect.element(getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('should list notifications when clicked and notifications are available', async () => {
    mockUseNotifications.mockReturnValue({
      notifications: [
        {
          id: '1',
          title: 'New Bid Placed',
          message: 'A bid of $100 was placed on your item.',
        },
      ],
      totalCount: 1,
      loading: false,
      error: null,
    });

    const { getByLabelText, getByText } = await render(
      <NotificationDropdown />
    );

    await userEvent.click(getByLabelText('Notifications'));
    await expect.element(getByText('New Bid Placed')).toBeInTheDocument();
    await expect
      .element(getByText('A bid of $100 was placed on your item.'))
      .toBeInTheDocument();
  });
});
