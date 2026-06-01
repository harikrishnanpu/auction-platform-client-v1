import { formatInr } from './format-inr';

describe('formatInr', () => {
  it('formats a number to INR currency string by default', () => {
    const result = formatInr(1000);

    // Use replace to strip non-breaking spaces or other formatting differences across Node versions
    const cleanResult = result.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ');

    expect(cleanResult).toContain('₹');
    expect(cleanResult).toContain('1,000.00');
  });

  it('formats large numbers with Indian grouping system (lakhs/crores)', () => {
    const result = formatInr(150000); // 1.5 Lakhs
    const cleanResult = result.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ');

    expect(cleanResult).toContain('1,50,000.00');
  });

  it('supports custom currency codes', () => {
    const result = formatInr(100, 'USD');
    const cleanResult = result.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ');

    expect(cleanResult).toContain('$');
    expect(cleanResult).toContain('100.00');
  });
});
