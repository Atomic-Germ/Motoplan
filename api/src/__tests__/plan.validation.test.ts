/// <reference types="jest" />
import { parsePlanRequest } from '../validators/plan-schema';

describe('plan request validation', () => {
  test('rejects missing body', () => {
    const res = parsePlanRequest(undefined as any);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors.length).toBeGreaterThan(0);
    }
  });

  test('rejects invalid origin/destination', () => {
    const res = parsePlanRequest({ origin: { lat: 999, lon: 0 }, destination: { lat: 0, lon: 0 } });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors.some((e: string) => e.includes('origin'))).toBeTruthy();
    }
  });

  test('rejects invalid twistiness', () => {
    const res = parsePlanRequest({ origin: { lat: 0, lon: 0 }, destination: { lat: 1, lon: 1 }, options: { twistiness: 3 } });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.errors.some((e: string) => e.includes('twistiness'))).toBeTruthy();
    }
  });

  test('accepts valid request', () => {
    const res = parsePlanRequest({ origin: { lat: 0, lon: 0 }, destination: { lat: 1, lon: 1 }, options: { twistiness: 0.5, scenic: true } });
    expect(res.success).toBe(true);
  });
});
