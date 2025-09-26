export type Waypoint = { lat: number; lon: number };
export type RoutingOptions = {
  avoid_unpaved?: boolean;
  avoid_highways?: boolean;
  scenic?: boolean;
  twistiness?: number;
  max_distance_km?: number;
};

function isNumber(n: any): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

export function validateWaypoint(w: any): string | null {
  if (!w || typeof w !== 'object') return 'waypoint must be an object with lat and lon';
  if (!isNumber(w.lat) || w.lat < -90 || w.lat > 90) return 'lat must be a number between -90 and 90';
  if (!isNumber(w.lon) || w.lon < -180 || w.lon > 180) return 'lon must be a number between -180 and 180';
  return null;
}

export function validateRoutingOptions(options: any): string[] {
  const errs: string[] = [];
  if (!options) return errs;

  if (typeof options.avoid_unpaved !== 'undefined' && typeof options.avoid_unpaved !== 'boolean') {
    errs.push('avoid_unpaved must be a boolean');
  }
  if (typeof options.avoid_highways !== 'undefined' && typeof options.avoid_highways !== 'boolean') {
    errs.push('avoid_highways must be a boolean');
  }
  if (typeof options.scenic !== 'undefined' && typeof options.scenic !== 'boolean') {
    errs.push('scenic must be a boolean');
  }

  if (typeof options.twistiness !== 'undefined') {
    if (!isNumber(options.twistiness)) {
      errs.push('twistiness must be a number between 0 and 1');
    } else if (options.twistiness < 0 || options.twistiness > 1) {
      errs.push('twistiness must be between 0 and 1');
    }
  }

  if (typeof options.max_distance_km !== 'undefined') {
    if (!isNumber(options.max_distance_km) || options.max_distance_km <= 0) {
      errs.push('max_distance_km must be a positive number');
    }
  }

  return errs;
}

export function validatePlanRequest(body: any): string[] {
  const errs: string[] = [];
  if (!body) {
    errs.push('request body is required');
    return errs;
  }

  const { origin, destination, options } = body;
  const oErr = validateWaypoint(origin);
  if (oErr) errs.push(`origin: ${oErr}`);
  const dErr = validateWaypoint(destination);
  if (dErr) errs.push(`destination: ${dErr}`);

  errs.push(...validateRoutingOptions(options));

  return errs;
}
