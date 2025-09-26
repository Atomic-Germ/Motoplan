import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export function validateBody(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errors: string[] = parsed.error.errors.map((e: any) => `${e.path.join('.') || '(root)'}: ${e.message}`);
      return res.status(400).json({ errors });
    }

    // body validated; proceed
    return next();
  };
}
