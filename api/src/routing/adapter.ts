export type RouteWaypoint = { lat: number; lon: number };

export type RouteResult = {
  id: string;
  distance_m: number;
  duration_s: number;
  waypoints: RouteWaypoint[];
};

export type RoutingOptions = {
  avoid_unpaved?: boolean;
  avoid_highways?: boolean;
  scenic?: boolean;
  // 0.0 (fastest/straight) .. 1.0 (maximum twistiness / most curvy)
  twistiness?: number;
  // Additional constraint placeholders
  max_distance_km?: number;
};

export interface RoutingAdapter {
  planRoute(
    origin: RouteWaypoint,
    destination: RouteWaypoint,
    options?: RoutingOptions
  ): Promise<RouteResult>;
}
