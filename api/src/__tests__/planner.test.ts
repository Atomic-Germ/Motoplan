/// <reference types="jest" />
import { PlannerService } from '../services/planner-service';
import { MockRoutingAdapter } from '../routing/mock-adapter';

describe('PlannerService (TDD)', () => {
  test('creates a plan from routing adapter output', async () => {
    // Arrange (RED - test should fail until PlannerService exists and works)
    const adapter = new MockRoutingAdapter();
    const service = new PlannerService(adapter);

    const origin = { lat: 37.7749, lon: -122.4194 };
    const destination = { lat: 36.6002, lon: -121.8947 };

    // Act
    const plan = await service.createPlan(origin, destination);

    // Assert
    expect(plan).toBeDefined();
    expect(plan.id).toBe('mock-route-1');
    expect(plan.distance_km).toBeGreaterThan(0);
    expect(plan.waypoints.length).toBeGreaterThanOrEqual(2);
  });
});
