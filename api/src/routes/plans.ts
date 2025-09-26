import { Router } from 'express';
import { PlannerService } from '../services/planner-service';
import { MockRoutingAdapter } from '../routing/mock-adapter';
import { validatePlanRequest } from '../validators/plan-validator';

const router = Router();

// GET returns a simple sample plan for quick checks
router.get('/', async (req: any, res: any) => {
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

// POST accepts { origin, destination, options } and returns a generated plan
router.post('/', async (req: any, res: any) => {
  const { origin, destination, options } = req.body || {};

  if (!origin || !destination) {
    return res.status(400).json({ error: 'origin and destination are required' });
  }

  // Use mock adapter by default for now — swap with HttpRoutingAdapter in production
  const adapter = new MockRoutingAdapter();
  const service = new PlannerService(adapter);

  try {
    const errors = validatePlanRequest(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const plan = await service.createPlan(origin, destination, options);
    return res.json({ plan });
  } catch (err: any) {
    console.error('Error creating plan', err);
    return res.status(500).json({ error: 'failed to create plan' });
  }
});

export default router;
