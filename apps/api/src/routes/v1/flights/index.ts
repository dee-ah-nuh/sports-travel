import type { FastifyInstance } from 'fastify';
import { MOCK_EXPLORE_DESTINATIONS, getMockFlightOffers } from '../../../mock/flights.mock.js';
import { EVENTS_BY_IATA } from '../../../mock/events.mock.js';

export async function flightRoutes(app: FastifyInstance) {
  // GET /api/v1/flights/explore
  app.get('/explore', async (request, reply) => {
    const { origin = 'ORD', dateFrom, dateTo, budget, currency = 'USD' } = request.query as Record<string, string>;

    // Add event counts to each destination
    const destinations = MOCK_EXPLORE_DESTINATIONS.map((dest) => ({
      ...dest,
      eventCount: (EVENTS_BY_IATA[dest.iataCode] ?? []).length,
      events: (EVENTS_BY_IATA[dest.iataCode] ?? []).map((e) => ({
        id: e.id,
        name: e.name,
        sport: e.sport,
        startTime: e.startTime,
        minTicketPrice: e.minTicketPrice,
        currency: e.currency,
      })),
    }));

    return reply.send({
      data: destinations,
      meta: {
        origin,
        dateFrom,
        dateTo,
        currency,
        total: destinations.length,
        cachedAt: new Date().toISOString(),
        source: 'mock',
      },
    });
  });

  // GET /api/v1/flights/search
  app.get('/search', async (request, reply) => {
    const { origin = 'ORD', destination = 'MAD', departureDate = '2026-05-28', adults = '1' } =
      request.query as Record<string, string>;

    const offers = getMockFlightOffers(origin, destination, departureDate);
    return reply.send({ data: offers, meta: { total: offers.length, source: 'mock' } });
  });
}
