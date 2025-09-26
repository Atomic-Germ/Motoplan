/// <reference types="jest" />
import { validatePlanRequest } from '../validators/plan-validator';

describe('plan request validation', () => {
  test('rejects missing body', () => {
    const errs = validatePlanRequest(undefined as any);
    expect(errs).toContain('request body is required');
  });

  test('rejects invalid origin/destination', () => {
    const errs = validatePlanRequest({ origin: { lat: 999, lon: 0 }, destination: { lat: 0, lon: 0 } });
    expect(errs.some((e) => e.includes('origin'))).toBeTruthy();
  });

  test('rejects invalid twistiness', () => {
    const errs = validatePlanRequest({ origin: { lat: 0, lon: 0 }, destination: { lat: 1, lon: 1 }, options: { twistiness: 3 } });
    expect(errs).toContain('twistiness must be between 0 and 1');
  });

  test('accepts valid request', () => {
    const errs = validatePlanRequest({ origin: { lat: 0, lon: 0 }, destination: { lat: 1, lon: 1 }, options: { twistiness: 0.5, scenic: true } });
    expect(errs.length).toBe(0);
  });
});
