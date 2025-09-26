import { Router } from 'express';
import { PlannerService } from '../services/planner-service';
import { MockRoutingAdapter } from '../routing/mock-adapter';
import { parsePlanRequest, planRequestSchema } from '../validators/plan-schema';
import { validateBody } from '../validators/express-middleware';

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
router.post('/', validateBody(planRequestSchema), async (req: any, res: any) => {
  const { origin, destination, options } = req.body;

  // Use mock adapter by default for now — swap with HttpRoutingAdapter in production
  const adapter = new MockRoutingAdapter();
  const service = new PlannerService(adapter);

  try {
    const plan = await service.createPlan(origin, destination, options as any);
    return res.json({ plan });
  } catch (err: any) {
    console.error('Error creating plan', err);
    return res.status(500).json({ error: 'failed to create plan' });
  }
});

export default router;
