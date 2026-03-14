import { z } from 'zod';
import { SeatClassSchema } from './flight.types.js';
import { SportSchema } from './event.types.js';

export const UserPreferencesSchema = z.object({
  homeCityIata: z.string().length(3).optional(),
  defaultCurrency: z.string().default('USD'),
  budgetMax: z.number().positive().optional(),
  seatClass: SeatClassSchema.default('economy'),
  sportsInterests: z.array(SportSchema).default([]),
  comfortTolerance: z.number().int().min(1).max(5).default(3),
  maxLayovers: z.number().int().min(0).max(3).default(2),
});
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  preferences: UserPreferencesSchema,
  createdAt: z.string(),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;
