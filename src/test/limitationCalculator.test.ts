import { describe, it, expect } from 'vitest';
import {
  calculateLimitationDate,
  getDaysUntilLimitation,
  getLimitationUrgency,
  LIMITATION_PERIODS
} from '../services/limitationCalculator';

describe('limitationCalculator', () => {
  it('calculates limitation date for contract correctly', () => {
    // Use explicit components to avoid parser timezone ambiguity
    const accrualDate = new Date(2024, 0, 1);
    const limitDate = calculateLimitationDate(accrualDate, 'Contract');
    // Contract is 6 years
    expect(limitDate.getFullYear()).toBe(2030);
    expect(limitDate.getMonth()).toBe(0);
    expect(limitDate.getDate()).toBe(1);
  });

  it('calculates limitation date for criminal summary correctly', () => {
    const accrualDate = new Date(2024, 0, 1);
    const limitDate = calculateLimitationDate(accrualDate, 'Criminal Summary');
    // Criminal summary is 6 months
    expect(limitDate.getFullYear()).toBe(2024);
    expect(limitDate.getMonth()).toBe(6); // July (0-indexed)
  });

  it('calculates Public Officers Protection correctly', () => {
    const accrualDate = new Date(2024, 0, 1);
    const limitDate = calculateLimitationDate(accrualDate, 'Public Officers Protection');
    // 3 months
    expect(limitDate.getMonth()).toBe(3); // April
  });

  it('handles Fundamental Rights as effectively no limitation', () => {
    const accrualDate = new Date();
    const limitDate = calculateLimitationDate(accrualDate, 'Fundamental Rights');
    expect(limitDate.getFullYear()).toBeGreaterThan(accrualDate.getFullYear() + 50);
  });

  it('calculates days until limitation correctly', () => {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + 10);
    const days = getDaysUntilLimitation(limitDate);
    expect(days).toBe(10);
  });

  it('calculates urgency levels correctly', () => {
    const today = new Date();

    // Critical (<= 30 days)
    const criticalDate = new Date(today);
    criticalDate.setDate(today.getDate() + 25);
    expect(getLimitationUrgency(criticalDate).level).toBe('critical');

    // Warning (<= 60 days)
    const warningDate = new Date(today);
    warningDate.setDate(today.getDate() + 55);
    expect(getLimitationUrgency(warningDate).level).toBe('warning');

    // Attention (<= 90 days)
    const attentionDate = new Date(today);
    attentionDate.setDate(today.getDate() + 85);
    expect(getLimitationUrgency(attentionDate).level).toBe('attention');

    // Safe (> 90 days)
    const safeDate = new Date(today);
    safeDate.setDate(today.getDate() + 120);
    expect(getLimitationUrgency(safeDate).level).toBe('safe');
  });

  it('handles expired limitation as critical', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const urgency = getLimitationUrgency(pastDate);
    expect(urgency.level).toBe('critical');
    expect(urgency.message).toContain('STATUTE-BARRED');
  });
});
