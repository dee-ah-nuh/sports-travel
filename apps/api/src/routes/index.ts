// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFastify = import('fastify').FastifyInstance<any, any, any, any, any>;
import { flightRoutes } from './v1/flights/index.js';
import { eventRoutes } from './v1/events/index.js';
import { ticketRoutes } from './v1/tickets/index.js';
import { itineraryRoutes } from './v1/itinerary/index.js';
import { userRoutes } from './v1/users/index.js';

export async function registerRoutes(app: AnyFastify) {
  app.register(flightRoutes, { prefix: '/api/v1/flights' });
  app.register(eventRoutes, { prefix: '/api/v1/events' });
  app.register(ticketRoutes, { prefix: '/api/v1/tickets' });
  app.register(itineraryRoutes, { prefix: '/api/v1/itinerary' });
  app.register(userRoutes, { prefix: '/api/v1/users' });
}
