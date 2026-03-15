import type { WCDestination } from './wc2026.js';

// ── Live API config ───────────────────────────────────────────────────────────
// Set VITE_FLIGHT_API_URL in .env to point at the Sports Travel flight server.
// Falls back to mock data if the env var is not set or the server is unreachable.
const FLIGHT_API_URL = (import.meta.env.VITE_FLIGHT_API_URL as string | undefined) ?? '';

// ── Raw flight type (matches wc2026_flights.json) ─────────────────────────────

export interface RawFlight {
  flight_number: string;
  airline: string;
  airline_code: string;
  direction: 'inbound' | 'outbound';
  origin: string;
  destination: string;
  venue_id: string;
  airport_type: 'primary' | 'secondary';
  date: string;
  departure_time: string;
  arrival_time: string;
  duration_min: number;
}

// ── UI types ──────────────────────────────────────────────────────────────────

export interface FlightLeg {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  durationMin: number;
  synthesized?: boolean; // true for generated connecting legs
}

export interface FlightResult {
  id: string;
  direct: boolean;
  totalDurationMin: number;
  price: number;
  legs: FlightLeg[];
  connectingAirport?: string;
  date: string;
}

// ── Singleton fetch (6.4 MB — cached after first load) ────────────────────────

let _flightsCache: RawFlight[] | null = null;
let _flightsPromise: Promise<{ flights: RawFlight[] }> | null = null;

export async function fetchFlights(): Promise<RawFlight[]> {
  if (_flightsCache) return _flightsCache;
  if (!_flightsPromise) {
    _flightsPromise = fetch('/data/wc2026_flights.json').then(
      (r) => r.json() as Promise<{ flights: RawFlight[] }>,
    );
    _flightsPromise.then((d) => { _flightsCache = d.flights; });
  }
  const data = await _flightsPromise;
  return data.flights;
}

// ── Deterministic price from flight number (stable across renders) ────────────

function hashPrice(seed: string, min: number, max: number): number {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return min + (h % (max - min));
}

// ── Time helpers ──────────────────────────────────────────────────────────────

function timeToMins(t: string): number {
  const parts = t.split(':');
  return Number(parts[0] ?? 0) * 60 + Number(parts[1] ?? 0);
}

function minsToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// ── Estimate leg1 duration based on airport geography ────────────────────────

const INTL_AIRPORTS = new Set([
  'LHR', 'CDG', 'FRA', 'AMS', 'MAD', 'DXB', 'ICN', 'NRT', 'GRU', 'BOG',
  'YUL', 'YYC', 'SYD',
]);

function estimateLeg1Duration(from: string, to: string): number {
  if (INTL_AIRPORTS.has(from) || INTL_AIRPORTS.has(to)) return 480; // ~8h intl
  return 150; // ~2.5h domestic US/Canada
}

// ── Apply cheapest flight prices to all destinations ─────────────────────────

export function applyFlightPrices(
  destinations: WCDestination[],
  flights: RawFlight[],
  originIata: string,
): WCDestination[] {
  // Index inbound flights by venue_id for O(1) lookup
  const byVenue = new Map<string, RawFlight[]>();
  for (const f of flights) {
    if (f.direction !== 'inbound') continue;
    const arr = byVenue.get(f.venue_id) ?? [];
    arr.push(f);
    byVenue.set(f.venue_id, arr);
  }

  return destinations.map((dest): WCDestination => {
    const vFlights = byVenue.get(dest.venueId) ?? [];
    if (vFlights.length === 0) return dest;

    const direct = vFlights.filter((f) => f.origin === originIata);

    if (direct.length > 0) {
      const best = direct.reduce((a, b) => (a.duration_min < b.duration_min ? a : b));
      const d: WCDestination = {
        ...dest,
        price: hashPrice(best.flight_number, 180, 480),
        directFlight: true,
        minDurationMinutes: best.duration_min,
        airline: best.airline,
      };
      return d;
    }

    const hub = vFlights[0];
    if (!hub) return dest;
    const leg1Duration = estimateLeg1Duration(originIata, hub.origin);

    return {
      ...dest,
      price: hashPrice(hub.flight_number + originIata, 130, 380),
      directFlight: false,
      minDurationMinutes: leg1Duration + 90 + hub.duration_min,
      airline: hub.airline,
      connectingAirport: hub.origin,
    };
  });
}

// ── Live API: normalise fli response into FlightResult[] ─────────────────────

interface LiveLeg {
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  duration: number; // minutes
  airline: string;
  flight_number: string;
}

interface LiveFlight {
  price: number;
  currency: string;
  legs: LiveLeg[];
}

function normalizeLiveFlight(f: LiveFlight, date: string, idx: number): FlightResult {
  const legs: FlightLeg[] = f.legs.map((l) => ({
    flightNumber: l.flight_number,
    airline: l.airline,
    airlineCode: l.flight_number.replace(/\d/g, '').slice(0, 2),
    origin: l.departure_airport,
    destination: l.arrival_airport,
    date,
    departureTime: l.departure_time,
    arrivalTime: l.arrival_time,
    durationMin: l.duration,
  }));

  const totalDurationMin = legs.reduce((s, l) => s + l.durationMin, 0);
  const direct = legs.length === 1;
  const connectingAirport = !direct ? legs[0]?.destination : undefined;

  const result: FlightResult = {
    id: `live-${date}-${idx}`,
    direct,
    totalDurationMin,
    price: f.price,
    legs,
    date,
  };
  if (connectingAirport) result.connectingAirport = connectingAirport;
  return result;
}

