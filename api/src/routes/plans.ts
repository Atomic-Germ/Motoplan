import { Router } from 'express';

const router = Router();

// Sample /api/plans endpoint that returns a mock trip plan
router.get('/', async (req: any, res: any) => {
  // In later tasks, this will call the routing adapter and DB to produce a plan.
  const sample = {
    id: 'sample-1',
    name: 'Coastal Curves Loop',
    distance_km: 275,
    duration_minutes: 280,
    waypoints: [
      { lat: 37.7749, lon: -122.4194 },
      { lat: 36.6002, lon: -121.8947 }
    ],
    preferences: { avoid_unpaved: true, scenic: true }
  };

  res.json({ plan: sample });
});

export default router;
