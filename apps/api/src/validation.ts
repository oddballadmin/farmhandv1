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

export const createAnimalSchema = z.object({
  farmId: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["goat", "cow", "sheep", "pig", "horse", "chicken"]),
  breed: z.string().optional(),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().datetime().optional(),
  parentMaleId: z.string().optional(),
  parentFemaleId: z.string().optional(),
  registrationNumber: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["open", "bred", "pregnant", "fresh", "dry"]).optional(),
});

export const updateAnimalSchema = createAnimalSchema.partial();

export const createBreedingRecordSchema = z.object({
  farmId: z.string().min(1),
  maleAnimalId: z.string().min(1),
  femaleAnimalId: z.string().min(1),
  breedingDate: z.string().datetime(),
  expectedDueDate: z.string().datetime().optional(),
  actualBirthDate: z.string().datetime().optional(),
  offspring: z.array(z.string()).optional(),
  status: z.enum(["planned", "confirmed", "successful", "unsuccessful"]).default("planned"),
  notes: z.string().optional(),
});

export const updateBreedingRecordSchema = createBreedingRecordSchema.partial();
