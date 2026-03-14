import { z } from 'zod';
import { FlightOfferSchema, SeatClassSchema } from './flight.types.js';
import { SportingEventSchema } from './event.types.js';

export const LegTypeSchema = z.enum(['flight', 'train', 'hotel', 'event', 'transfer']);
export type LegType = z.infer<typeof LegTypeSchema>;

export const ItineraryLegSchema = z.object({
  id: z.string(),
  legOrder: z.number().int(),
  type: LegTypeSchema,
  // Transport legs
  originIata: z.string().optional(),
  destinationIata: z.string().optional(),
  originCity: z.string().optional(),
  destinationCity: z.string().optional(),
  carrier: z.string().optional(),
  flightNumber: z.string().optional(),
  departureTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  durationMinutes: z.number().optional(),
  stops: z.number().int().nonnegative().optional(),
  // Cost
  costEstimate: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  bookingUrl: z.string().url().optional(),
  // Event anchor
  event: SportingEventSchema.optional(),
  // Raw provider snapshot
  flightOffer: FlightOfferSchema.optional(),
});
export type ItineraryLeg = z.infer<typeof ItineraryLegSchema>;

export const ItineraryOptionSchema = z.object({
  id: z.string(),
  label: z.enum(['cheapest', 'fastest', 'best']),
  score: z.number().min(0).max(100),
  totalCost: z.number().nonnegative(),
  currency: z.string(),
  totalTravelMinutes: z.number(),
  legs: z.array(ItineraryLegSchema),
  breakdown: z.object({
    flightCost: z.number(),
    trainCost: z.number(),
    hotelCost: z.number(),
    ticketCostEstimate: z.number().optional(),
  }),
  preEventBufferHours: z.number(),
  notes: z.string().optional(),
});
export type ItineraryOption = z.infer<typeof ItineraryOptionSchema>;

export const GenerateItineraryParamsSchema = z.object({
  origin: z.string().length(3),
  eventId: z.string(),
  dateFlexibilityDays: z.number().int().min(0).max(7).default(2),
  budget: z.number().positive(),
  currency: z.string().default('USD'),
  seatClass: SeatClassSchema.default('economy'),
  includeRail: z.boolean().default(false),
  includeHotel: z.boolean().default(false),
  adults: z.number().int().positive().default(1),
});
export type GenerateItineraryParams = z.infer<typeof GenerateItineraryParamsSchema>;

export const SavedItinerarySchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().optional(),
  status: z.enum(['draft', 'saved', 'booked']),
  selectedOption: ItineraryOptionSchema.optional(),
  anchorEventId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type SavedItinerary = z.infer<typeof SavedItinerarySchema>;
