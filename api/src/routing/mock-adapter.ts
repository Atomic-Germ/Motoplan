import { RoutingAdapter, RouteResult, RouteWaypoint } from './adapter';

export class MockRoutingAdapter implements RoutingAdapter {
  async planRoute(
    origin: RouteWaypoint,
    destination: RouteWaypoint,
    options?: { avoid_unpaved?: boolean; scenic?: boolean; twistiness?: number }
  ): Promise<RouteResult> {
    // Return deterministic fake route for tests/dev
    const baseMid = { lat: (origin.lat + destination.lat) / 2, lon: (origin.lon + destination.lon) / 2 };

    // Simulate twistiness by adding intermediate zig-zag waypoints proportional to twistiness
    const twist = Math.max(0, Math.min(1, options?.twistiness ?? 0));
    const extraPoints = Math.round(twist * 4); // 0..4 extra waypoints
    const waypoints: RouteWaypoint[] = [origin];

    for (let i = 0; i < extraPoints; i++) {
      // generate slight offset around the mid point
      waypoints.push({ lat: baseMid.lat + (i + 1) * 0.001 * (i % 2 === 0 ? 1 : -1), lon: baseMid.lon + (i + 1) * 0.001 });
    }

    waypoints.push(destination);

    let distance_m = 50000; // 50 km
    let duration_s = 3600; // 1 hour
    let id = 'mock-route-1';

    if (options?.avoid_unpaved) {
      id = 'mock-route-avoid-unpaved';
      distance_m = 52000; // slightly longer
      duration_s = 3900;
    } else if (options?.scenic) {
      id = 'mock-route-scenic';
      distance_m = 60000;
      duration_s = 4800;
    }

    if (twist > 0) {
      id = `mock-route-twisty-${Math.round(twist * 100)}`;
      // increase distance/duration proportionally to twistiness
      distance_m = Math.round(distance_m * (1 + twist * 0.25));
      duration_s = Math.round(duration_s * (1 + twist * 0.2));
    }

    return {
      id,
      distance_m,
      duration_s,
      waypoints
    };
  }
}
