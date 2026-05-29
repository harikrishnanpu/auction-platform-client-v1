import { render } from 'vitest-browser-react';
import { AuthFormCard } from './authFormCard';
import { describe, expect, it } from 'vitest';

describe('AuthFormCard', () => {
  it('renders children correctly inside the card container', async () => {
    const { getByTestId } = await render(
      <AuthFormCard data-testid="auth-card">
        <div data-testid="test-child">Auth Form Child</div>
      </AuthFormCard>
    );

    const card = await getByTestId('auth-card');
    await expect.element(card).toBeInTheDocument();

    await expect.element(card).toHaveClass('w-full');
    await expect.element(card).toHaveClass('max-w-md');

    const child = await getByTestId('test-child');

    await expect.element(child).toBeInTheDocument();
    await expect.element(child).toHaveTextContent('Auth Form Child');
  });
});
