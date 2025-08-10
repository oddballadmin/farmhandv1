import express, { Request, Response, NextFunction } from 'express';
import { repos } from './repositories.js';
import { nowIso } from './domain.js';
import { z } from 'zod';
import { createFarmSchema, updateFarmSchema, createFieldSchema, updateFieldSchema, createTaskSchema, updateTaskSchema } from './validation.js';

// Small helper to validate requests with zod
function validate<TSchema extends z.ZodTypeAny>(schema: TSchema, data: unknown): z.infer<TSchema> {
  const res = schema.safeParse(data);
  if (!res.success) {
  const msg = res.error.issues.map((i: z.ZodIssue) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw Object.assign(new Error(msg), { status: 400 });
  }
  return res.data as z.infer<TSchema>;
}

export function createApiRouter() {
  const router = express.Router();

  // Health
  router.get('/health', (_req: Request, res: Response) => res.json({ ok: true, time: nowIso() }));

  // Farms
  router.get('/farms', async (_req: Request, res: Response) => {
    res.json(await repos.farms.list());
  });

  router.post('/farms', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = validate(createFarmSchema, req.body);
      const created = await repos.farms.create({ ...input, createdAt: nowIso() });
      res.status(201).json(created);
    } catch (err) { next(err); }
  });

  router.patch('/farms/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patch = validate(updateFarmSchema, req.body);
      const updated = await repos.farms.update(req.params.id, patch);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) { next(err); }
  });

  // Fields
  router.get('/fields', async (_req: Request, res: Response) => {
    res.json(await repos.fields.list());
  });

  router.post('/fields', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = validate(createFieldSchema, req.body);
      const created = await repos.fields.create(input);
      res.status(201).json(created);
    } catch (err) { next(err); }
  });

  router.patch('/fields/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patch = validate(updateFieldSchema, req.body);
      const updated = await repos.fields.update(req.params.id, patch);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) { next(err); }
  });

  // Tasks
  router.get('/tasks', async (_req: Request, res: Response) => {
    res.json(await repos.tasks.list());
  });

  router.post('/tasks', async (req: Request, res: Response, next: NextFunction) => {
    try {
  const input = validate(createTaskSchema, req.body);
  const created = await repos.tasks.create({ ...input, status: input.status ?? 'todo' });
      res.status(201).json(created);
    } catch (err) { next(err); }
  });

  router.patch('/tasks/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patch = validate(updateTaskSchema, req.body);
      const updated = await repos.tasks.update(req.params.id, patch);
      if (!updated) return res.status(404).json({ error: 'Not found' });
      res.json(updated);
    } catch (err) { next(err); }
  });

  return router;
}
