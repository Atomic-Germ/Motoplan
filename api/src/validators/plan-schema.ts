import { z } from 'zod';

export const waypointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180)
});

export const routingOptionsSchema = z.object({
  avoid_unpaved: z.boolean().optional(),
  avoid_highways: z.boolean().optional(),
  scenic: z.boolean().optional(),
  twistiness: z.number().min(0).max(1).optional(),
  max_distance_km: z.number().positive().optional()
});

export const planRequestSchema = z.object({
  origin: waypointSchema,
  destination: waypointSchema,
  options: routingOptionsSchema.optional()
});

export type PlanRequest = z.infer<typeof planRequestSchema>;

export function parsePlanRequest(body: any): { success: true; data: PlanRequest } | { success: false; errors: string[] } {
  const res = planRequestSchema.safeParse(body);
  if (res.success) return { success: true, data: res.data };

  const errors: string[] = res.error.errors.map((e: { path: (string | number)[]; message: string }) => `${e.path.join('.') || '(root)'}: ${e.message}`);
  return { success: false, errors };
}
