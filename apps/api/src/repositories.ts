// In-memory repositories with a minimal interface to allow swapping to a DB later.
// Each repository implements basic CRUD using a Map. IDs are generated with crypto.

import { randomUUID } from 'node:crypto';
import { Farm, Field, Crop, Task, SensorReading, Animal, BreedingRecord, ID, nowIso } from './domain.js';

export interface Repository<T extends { id: ID }> {
  list(): Promise<T[]>;
  get(id: ID): Promise<T | undefined>;
  create(input: Omit<T, 'id'> & Partial<Pick<T, 'id'>>): Promise<T>;
  update(id: ID, patch: Partial<Omit<T, 'id'>>): Promise<T | undefined>;
  delete(id: ID): Promise<boolean>;
}

function createMemoryRepo<T extends { id: ID }>(seed: T[] = []): Repository<T> {
  const store = new Map<ID, T>(seed.map((e) => [e.id, e]));
  return {
    async list() {
      return [...store.values()];
    },
    async get(id) {
      return store.get(id);
    },
    async create(input) {
      const id = (input.id && String(input.id)) || randomUUID();
      const entity = { ...input, id } as T;
      store.set(id, entity);
      return entity;
    },
    async update(id, patch) {
      const cur = store.get(id);
      if (!cur) return undefined;
      const next = { ...cur, ...patch } as T;
      store.set(id, next);
      return next;
    },
    async delete(id) {
      return store.delete(id);
    },
  };
}

// Seed minimal demo data
const farmA: Farm = { id: 'farm-1', name: 'Sunrise Farm', location: 'Valley', createdAt: nowIso() };
const fieldA: Field = { id: 'field-1', farmId: farmA.id, name: 'North Field', areaHectares: 12.5 };
const cropA: Crop = { id: 'crop-1', fieldId: fieldA.id, name: 'Wheat', season: '2025' };
const taskA: Task = { id: 'task-1', farmId: farmA.id, title: 'Irrigation', status: 'todo' };
const readingA: SensorReading = { id: 'reading-1', fieldId: fieldA.id, type: 'soil_moisture', value: 22.4, unit: '%', recordedAt: nowIso() };

// Seed demo livestock data
const animalA: Animal = { 
  id: 'animal-1', 
  farmId: farmA.id, 
  name: 'Daisy', 
  type: 'goat', 
  breed: 'Nubian', 
  gender: 'female', 
  birthDate: '2022-03-15T00:00:00.000Z',
  registrationNumber: 'NG-001',
  createdAt: nowIso() 
};
const animalB: Animal = { 
  id: 'animal-2', 
  farmId: farmA.id, 
  name: 'Buck', 
  type: 'goat', 
  breed: 'Nubian', 
  gender: 'male', 
  birthDate: '2021-05-20T00:00:00.000Z',
  registrationNumber: 'NG-002',
  createdAt: nowIso() 
};
const breedingA: BreedingRecord = {
  id: 'breeding-1',
  farmId: farmA.id,
  maleAnimalId: animalB.id,
  femaleAnimalId: animalA.id,
  breedingDate: '2024-08-15T00:00:00.000Z',
  expectedDueDate: '2025-01-12T00:00:00.000Z',
  status: 'confirmed',
  notes: 'First breeding for Daisy',
  createdAt: nowIso()
};

export const repos = {
  farms: createMemoryRepo<Farm>([farmA]),
  fields: createMemoryRepo<Field>([fieldA]),
  crops: createMemoryRepo<Crop>([cropA]),
  tasks: createMemoryRepo<Task>([taskA]),
  readings: createMemoryRepo<SensorReading>([readingA]),
  animals: createMemoryRepo<Animal>([animalA, animalB]),
  breedings: createMemoryRepo<BreedingRecord>([breedingA]),
};
