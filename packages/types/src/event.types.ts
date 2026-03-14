import { z } from 'zod';

export const SportSchema = z.enum([
  'football',
  'basketball',
  'tennis',
  'formula1',
  'baseball',
  'cricket',
  'rugby',
  'golf',
  'cycling',
  'athletics',
  'other',
]);
export type Sport = z.infer<typeof SportSchema>;

export const SportingEventSchema = z.object({
  id: z.string(),
  externalId: z.string().optional(),
  externalSource: z.string().optional(), // 'api-sports' | 'stubhub'
  name: z.string(),
  sport: SportSchema,
  league: z.string().optional(),
  homeTeam: z.string().optional(),
  awayTeam: z.string().optional(),
  startTime: z.string(), // ISO
  endTime: z.string().optional(),
  venue: z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    country: z.string(),
    countryCode: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    nearestIata: z.string().optional(),
  }),
  minTicketPrice: z.number().nonnegative().optional(),
  maxTicketPrice: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  ticketUrl: z.string().url().optional(),
  popularity: z.number().int().nonnegative().default(0),
});
export type SportingEvent = z.infer<typeof SportingEventSchema>;

export const EventSummarySchema = SportingEventSchema.pick({
  id: true,
  name: true,
  sport: true,
  league: true,
  startTime: true,
  minTicketPrice: true,
  currency: true,
  popularity: true,
}).extend({
  venueName: z.string(),
  venueCity: z.string(),
  venueIata: z.string().optional(),
});
export type EventSummary = z.infer<typeof EventSummarySchema>;

export const DestinationWithEventsSchema = z.object({
  iataCode: z.string(),
  city: z.string(),
  events: z.array(EventSummarySchema),
  eventCount: z.number().int(),
  topSports: z.array(SportSchema),
});
export type DestinationWithEvents = z.infer<typeof DestinationWithEventsSchema>;
