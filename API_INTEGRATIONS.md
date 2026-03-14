# API Integrations

## Flights — Amadeus

- **Docs**: https://developers.amadeus.com/self-service/category/air
- **Key endpoint**: Flight Offers Search (`/shopping/flight-offers`)
- **Sandbox**: available, request `AMADEUS_ENV=test`
- **Rate limit**: 2,000 calls/month on free tier; cache aggressively
- **Env vars**: `AMADEUS_API_KEY`, `AMADEUS_API_SECRET`

The `/api/v1/flights/explore` endpoint calls Amadeus in batch for a list of destinations and caches results in Redis for 15 minutes.

## Sports Events — API-Sports

- **Docs**: https://api-sports.io/documentation/football/v3
- **Coverage**: Football, Basketball, Tennis, F1, Baseball, Rugby, and more
- **Rate limit**: 100 calls/day on free tier; use background refresh job
- **Env vars**: `API_SPORTS_KEY`

Events are refreshed every 6 hours via a background cron job and stored in the `events` table with a TTL (`expires_at`).

## Ticket Marketplace — StubHub Catalog API

- **Docs**: https://developer.stubhub.com/api-reference/catalog/
- **Auth**: OAuth 2.0 client credentials
- **Scopes**: `read:events`, `read:listings`
- **Rate limit**: varies by plan; cache ticket summaries for 5 minutes
- **Env vars**: `STUBHUB_CLIENT_ID`, `STUBHUB_CLIENT_SECRET`

The service **never handles payments**. It returns deep-link URLs to StubHub for checkout.
External event IDs from StubHub are stored in `events.external_id` with `events.external_source = 'stubhub'`.

## Maps — Mapbox

- **Docs**: https://docs.mapbox.com/mapbox-gl-js/
- **Pricing**: free up to 50,000 map loads/month
- **Env vars**: `VITE_MAPBOX_TOKEN` (public token for web), `MAPBOX_SECRET_TOKEN` (server-side)

## Optional — Rail — Trainline / Amadeus Rail

- **Trainline Partner API**: contact for access
- **Amadeus Train Offers**: part of Amadeus Ground & Rail
- Used for European last-mile legs (e.g., Lisbon → Madrid by train)
- Only enabled when `includeRail=true` in itinerary generation
