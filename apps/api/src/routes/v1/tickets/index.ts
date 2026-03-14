import type { FastifyInstance } from 'fastify';
import { MOCK_EVENTS } from '../../../mock/events.mock.js';

export async function ticketRoutes(app: FastifyInstance) {
  app.get('/event/:eventId/price-summary', async (request, reply) => {
    const { eventId } = request.params as { eventId: string };
    const event = MOCK_EVENTS.find((e) => e.id === eventId);
    if (!event) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Event not found' } });

    const min = event.minTicketPrice ?? 0;
    const max = event.maxTicketPrice ?? 0;
    return reply.send({
      data: {
        eventId,
        eventName: event.name,
        minPrice: min,
        maxPrice: max,
        medianPrice: Math.round((min + max) / 2),
        currency: event.currency ?? 'USD',
        listingsAvailable: Math.floor(Math.random() * 200) + 10,
        ticketUrl: event.ticketUrl ?? 'https://www.stubhub.com',
        source: 'mock',
        cachedAt: new Date().toISOString(),
      },
    });
  });
}
