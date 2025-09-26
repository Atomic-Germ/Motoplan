// ...existing code...
// Placeholder controller for plan-related logic

export const formatPlan = (raw: any) => {
  // Transform routing engine output into API response contract
  return {
    id: raw.id || 'generated',
    name: raw.name || 'Generated Trip',
    distance_km: raw.distance_km || 0,
    duration_minutes: raw.duration_minutes || 0,
    waypoints: raw.waypoints || [],
    preferences: raw.preferences || {}
  };
};
