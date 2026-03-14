import { z } from 'zod';

export const TicketListingSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  section: z.string().optional(),
  row: z.string().optional(),
  quantity: z.number().int().positive(),
  pricePerTicket: z.number().nonnegative(),
  currency: z.string(),
  ticketUrl: z.string().url(),
  seller: z.string().optional(),
  deliveryMethod: z.enum(['mobile', 'pdf', 'physical']).optional(),
});
export type TicketListing = z.infer<typeof TicketListingSchema>;

export const TicketPriceSummarySchema = z.object({
  eventId: z.string(),
  eventName: z.string(),
  minPrice: z.number().nonnegative(),
  maxPrice: z.number().nonnegative(),
  medianPrice: z.number().nonnegative(),
  currency: z.string(),
  listingsAvailable: z.number().int(),
  ticketUrl: z.string().url(),
  source: z.string().default('stubhub'),
  cachedAt: z.string(),
});
export type TicketPriceSummary = z.infer<typeof TicketPriceSummarySchema>;
