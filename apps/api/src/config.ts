import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DATABASE_URL: z.string().default('postgresql://sports_travel:dev_password_change_in_prod@localhost:5432/sports_travel_dev'),

  // Redis
  REDIS_URL: z.string().default('redis://:dev_redis_password@localhost:6379'),

  // Supabase (optional for dev)
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // External APIs (optional — fall back to mock data)
  AMADEUS_API_KEY: z.string().optional(),
  AMADEUS_API_SECRET: z.string().optional(),
  AMADEUS_ENV: z.enum(['test', 'production']).default('test'),

  API_SPORTS_KEY: z.string().optional(),

  STUBHUB_CLIENT_ID: z.string().optional(),
  STUBHUB_CLIENT_SECRET: z.string().optional(),

  MAPBOX_SECRET_TOKEN: z.string().optional(),

  // Feature flags
  USE_MOCK_DATA: z.coerce.boolean().default(true),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

export type Config = z.infer<typeof envSchema>;

// Parse once at startup — throws if env is invalid
export const config = envSchema.parse(process.env);
