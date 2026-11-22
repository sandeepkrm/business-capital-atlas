import { describe, expect, it } from 'vitest';
import { lenderFacts } from '@/lib/lender-facts';

describe('Directory figures on loan pages', () => {
  const row = { name: 'Test lender', products: ['business-loans'], min_amount: '£5,000', max_amount: '£100,000', term: '1–5 years', speed: null };
  it('uses the directory amounts and terms exactly', () => {
    expect(lenderFacts([row], 'business-loans').slice(0, 2)).toEqual(['Test lender: £5,000 – £100,000', 'Test lender: 1–5 years']);
  });
  it('does not invent speed where the lender has not supplied one', () => {
    expect(lenderFacts([row], 'business-loans')[3]).toBe('Confirm with the lender');
  });
  it('never borrows figures from a different funding product', () => {
    expect(lenderFacts([row], 'invoice-finance')[0]).toBe('Confirm with the lender');
  });
});