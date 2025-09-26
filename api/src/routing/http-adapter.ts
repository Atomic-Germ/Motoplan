import { RoutingAdapter, RouteResult, RouteWaypoint } from './adapter';

declare const fetch: any; // keep typings light for scaffolding

export class HttpRoutingAdapter implements RoutingAdapter {
  constructor(private baseUrl: string) {}

  async planRoute(origin: RouteWaypoint, destination: RouteWaypoint, options?: { avoid_unpaved?: boolean; scenic?: boolean }): Promise<RouteResult> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/route`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ origin, destination, options })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Routing engine error ${res.status}: ${text}`);
    }

    const json = await res.json();
    const { id, distance_m, duration_s, waypoints } = json;

    return {
      id,
      distance_m,
      duration_s,
      waypoints
    };
  }
}
