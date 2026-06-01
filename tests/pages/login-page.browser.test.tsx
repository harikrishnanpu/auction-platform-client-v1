import { describe, expect, it, vi } from 'vitest';
import LoginPage from '@/app/(public)/(auth)/login/page';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';

const mockRouterReplace = vi.fn();
const mockSetUser = vi.fn();
const mockLoginAction = vi.fn();

vi.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}));

vi.mock('@/actions/auth/auth.actions', () => ({
  __esModule: true,
  loginAction: mockLoginAction,
}));

vi.mock('@/store/user.store', () => ({
  __esModule: true,
  default: () => ({
    setUser: mockSetUser,
  }),
}));

describe('LoginPage Test', () => {
  it('should render the LoginPage correctly in the browser', async () => {
    const { getByTestId } = await render(<LoginPage />);

    await expect
      .element(getByTestId('login-form-email-input'))
      .toBeInTheDocument();
    await expect
      .element(getByTestId('login-form-password-input'))
      .toBeInTheDocument();
    await expect
      .element(getByTestId('login-form-password-toggle-button'))
      .toBeInTheDocument();
    await expect
      .element(getByTestId('login-form-submit-button'))
      .toBeInTheDocument();
    await expect
      .element(getByTestId('login-form-google-button'))
      .toBeInTheDocument();
    await expect
      .element(getByTestId('login-form-register-link'))
      .toBeInTheDocument();
  });

  it('should submit the login form correctly', async () => {
    const { getByTestId } = await render(<LoginPage />);

    const dummyUser = {
      id: 'user-123',
      email: 'test@example.com',
      isVerified: true,
      isProfileCompleted: true,
    };

    mockLoginAction.mockResolvedValueOnce({
      success: true,
      data: { user: dummyUser },
    });

    const emailInput = getByTestId('login-form-email-input');
    const passwordInput = getByTestId('login-form-password-input');
    const submitButton = getByTestId('login-form-submit-button');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password@123');
    await userEvent.click(submitButton);

    expect(mockLoginAction).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password@123',
    });

    expect(mockSetUser).toHaveBeenCalledWith(dummyUser);

    expect(mockRouterReplace).toHaveBeenCalledWith('/home');
  });

  it('should display error message on failed login action', async () => {
    const { getByTestId } = await render(<LoginPage />);

    const emailInput = getByTestId('login-form-email-input');
    const passwordInput = getByTestId('login-form-password-input');
    const submitButton = getByTestId('login-form-submit-button');

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Password@123');
    await userEvent.click(submitButton);

    expect(mockLoginAction).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password@123',
    });

    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockRouterReplace).not.toHaveBeenCalled();
  });
});
