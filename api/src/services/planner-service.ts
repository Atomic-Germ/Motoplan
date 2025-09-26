import { RoutingAdapter, RouteWaypoint, RoutingOptions } from '../routing/adapter';

export type Plan = {
  id: string;
  name?: string;
  distance_km: number;
  duration_minutes: number;
  waypoints: RouteWaypoint[];
  preferences?: any;
  twistiness_score?: number;
};

export class PlannerService {
  constructor(private adapter: RoutingAdapter) {}

  async createPlan(origin: RouteWaypoint, destination: RouteWaypoint, options?: RoutingOptions): Promise<Plan> {
    const raw = await this.adapter.planRoute(origin, destination, options);

    return {
      id: raw.id,
      name: `Plan ${raw.id}`,
      distance_km: Math.round((raw.distance_m / 1000) * 10) / 10,
      duration_minutes: Math.round((raw.duration_s / 60) * 10) / 10,
      waypoints: raw.waypoints
      ,
      // include preferences used and a computed twistiness score
      // twistiness_score mirrors requested preference (0..1) and can be used by clients
      // to display how twisty the route is.
      // Note: using `as any` to keep Plan shape flexible for now.
      ...(options ? { preferences: options, twistiness_score: options.twistiness ?? 0 } : {})
    };
  }
}
