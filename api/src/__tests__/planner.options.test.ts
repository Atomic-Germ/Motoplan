/// <reference types="jest" />
import { PlannerService } from '../services/planner-service';
import { MockRoutingAdapter } from '../routing/mock-adapter';

describe('PlannerService options', () => {
  test('forwards options to adapter and reflects avoid_unpaved behavior', async () => {
    const adapter = new MockRoutingAdapter();
    const service = new PlannerService(adapter);

    const origin = { lat: 37.7749, lon: -122.4194 };
    const destination = { lat: 36.6002, lon: -121.8947 };

    const plan = await service.createPlan(origin, destination, { avoid_unpaved: true });

    expect(plan).toBeDefined();
    expect(plan.id).toBe('mock-route-avoid-unpaved');
    expect(plan.distance_km).toBeGreaterThanOrEqual(52);
  });

  test('scenic option alters route id and distance', async () => {
    const adapter = new MockRoutingAdapter();
    const service = new PlannerService(adapter);

    const origin = { lat: 37.7749, lon: -122.4194 };
    const destination = { lat: 36.6002, lon: -121.8947 };

    const plan = await service.createPlan(origin, destination, { scenic: true });

    expect(plan.id).toBe('mock-route-scenic');
    expect(plan.distance_km).toBeGreaterThanOrEqual(60);
  });
});
