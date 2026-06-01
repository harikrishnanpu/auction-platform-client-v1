import { it } from 'vitest';
import { InfoGroup } from '../InfoGroup';
import { describe } from 'vitest';
import { render } from 'vitest-browser-react';
import { expect } from 'vitest';

describe('InfoGroup', () => {
  const mockIcon = <span data-testid="mock-icon">🔥</span>;

  it('should renders icon, label, and value correctly', async () => {
    const { getByTestId, getByText } = await render(
      <InfoGroup icon={mockIcon} label="Bid Count" value="42 bids" />
    );
    await expect.element(getByTestId('mock-icon')).toBeInTheDocument();
    await expect.element(getByText('Bid Count')).toBeInTheDocument();
    await expect.element(getByText('42 bids')).toBeInTheDocument();
  });

  it('should apply fullWidth style modifier when fullWidth is true', async () => {
    const { getByTestId } = await render(
      <InfoGroup icon={mockIcon} label="Label" value="Value" fullWidth={true} />
    );
    await expect
      .element(getByTestId('info-group'))
      .toHaveClass('col-span-full');
  });

  it('should not apply fullWidth style modifier when fullWidth is false or undefined', async () => {
    const { getByTestId } = await render(
      <InfoGroup icon={mockIcon} label="Label" value="Value" />
    );
    await expect
      .element(getByTestId('info-group'))
      .not.toHaveClass('col-span-full');
  });

  it('should apply mono classes when mono is true', async () => {
    const { getByText } = await render(
      <InfoGroup icon={mockIcon} label="Label" value="123.45" mono={true} />
    );

    const valueEl = getByText('123.45');
    await expect.element(valueEl).toHaveClass('font-mono');
    await expect.element(valueEl).toHaveClass('bg-muted/50');
  });
});
