import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UserDropdown } from '../user-dropdown';
import { AuthProvider } from '@/types/user.type';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

const mockUseUserStore = vi.fn();
const mockGetUserAvatarUrl = vi.fn();

vi.mock('@/store/user.store', () => ({
  __esModule: true,
  default: () => mockUseUserStore(),
}));

vi.mock('@/utils/auction-utils', () => ({
  __esModule: true,
  getUserAvatarUrl: (...args: unknown[]) => mockGetUserAvatarUrl(...args),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

vi.mock('lucide-react', () => ({
  __esModule: true,
  ChevronDown: () => <svg />,
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

    await expect.element(getByText('JO', { exact: true })).toBeInTheDocument();
  });

  it('should render local avatar using getUserAvatarUrl', async () => {
    mockGetUserAvatarUrl.mockReturnValue(
      'https://testingbot.com/free-online-tools/random-avatar/300'
    );

    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
        avatar_url:
          'https://testingbot.com/free-online-tools/random-avatar/300',
        authProvider: AuthProvider.LOCAL,
      },
    });

    const { getByTestId } = await render(<UserDropdown />);

    const image = getByTestId('user-avatar');

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

    await expect
      .element(image)
      .toHaveAttribute('src', 'https://google.com/avatar.jpg');
    expect(mockGetUserAvatarUrl).not.toHaveBeenCalled();
  });

  it('should opens dropdown when button is clicked', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
      },
    });

    const { getByTestId } = await render(<UserDropdown />);

    await userEvent.click(getByTestId('user-dropdown-button'));

    await expect.element(getByTestId('profile-settings-link')).toBeVisible();
    await expect
      .element(getByTestId('utility-actions-wallet-link'))
      .toBeVisible();
  });

  it('should closes dropdown when clicking outside', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
      },
    });

    const { getByTestId } = await render(
      <div>
        <UserDropdown />
        <div data-testid="outside">outside</div>
      </div>
    );

    await userEvent.click(getByTestId('user-dropdown-button'));

    await expect.element(getByTestId('profile-settings-link')).toBeVisible();

    await userEvent.click(getByTestId('outside'));

    await expect
      .element(getByTestId('profile-settings-link'))
      .not.toBeInTheDocument();
  });

  it('should closes dropdown when profile link is clicked', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: 'John Doe',
      },
    });

    const { getByTestId } = await render(<UserDropdown />);

    await userEvent.click(getByTestId('user-dropdown-button'));

    const profileLink = getByTestId('profile-settings-link');

    await userEvent.click(profileLink);

    await expect
      .element(getByTestId('profile-settings-link'))
      .not.toBeInTheDocument();
  });

  it('should falls back to Account when name is missing', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: undefined,
      },
    });

    const { getByTestId } = await render(<UserDropdown />);

    await expect
      .element(getByTestId('user-first-name'))
      .toHaveTextContent('Account');
  });

  it('should falls back to HD initials when name is missing', async () => {
    mockUseUserStore.mockReturnValue({
      user: {
        name: undefined,
        avatar_url: null,
      },
    });

    const { getByText } = await render(<UserDropdown />);

    await expect.element(getByText('HD')).toBeInTheDocument();
  });
});
