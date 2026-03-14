import { z } from 'zod';

export const SeatClassSchema = z.enum(['economy', 'premium_economy', 'business', 'first']);
export type SeatClass = z.infer<typeof SeatClassSchema>;

export const ExploreDestinationSchema = z.object({
  iataCode: z.string().length(3),
  city: z.string(),
  country: z.string(),
  countryCode: z.string().length(2),
  latitude: z.number(),
  longitude: z.number(),
  price: z.number().nonnegative(),
  currency: z.string().default('USD'),
  directFlight: z.boolean(),
  minDurationMinutes: z.number().optional(),
  airline: z.string().optional(),
  departureDateOptions: z.array(z.string()).optional(), // ISO date strings
});
export type ExploreDestination = z.infer<typeof ExploreDestinationSchema>;

export const FlightOfferSchema = z.object({
  id: z.string(),
  origin: z.string().length(3),
  destination: z.string().length(3),
  departureTime: z.string(), // ISO
  arrivalTime: z.string(),
  airline: z.string(),
  flightNumber: z.string(),
  durationMinutes: z.number(),
  stops: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
  currency: z.string(),
  seatClass: SeatClassSchema,
  seatsAvailable: z.number().optional(),
  bookingUrl: z.string().url().optional(),
});
export type FlightOffer = z.infer<typeof FlightOfferSchema>;

export const FlightSearchParamsSchema = z.object({
  origin: z.string().length(3),
  destination: z.string().length(3),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  adults: z.number().int().positive().default(1),
  seatClass: SeatClassSchema.default('economy'),
  currency: z.string().default('USD'),
});
export type FlightSearchParams = z.infer<typeof FlightSearchParamsSchema>;

export const ExploreParamsSchema = z.object({
  origin: z.string().length(3),
  dateFrom: z.string(),
  dateTo: z.string(),
  budget: z.number().positive().optional(),
  seatClass: SeatClassSchema.default('economy'),
  currency: z.string().default('USD'),
  maxStops: z.number().int().nonnegative().optional(),
});
export type ExploreParams = z.infer<typeof ExploreParamsSchema>;
