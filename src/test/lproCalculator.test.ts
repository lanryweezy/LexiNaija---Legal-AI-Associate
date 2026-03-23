import { describe, it, expect } from 'vitest';
import { calculateLPROFee } from '../services/lproCalculator';

describe('lproCalculator', () => {
  it('calculates Sale fee correctly for first tier', () => {
    const result = calculateLPROFee({
      transactionType: 'Sale',
      propertyValue: 10_000_000 // 10M
    });
    // 10% of 10M = 1M
    expect(result.professionalFee).toBe(1_000_000);
    expect(result.vat).toBe(75_000); // 7.5% of 1M
  });

  it('calculates Sale fee correctly for second tier', () => {
    const result = calculateLPROFee({
      transactionType: 'Sale',
      propertyValue: 100_000_000 // 100M
    });
    // 10% of first 50M = 5M
    // 5% of next 50M = 2.5M
    // Total = 7.5M
    expect(result.professionalFee).toBe(7_500_000);
  });

  it('calculates Sale fee correctly for third tier', () => {
    const result = calculateLPROFee({
      transactionType: 'Sale',
      propertyValue: 300_000_000 // 300M
    });
    // 10% of first 50M = 5M
    // 5% of next 200M = 10M
    // 3% of balance 50M = 1.5M
    // Total = 16.5M
    expect(result.professionalFee).toBe(16_500_000);
  });

  it('calculates Power of Attorney flat fee', () => {
    const result = calculateLPROFee({
      transactionType: 'Power of Attorney',
      propertyValue: 0
    });
    expect(result.professionalFee).toBe(50_000);
  });

  it('calculates Deed of Gift fee', () => {
    const result = calculateLPROFee({
      transactionType: 'Deed of Gift',
      propertyValue: 10_000_000 // 10M
    });
    // 5% of 10M = 500,000
    expect(result.professionalFee).toBe(500_000);
  });

  it('calculates Lease fee for residential', () => {
    const result = calculateLPROFee({
      transactionType: 'Lease',
      propertyValue: 2_000_000, // 2M rent
      isCommercial: false
    });
    // 7.5% of 2M = 150,000
    expect(result.professionalFee).toBe(150_000);
  });

  it('calculates Lease fee for commercial', () => {
    const result = calculateLPROFee({
      transactionType: 'Lease',
      propertyValue: 2_000_000, // 2M rent
      isCommercial: true
    });
    // 10% of 2M = 200,000
    expect(result.professionalFee).toBe(200_000);
  });

  it('applies statutory minimum fee', () => {
    const result = calculateLPROFee({
      transactionType: 'Sale',
      propertyValue: 100_000 // 100k
    });
    // 10% of 100k = 10k, but min is 50k
    expect(result.professionalFee).toBe(50_000);
    expect(result.warning).toContain('Minimum statutory fee');
  });
});
