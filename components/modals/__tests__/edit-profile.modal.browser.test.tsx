import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { EditProfileModal } from '../edit-profile.modal';
import { AuthProvider, UserInfo } from '@/types/user.type';

vi.mock('@/actions/user/profile.actions', () => ({
  __esModule: true,
  editProfileAction: vi.fn(),
  editProfileSendOtpAction: vi.fn(),
}));

vi.mock('sonner', () => ({
  __esModule: true,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('EditProfileModal', () => {
  const dummyUser: UserInfo = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    avatar_url: null,
    authProvider: AuthProvider.LOCAL,
    roles: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the OTP validation step first by default when open', async () => {
    const { getByText, getByRole } = await render(
      <EditProfileModal
        user={dummyUser}
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    await expect.element(getByText('Edit Profile')).toBeInTheDocument();
    await expect
      .element(getByRole('button', { name: 'Send OTP' }))
      .toBeInTheDocument();
  });

  it('should not render anything when isOpen is false', async () => {
    const { container } = await render(
      <EditProfileModal
        user={dummyUser}
        isOpen={false}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
