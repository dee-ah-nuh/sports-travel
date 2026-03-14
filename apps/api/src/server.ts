import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config.js';
import { registerRoutes } from './routes/index.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.NODE_ENV === 'production' ? 'info' : 'debug',
      transport:
        config.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'requestId',
  });

  // ── Security ──────────────────────────────────────────────────────────────
  await app.register(helmet, { contentSecurityPolicy: false });

  await app.register(cors, {
    origin: config.CORS_ORIGIN.split(','),
    credentials: true,
  });

  await app.register(rateLimit, {
    global: true,
    max: 200,
    timeWindow: '1 minute',
    skipOnError: true,
  });

  // ── Routes ────────────────────────────────────────────────────────────────
  await registerRoutes(app);

  // ── Root ──────────────────────────────────────────────────────────────────
  app.get('/', async () => ({
    name: 'Sports Travel API',
    version: '0.0.1',
    web: 'http://localhost:5173',
    docs: {
      health: '/health',
      events: '/api/v1/events',
      explore: '/api/v1/flights/explore',
      tickets: '/api/v1/tickets/event/:eventId/price-summary',
    },
  }));

  // ── Health check ──────────────────────────────────────────────────────────
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.0.1',
    env: config.NODE_ENV,
    mockData: config.USE_MOCK_DATA,
  }));

  return app;
}

async function start() {
  const app = await buildApp();
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    app.log.info(`🚀 API running at http://${config.HOST}:${config.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
