/// <reference types="jest" />
import express from 'express';
import { HttpRoutingAdapter } from '../routing/http-adapter';
import { PlannerService } from '../services/planner-service';

function startStubRouter() {
  const app = express();
  app.use(express.json());

  app.post('/route', (req, res) => {
    const { origin, destination, options } = req.body || {};
    let id = 'http-mock-route';
    let distance_m = 40000;
    let duration_s = 3000;

    if (options?.avoid_unpaved) {
      id = 'http-mock-avoid';
      distance_m = 42000;
      duration_s = 3300;
    } else if (options?.scenic) {
      id = 'http-mock-scenic';
      distance_m = 60000;
      duration_s = 4800;
    } else if (options?.twistiness && options.twistiness > 0.5) {
      id = 'http-mock-twisty';
      distance_m = 50000 * (1 + options.twistiness * 0.2);
      duration_s = 3600 * (1 + options.twistiness * 0.15);
    }

    const waypoints = [origin, destination];

    res.json({ id, distance_m, duration_s, waypoints });
  });

  const server = app.listen(0);
  return {
    server,
    port: (server.address() as any).port
  };
}

describe('HttpRoutingAdapter integration (stub)', () => {
  test('createPlan works against a stub router (avoid_unpaved)', async () => {
    const stub = startStubRouter();
    const baseUrl = `http://127.0.0.1:${stub.port}`;
    const adapter = new HttpRoutingAdapter(baseUrl);
    const service = new PlannerService(adapter);

    const origin = { lat: 37.7749, lon: -122.4194 };
    const destination = { lat: 36.6002, lon: -121.8947 };

    const plan = await service.createPlan(origin, destination, { avoid_unpaved: true });

    expect(plan.id).toBe('http-mock-avoid');
    expect(plan.distance_km).toBeGreaterThanOrEqual(42);

    await new Promise<void>((resolve) => stub.server.close(() => resolve()));
  });

  test('createPlan works against a stub router (scenic)', async () => {
    const stub = startStubRouter();
    const baseUrl = `http://127.0.0.1:${stub.port}`;
    const adapter = new HttpRoutingAdapter(baseUrl);
    const service = new PlannerService(adapter);

    const origin = { lat: 37.7749, lon: -122.4194 };
    const destination = { lat: 36.6002, lon: -121.8947 };

    const plan = await service.createPlan(origin, destination, { scenic: true });

    expect(plan.id).toBe('http-mock-scenic');
    expect(plan.distance_km).toBeGreaterThanOrEqual(60);

    await new Promise<void>((resolve) => stub.server.close(() => resolve()));
  });

  test('createPlan works against a stub router (twistiness)', async () => {
    const stub = startStubRouter();
    const baseUrl = `http://127.0.0.1:${stub.port}`;
    const adapter = new HttpRoutingAdapter(baseUrl);
    const service = new PlannerService(adapter);

    const origin = { lat: 37.7749, lon: -122.4194 };
    const destination = { lat: 36.6002, lon: -121.8947 };

    const plan = await service.createPlan(origin, destination, { twistiness: 0.8 });

    expect(plan.id).toBe('http-mock-twisty');
    expect(plan.distance_km).toBeGreaterThanOrEqual(50);

    await new Promise<void>((resolve) => stub.server.close(() => resolve()));
  });
});
