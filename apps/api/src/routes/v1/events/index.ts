import type { FastifyInstance } from 'fastify';
import { MOCK_EVENTS, EVENTS_BY_IATA } from '../../../mock/events.mock.js';

export async function eventRoutes(app: FastifyInstance) {
  // GET /api/v1/events
  app.get('/', async (request, reply) => {
    const { sport, from, to } = request.query as Record<string, string>;
    let events = MOCK_EVENTS;
    if (sport) events = events.filter((e) => e.sport === sport);
    if (from) events = events.filter((e) => e.startTime >= from);
    if (to) events = events.filter((e) => e.startTime <= to);
    return reply.send({ data: events, meta: { total: events.length, source: 'mock' } });
  });

  // GET /api/v1/events/by-destination
  app.get('/by-destination', async (request, reply) => {
    const { iataCodes = '', sport } = request.query as Record<string, string>;
    const codes = iataCodes.split(',').filter(Boolean);
    const result = codes.map((iata) => {
      let events = EVENTS_BY_IATA[iata] ?? [];
      if (sport) events = events.filter((e) => e.sport === sport);
      return {
        iataCode: iata,
        events: events.map((e) => ({
          id: e.id,
          name: e.name,
          sport: e.sport,
          league: e.league,
          startTime: e.startTime,
          minTicketPrice: e.minTicketPrice,
          currency: e.currency,
          popularity: e.popularity,
          venueName: e.venue.name,
          venueCity: e.venue.city,
          venueIata: e.venue.nearestIata,
        })),
        eventCount: events.length,
        topSports: [...new Set(events.map((e) => e.sport))],
      };
    });
    return reply.send({ data: result, meta: { source: 'mock' } });
  });

  // GET /api/v1/events/:id
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const event = MOCK_EVENTS.find((e) => e.id === id);
    if (!event) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Event not found' } });
    return reply.send({ data: event });
  });
}
