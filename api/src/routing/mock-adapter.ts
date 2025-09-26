import { RoutingAdapter, RouteResult, RouteWaypoint } from './adapter';

export class MockRoutingAdapter implements RoutingAdapter {
  async planRoute(
    origin: RouteWaypoint,
    destination: RouteWaypoint,
    options?: { avoid_unpaved?: boolean; scenic?: boolean }
  ): Promise<RouteResult> {
    // Return deterministic fake route for tests/dev
    const waypoints = [origin, { lat: (origin.lat + destination.lat) / 2, lon: (origin.lon + destination.lon) / 2 }, destination];

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

    return {
      id,
      distance_m,
      duration_s,
      waypoints
    };
  }
}
