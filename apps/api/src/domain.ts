// Domain models for the Farm Management MVP
// Keep small and extendable – start with Farm, Field, Crop, Task, and SensorReading

export type ID = string;

export interface Farm {
  id: ID;
  name: string;
  location?: string;
  createdAt: string; // ISO date
}

export interface Field {
  id: ID;
  farmId: ID;
  name: string;
  areaHectares: number;
}

export interface Crop {
  id: ID;
  fieldId: ID;
  name: string; // e.g., "Wheat"
  variety?: string;
  season: string; // e.g., "2025"
}

export interface Task {
  id: ID;
  farmId: ID;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  dueDate?: string; // ISO date
}

export interface SensorReading {
  id: ID;
  fieldId: ID;
  type: "soil_moisture" | "temperature" | "humidity";
  value: number;
  unit: string; // e.g., "%", "C"
  recordedAt: string; // ISO date
}

export interface Animal {
  id: ID;
  farmId: ID;
  name: string;
  type: "goat" | "cow" | "sheep" | "pig" | "horse" | "chicken";
  breed?: string;
  gender: "male" | "female";
  birthDate?: string; // ISO date
  parentMaleId?: ID; // Reference to father
  parentFemaleId?: ID; // Reference to mother
  registrationNumber?: string;
  notes?: string;
  status?: "open" | "bred" | "pregnant" | "fresh" | "dry"; // livestock lifecycle shorthand (esp. goats/cows)
  createdAt: string; // ISO date
}

export interface BreedingRecord {
  id: ID;
  farmId: ID;
  maleAnimalId: ID;
  femaleAnimalId: ID;
  breedingDate: string; // ISO date
  expectedDueDate?: string; // ISO date
  actualBirthDate?: string; // ISO date
  offspring?: ID[]; // Array of animal IDs born from this breeding
  status: "planned" | "confirmed" | "successful" | "unsuccessful";
  notes?: string;
  createdAt: string; // ISO date
}

// Simple helpers
export function nowIso(): string {
  return new Date().toISOString();
}
