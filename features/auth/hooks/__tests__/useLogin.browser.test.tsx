import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { useLogin } from '../useLogin';

const mockRouterReplace = vi.fn();
const mockSetUser = vi.fn();
const mockLoginAction = vi.fn();

vi.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}));

vi.mock('@/store/user.store', () => ({
  __esModule: true,
  default: () => ({
    setUser: mockSetUser,
  }),
}));

vi.mock('@/actions/auth/auth.actions', () => ({
  __esModule: true,
  loginAction: (...args: unknown[]) => mockLoginAction(...args),
}));

const TestLoginComponent = () => {
  const { register, onSubmit, isSubmitting, errors } = useLogin();
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ email: 'test@example.com', password: 'Password@123' });
        }}
        data-testid="login-form"
      >
        <input {...register('email')} data-testid="email" />
        <input {...register('password')} data-testid="password" />
        <button type="submit" data-testid="submit-btn">
          Log In
        </button>
        {isSubmitting && (
          <span data-testid="submitting-indicator">Submitting...</span>
        )}
        {errors.root && (
          <span data-testid="error-message">{errors.root.message}</span>
        )}
      </form>
    </div>
  );
};

describe('useLogin Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render standard form inputs from hook registration', async () => {
    const { getByTestId } = await render(<TestLoginComponent />);

    const emailInput = getByTestId('email');
    const passwordInput = getByTestId('password');

    await expect.element(emailInput).toBeInTheDocument();
    await expect.element(passwordInput).toBeInTheDocument();
  });

  it('should display error message on failed login action', async () => {
    mockLoginAction.mockResolvedValueOnce({
      success: false,
      error: 'Invalid credentials provided',
    });

    const { getByTestId } = await render(<TestLoginComponent />);

    const submitBtn = getByTestId('submit-btn');
    await userEvent.click(submitBtn);

    const errorMessage = getByTestId('error-message');
    await expect
      .element(errorMessage)
      .toHaveTextContent('Invalid credentials provided');
    expect(mockLoginAction).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password@123',
    });
  });

  it('should call setUser and redirect to /home on successful, verified login', async () => {
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

    const { getByTestId } = await render(<TestLoginComponent />);

    const submitBtn = getByTestId('submit-btn');
    await userEvent.click(submitBtn);

    expect(mockSetUser).toHaveBeenCalledWith(dummyUser);
    expect(mockRouterReplace).toHaveBeenCalledWith('/home');
  });

  it('should call setUser and redirect to /complete-profile on uncompleted profile login', async () => {
    const dummyUser = {
      id: 'user-456',
      email: 'test@example.com',
      isVerified: false,
      isProfileCompleted: false,
    };

    mockLoginAction.mockResolvedValueOnce({
      success: true,
      data: { user: dummyUser },
    });

    const { getByTestId } = await render(<TestLoginComponent />);

    const submitBtn = getByTestId('submit-btn');
    await userEvent.click(submitBtn);

    expect(mockSetUser).toHaveBeenCalledWith(dummyUser);
    expect(mockRouterReplace).toHaveBeenCalledWith('/complete-profile');
  });
});
