// UserDropdown.test.tsx

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UserDropdown } from '../user-dropdown';
import { AuthProvider } from '@/types/user.type';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

const mockUseUserStore = vi.fn();
const mockGetUserAvatarUrl = vi.fn();

vi.mock('@/store/user.store', () => ({
  _esModule: true,
  default: () => mockUseUserStore(),
}));

vi.mock('@/utils/auction-utils', () => ({
  _esModule: true,
  getUserAvatarUrl: (...args: unknown[]) => mockGetUserAvatarUrl(...args),
}));

describe('UserDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when user is null', async () => {
    mockUseUserStore.mockReturnValue({
      user: null,
    });

    const { container } = await render(<UserDropdown />);
    await expect(container.firstChild).toBeNull();
  });

  it('should render first name', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
      },
    });

    const { getByText } = await render(<UserDropdown />);

    await expect.element(getByText('John')).toBeInTheDocument();
  });

  it('should render initials when avatar_url is missing', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
        avatar_url: null,
      },
    });

    const { getByText } = await render(<UserDropdown />);

    await expect.element(getByText('JO')).toBeInTheDocument();
  });

  it('should render local avatar using getUserAvatarUrl', async () => {
    mockGetUserAvatarUrl.mockReturnValue(
      'https://testingbot.com/free-online-tools/random-avatar/300'
    );

    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
        avatar_url: 'avatar.jpg',
        authProvider: AuthProvider.LOCAL,
      },
    });

    const { getByRole } = await render(<UserDropdown />);

    const image = getByRole('img');

    await expect(mockGetUserAvatarUrl).toHaveBeenCalledWith(
      'https://testingbot.com/free-online-tools/random-avatar/300'
    );
    await expect
      .element(image)
      .toHaveAttribute(
        'src',
        'https://testingbot.com/free-online-tools/random-avatar/300'
      );
  });

  it('should render external avatar for non-local provider', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
        avatar_url: 'https://google.com/avatar.jpg',
        authProvider: AuthProvider.GOOGLE,
      },
    });

    const { getByTestId } = await render(<UserDropdown />);

    const image = getByTestId('user-avatar');

    expect(image).toHaveAttribute('src', 'https://google.com/avatar.jpg');
    expect(mockGetUserAvatarUrl).not.toHaveBeenCalled();
  });

  it('opens dropdown when button is clicked', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
      },
    });

    const { getByTestId } = await render(<UserDropdown />);

    await userEvent.click(getByTestId('user-dropdown-button'));

    await expect
      .element(getByTestId('profile-settings-link'))
      .toBeInTheDocument();
    await expect
      .element(getByTestId('utility-actions-wallet-link'))
      .toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
      },
    });

    const { getByTestId, queryByTestId } = await render(
      <div>
        <UserDropdown />
        <div data-testid="outside">outside</div>
      </div>
    );

    await userEvent.click(getByTestId('user-dropdown-button'));

    await expect
      .element(getByTestId('profile-settings-link'))
      .toBeInTheDocument();

    await userEvent.click(getByTestId('outside'));

    await expect.element(queryByTestId('profile-settings-link')).toBeNull();
  });

  it('closes dropdown when profile link is clicked', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
      },
    });

    const { getByTestId, queryByTestId } = await render(<UserDropdown />);

    await userEvent.click(getByTestId('user-dropdown-button'));

    const profileLink = getByTestId('profile-settings-link');

    await userEvent.click(profileLink);

    await expect
      .element(queryByTestId('profile-settings-link'))
      .not.toBeInTheDocument();
  });

  it('should falls back to Account when name is missing', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: '',
      },
    });

    const { getByText } = await render(<UserDropdown />);

    await expect.element(getByText('Account')).toBeInTheDocument();
  });

  it('should falls back to HD initials when name is missing', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: '',
        avatar_url: null,
      },
    });

    const { getByText } = await render(<UserDropdown />);

    await expect.element(getByText('HD')).toBeInTheDocument();
  });
});
