export type RouteWaypoint = { lat: number; lon: number };

export type RouteResult = {
  id: string;
  distance_m: number;
  duration_s: number;
  waypoints: RouteWaypoint[];
};

export interface RoutingAdapter {
  planRoute(
    origin: RouteWaypoint,
    destination: RouteWaypoint,
    options?: { avoid_unpaved?: boolean; scenic?: boolean }
  ): Promise<RouteResult>;
}
