import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { TestimonialCard } from './TestimonialCard';

describe('TestimonialCard', () => {
  it('renders testimonial text and author correctly', async () => {
    const { getByText } = await render(<TestimonialCard />);
    await expect.element(getByText(/Winning Circle/i)).toBeInTheDocument();
    await expect
      .element(getByText(/The anti-sniping protection is a game changer/i))
      .toBeInTheDocument();
    await expect
      .element(getByText(/Marcus T\., Watch Collector/i))
      .toBeInTheDocument();
  });
});
