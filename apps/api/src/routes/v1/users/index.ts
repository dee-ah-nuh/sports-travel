import type { FastifyInstance } from 'fastify';

export async function userRoutes(app: FastifyInstance) {
  app.get('/me', async (_request, reply) => {
    // Mock user — replace with Supabase JWT verification
    return reply.send({
      data: {
        id: 'mock-user-1',
        email: 'traveler@example.com',
        displayName: 'Sports Traveler',
        preferences: {
          homeCityIata: 'ORD',
          defaultCurrency: 'USD',
          seatClass: 'economy',
          sportsInterests: ['football', 'tennis', 'formula1'],
          comfortTolerance: 3,
          maxLayovers: 2,
        },
        createdAt: new Date().toISOString(),
      },
    });
  });
}