async function searchFlightsLive(
  originIata: string,
  destinationIata: string,
  date: string,
): Promise<FlightResult[] | null> {
  if (!FLIGHT_API_URL) return null;
  try {
    const url = `${FLIGHT_API_URL}/flights?origin=${originIata}&destination=${destinationIata}&date=${date}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { success: boolean; flights: LiveFlight[] };
    if (!data.success || !data.flights.length) return null;
    return data.flights.map((f, i) => normalizeLiveFlight(f, date, i));
  } catch {
    return null; // server unreachable — fall through to mock
  }
}

// ── Full flight search for a venue (used in the panel detail view) ────────────

export async function searchFlights(
  originIata: string,
  venueId: string,
  dateFrom: string,
  dateTo: string,
  destinationIata?: string, // primary airport — used for live API lookup
): Promise<FlightResult[]> {
  // ── Try live API first (if VITE_FLIGHT_API_URL is set) ──────────────────
  if (FLIGHT_API_URL && destinationIata) {
    const liveResults: FlightResult[] = [];
    // Search around the dateFrom date (key match day ± 1 day)
    const dates = generateDateRange(dateFrom, dateTo, 5); // up to 5 representative dates
    const settled = await Promise.allSettled(
      dates.map((d) => searchFlightsLive(originIata, destinationIata, d)),
    );
    for (const r of settled) {
      if (r.status === 'fulfilled' && r.value) liveResults.push(...r.value);
    }
    if (liveResults.length > 0) {
      return liveResults.sort((a, b) => a.date.localeCompare(b.date) || a.price - b.price);
    }
    // Live API returned nothing — fall through to mock
  }

  const flights = await fetchFlights();

  // All inbound flights for this venue in the date window
  const vFlights = flights.filter(
    (f) =>
      f.direction === 'inbound' &&
      f.venue_id === venueId &&
      f.date >= dateFrom &&
      f.date <= dateTo,
  );

  // Group by date
  const byDate = new Map<string, RawFlight[]>();
  for (const f of vFlights) {
    const arr = byDate.get(f.date) ?? [];
    arr.push(f);
    byDate.set(f.date, arr);
  }

  const results: FlightResult[] = [];
  // Cap at 21 days to keep results manageable
  const dates = [...byDate.keys()].sort().slice(0, 21);

  for (const date of dates) {
    const dayFlights = byDate.get(date) ?? [];
    const direct = dayFlights.filter((f) => f.origin === originIata);

    if (direct.length > 0) {
      // Up to 3 direct options per date
      for (const f of direct.slice(0, 3)) {
        results.push({
          id: `direct-${f.flight_number}-${date}`,
          direct: true,
          totalDurationMin: f.duration_min,
          price: hashPrice(f.flight_number, 180, 480),
          legs: [toLeg(f)],
          date,
        });
      }
    } else {
      // Connecting: try up to 3 hub airports that serve this venue
      const hubs = [...new Set(dayFlights.map((f) => f.origin))].slice(0, 3);

      for (const hub of hubs) {
        const leg2 = dayFlights.find((f) => f.origin === hub);
        if (!leg2) continue;

        const leg1Duration = estimateLeg1Duration(originIata, hub);
        const leg2Depart = timeToMins(leg2.departure_time);
        const minLayover = 90;

        // Leg1 arrives at hub ≥ 90 min before leg2 departs
        const leg1Arrive = leg2Depart - minLayover;
        const leg1Depart = leg1Arrive - leg1Duration;

        if (leg1Depart < 0) continue; // would depart before midnight, skip

        const layoverMins = leg2Depart - leg1Arrive;
        const leg1: FlightLeg = {
          flightNumber: `XX${hashPrice(originIata + hub + date, 1000, 9999)}`,
          airline: 'Connecting',
          airlineCode: 'XX',
          origin: originIata,
          destination: hub,
          date,
          departureTime: minsToTime(leg1Depart),
          arrivalTime: minsToTime(leg1Arrive),
          durationMin: leg1Duration,
          synthesized: true,
        };

        results.push({
          id: `connect-${originIata}-${hub}-${leg2.flight_number}-${date}`,
          direct: false,
          totalDurationMin: leg1Duration + layoverMins + leg2.duration_min,
          price: hashPrice(leg2.flight_number + originIata, 130, 380),
          legs: [leg1, toLeg(leg2)],
          connectingAirport: hub,
          date,
        });
      }
    }
  }

  return results.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.price - b.price;
  });
}

// Pick up to `max` evenly-spaced dates within the window (always includes first)
function generateDateRange(from: string, to: string, max: number): string[] {
  const start = new Date(from);
  const end = new Date(to);
  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000);
  const step = Math.max(1, Math.floor(totalDays / (max - 1)));
  const dates: string[] = [];
  for (let i = 0; i <= totalDays && dates.length < max; i += step) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function toLeg(f: RawFlight): FlightLeg {
  return {
    flightNumber: f.flight_number,
    airline: f.airline,
    airlineCode: f.airline_code,
    origin: f.origin,
    destination: f.destination,
    date: f.date,
    departureTime: f.departure_time,
    arrivalTime: f.arrival_time,
    durationMin: f.duration_min,
  };
}
