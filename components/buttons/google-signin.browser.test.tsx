import { render } from 'vitest-browser-react';
import { SiginWithGoogleButton } from './google-signin';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

afterEach(() => {
  vi.clearAllMocks();
});

describe('SiginWithGoogleButton', () => {
  it('should render Google sign-in button correctly', async () => {
    const handleClick = vi.fn();
    const { getByRole } = await render(
      <SiginWithGoogleButton handleClick={handleClick} />
    );

    const button = await getByRole('button', { name: /google/i });
    await expect.element(button).toBeInTheDocument();
  });

  it('triggers handleClick when clicked', async () => {
    const handleClick = vi.fn();
    const { getByRole } = await render(
      <SiginWithGoogleButton handleClick={handleClick} />
    );

    const button = await getByRole('button', { name: /Google/i });
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
