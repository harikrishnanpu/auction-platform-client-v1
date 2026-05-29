import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { ChangePasswordModal } from '../change-password.modal';
import { AuthProvider, UserInfo } from '@/types/user.type';

vi.mock('@/actions/user/profile.actions', () => ({
  __esModule: true,
  changeProfilePasswordAction: vi.fn(),
  sendProfileChangePasswordOtpAction: vi.fn(),
}));

vi.mock('sonner', () => ({
  __esModule: true,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('ChangePasswordModal', () => {
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

  it('should render the Send Confirmation Code stage when open', async () => {
    const { getByRole } = await render(
      <ChangePasswordModal user={dummyUser} isOpen={true} onClose={vi.fn()} />
    );

    await expect
      .element(getByRole('heading', { name: 'Change Password' }))
      .toBeInTheDocument();
    await expect
      .element(getByRole('button', { name: 'Send Confirmation Code' }))
      .toBeInTheDocument();
  });

  it('should not render anything when isOpen is false', async () => {
    const { container } = await render(
      <ChangePasswordModal user={dummyUser} isOpen={false} onClose={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });
});
