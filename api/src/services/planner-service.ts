import { RoutingAdapter, RouteWaypoint } from '../routing/adapter';

export type Plan = {
  id: string;
  name?: string;
  distance_km: number;
  duration_minutes: number;
  waypoints: RouteWaypoint[];
};

export class PlannerService {
  constructor(private adapter: RoutingAdapter) {}

  async createPlan(origin: RouteWaypoint, destination: RouteWaypoint, options?: { avoid_unpaved?: boolean; scenic?: boolean }): Promise<Plan> {
    const raw = await this.adapter.planRoute(origin, destination, options);

    return {
      id: raw.id,
      name: `Plan ${raw.id}`,
      distance_km: Math.round((raw.distance_m / 1000) * 10) / 10,
      duration_minutes: Math.round((raw.duration_s / 60) * 10) / 10,
      waypoints: raw.waypoints
    };
  }
}
