// Zod schemas for request validation. Keep them close to domain types but reusable.
import { z } from 'zod';

export const createFarmSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
});

export const updateFarmSchema = createFarmSchema.partial();

export const createFieldSchema = z.object({
  farmId: z.string().min(1),
  name: z.string().min(1),
  areaHectares: z.number().positive(),
});

export const updateFieldSchema = createFieldSchema.partial();

export const createTaskSchema = z.object({
  farmId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
