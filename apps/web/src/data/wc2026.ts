// ── Raw JSON types (match mock_data.json structure) ──────────────────────────

interface WCVenueSrc {
  venue_id: string;
  city: string;
  state_province?: string;
  country: string;
  country_code: string;
  stadium_name: string;
  capacity: number;
  lat: number;
  lng: number;
  nearby_airports: { iata: string; distance_mi: number }[];
}

interface WCMatchSrc {
  match_id: string;
  date: string;       // "2026-06-11"
  kickoff_et: string; // "15:00"
  stage: string;
  group?: string;
  team1: string;
  team2: string;
  venue_id: string;
}

interface WCDataSrc {
  meta: { tournament: string; dates: { start: string; end: string } };
  venues: WCVenueSrc[];
  matches: WCMatchSrc[];
  airports: { iata: string; name: string; city: string; lat: number; lng: number }[];
}

// ── Derived UI types ──────────────────────────────────────────────────────────

export interface WCEvent {
  id: string;
  name: string;
  sport: 'football';
  startTime: string;  // ISO
  stage: string;
  group?: string;
  team1: string;
  team2: string;
  venueId: string;
  minTicketPrice: number;
  currency: string;
}

export interface WCDestination {
  venueId: string;
  iataCode: string;        // primary airport
  allAirports: string[];   // all nearby airports
  city: string;
  state: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  stadiumName: string;
  capacity: number;
  events: WCEvent[];
  eventCount: number;
  // Populated by flight data (starts at 0 until flights load)
  price: number;
  currency: string;
  directFlight: boolean;
  minDurationMinutes: number;
  airline: string;
  connectingAirport?: string;
}

// ── Singleton fetch ───────────────────────────────────────────────────────────

let _wcData: WCDataSrc | null = null;
let _wcPromise: Promise<WCDataSrc> | null = null;

export async function fetchWCData(): Promise<WCDataSrc> {
  if (_wcData) return _wcData;
  if (!_wcPromise) {
    _wcPromise = fetch('/data/wc2026.json').then((r) => r.json() as Promise<WCDataSrc>);
    _wcPromise.then((d) => { _wcData = d; });
  }
  return _wcPromise;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function estimateTicketPrice(stage: string): number {
  const map: Record<string, number> = {
    'Group Stage': 85,
    'Round of 32': 120,
    'Round of 16': 180,
    Quarterfinal: 350,
    Semifinal: 600,
    'Third Place': 200,
    Final: 1200,
  };
  return map[stage] ?? 100;
}

// ── Main builder ──────────────────────────────────────────────────────────────

export function buildDestinations(data: WCDataSrc): WCDestination[] {
  const matchesByVenue = new Map<string, WCMatchSrc[]>();
  for (const m of data.matches) {
    const arr = matchesByVenue.get(m.venue_id) ?? [];
    arr.push(m);
    matchesByVenue.set(m.venue_id, arr);
  }

  return data.venues.map((v) => {
    const matches = (matchesByVenue.get(v.venue_id) ?? []).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    const primary = v.nearby_airports[0]?.iata ?? 'XXX';

    const events: WCEvent[] = matches.map((m): WCEvent => {
      const ev: WCEvent = {
        id: m.match_id,
        name: `${m.team1} vs ${m.team2}`,
        sport: 'football',
        startTime: `${m.date}T${m.kickoff_et}:00`,
        stage: m.stage,
        team1: m.team1,
        team2: m.team2,
        venueId: v.venue_id,
        minTicketPrice: estimateTicketPrice(m.stage),
        currency: 'USD',
      };
      if (m.group !== undefined) ev.group = m.group;
      return ev;
    });

    return {
      venueId: v.venue_id,
      iataCode: primary,
      allAirports: v.nearby_airports.map((a) => a.iata),
      city: v.city,
      state: v.state_province ?? '',
      country: v.country,
      countryCode: v.country_code,
      latitude: v.lat,
      longitude: v.lng,
      stadiumName: v.stadium_name,
      capacity: v.capacity,
      events,
      eventCount: events.length,
      price: 0,
      currency: 'USD',
      directFlight: false,
      minDurationMinutes: 0,
      airline: '',
    };
  });
}
