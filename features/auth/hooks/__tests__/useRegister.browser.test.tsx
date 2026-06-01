import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-react';
import { userEvent } from 'vitest/browser';
import { useRegister } from '../useRegister';

const mockRouterReplace = vi.fn();
const mockRegisterAction = vi.fn();

vi.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    replace: mockRouterReplace,
  }),
}));

vi.mock('@/actions/auth/auth.actions', () => ({
  __esModule: true,
  registerAction: (...args: unknown[]) => mockRegisterAction(...args),
}));

// Test helper component to invoke and expose hook capabilities
const TestRegisterComponent = () => {
  const { register, onSubmit, isSubmitting, errors } = useRegister();
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            phone: '9876543210',
            address: '123 Testing St',
            password: 'Password@123',
            terms: true,
          });
        }}
        data-testid="register-form"
      >
        <input {...register('firstName')} data-testid="firstName" />
        <input {...register('lastName')} data-testid="lastName" />
        <input {...register('email')} data-testid="email" />
        <input {...register('phone')} data-testid="phone" />
        <input {...register('address')} data-testid="address" />
        <input {...register('password')} data-testid="password" />
        <button type="submit" data-testid="submit-btn">
          Register
        </button>
        {isSubmitting && (
          <span data-testid="submitting-indicator">Registering...</span>
        )}
        {errors.root && (
          <span data-testid="error-message">{errors.root.message}</span>
        )}
      </form>
    </div>
  );
};

describe('useRegister Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render form fields from hook registration', async () => {
    const { getByTestId } = await render(<TestRegisterComponent />);

    await expect.element(getByTestId('firstName')).toBeInTheDocument();
    await expect.element(getByTestId('lastName')).toBeInTheDocument();
    await expect.element(getByTestId('email')).toBeInTheDocument();
    await expect.element(getByTestId('phone')).toBeInTheDocument();
    await expect.element(getByTestId('address')).toBeInTheDocument();
    await expect.element(getByTestId('password')).toBeInTheDocument();
  });

  it('should display error message on failed registration response', async () => {
    mockRegisterAction.mockResolvedValueOnce({
      success: false,
      error: 'Email address already in use',
    });

    const { getByTestId } = await render(<TestRegisterComponent />);

    const submitBtn = getByTestId('submit-btn');
    await userEvent.click(submitBtn);

    const errorMessage = getByTestId('error-message');
    await expect
      .element(errorMessage)
      .toHaveTextContent('Email address already in use');
    expect(mockRegisterAction).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '9876543210',
      address: '123 Testing St',
      password: 'Password@123',
      terms: true,
    });
  });

  it('should redirect to the email verification page on successful registration', async () => {
    mockRegisterAction.mockResolvedValueOnce({
      success: true,
    });

    const { getByTestId } = await render(<TestRegisterComponent />);

    const submitBtn = getByTestId('submit-btn');
    await userEvent.click(submitBtn);

    expect(mockRouterReplace).toHaveBeenCalledWith(
      '/email?email=test@example.com'
    );
  });

  it('should catch unhandled exceptions and render standard error text', async () => {
    mockRegisterAction.mockRejectedValueOnce(new Error('Connection timed out'));

    const { getByTestId } = await render(<TestRegisterComponent />);

    const submitBtn = getByTestId('submit-btn');
    await userEvent.click(submitBtn);

    const errorMessage = getByTestId('error-message');
    await expect
      .element(errorMessage)
      .toHaveTextContent('Connection timed out');
  });
});
