# ✈️ Sports Travel Explorer

> Discover and plan trips around sporting events worldwide — Google Flights "Explore" style, but sport-first.

## What it does

- **Explore map/grid**: enter your origin, budget, and sport preferences → see destinations with flight prices + live sporting events overlaid
- **Event details**: click any event card to see full details, ticket price ranges (via StubHub), and venue info
- **Itinerary builder**: generates ranked multi-leg trip options (Cheapest / Fastest / Best) anchored to your target event
- **Mobile app**: same experience in a native Expo/React Native app

## Quick start

```bash
# 1. Clone and bootstrap
git clone <repo>
cd sports_travel
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh

# 2. Start everything
pnpm dev
```

| App | URL |
|-----|-----|
| Web | http://localhost:5173 |
| API | http://localhost:3001 |
| API health | http://localhost:3001/health |
| Mobile (Expo) | `pnpm --filter @sports-travel/mobile dev` → scan QR |

## Project structure

```
sports_travel/
├── apps/
│   ├── web/          React + Vite web app
│   ├── mobile/       Expo (React Native) mobile app
│   └── api/          Fastify REST API
├── packages/
│   ├── types/        Shared Zod schemas + TypeScript types
│   ├── ui/           Shared React component primitives
│   ├── utils/        Pure utilities (date, geo, currency)
│   └── config/       Shared ESLint + TSConfig bases
├── prisma/           Database schema + seed
└── infra/            Docker Compose (Postgres + Redis)
```

## Tech stack

| Layer | Choice |
|-------|--------|
| Monorepo | Turborepo + pnpm workspaces |
| Backend | Fastify + TypeScript |
| ORM | Prisma + PostgreSQL |
| Auth | Supabase Auth |
| Web frontend | React + Vite + React Router v7 |
| Mobile | Expo (managed) + React Native |
| Data fetching | TanStack Query |
| Maps | Mapbox GL JS |
| Caching | Redis L1 + PostgreSQL L2 |
| Validation | Zod (shared API ↔ frontend) |

## Mock mode

The app ships with complete mock data — no API keys needed to run locally.
Set `USE_MOCK_DATA=true` in `.env` (the default) to use it.

To connect real APIs, add keys to `.env` (see `.env.example`):
- **Amadeus** — flights
- **API-Sports** — sports events
- **StubHub** — ticket prices
- **Mapbox** — interactive map

## API endpoints

```
GET  /health
GET  /api/v1/flights/explore      Destination price grid
GET  /api/v1/flights/search       Point-to-point flight search
GET  /api/v1/events               List events
GET  /api/v1/events/by-destination Events by IATA code list
GET  /api/v1/events/:id           Single event
GET  /api/v1/tickets/event/:id/price-summary  StubHub prices
POST /api/v1/itinerary/generate   Generate scored itinerary options
GET  /api/v1/users/me             Current user profile
```

## Development

```bash
pnpm dev              # all apps
pnpm build            # production build
pnpm type-check       # TypeScript check
pnpm lint             # lint all packages
pnpm db:studio        # Prisma Studio (DB GUI)
pnpm db:seed          # re-seed mock data
```

## Docs

- [ARCHITECTURE.md](ARCHITECTURE.md) — high-level design decisions
- [API_INTEGRATIONS.md](API_INTEGRATIONS.md) — external API setup guide
- [ANALYTICS.md](ANALYTICS.md) — event taxonomy
- [.env.example](.env.example) — all environment variables
