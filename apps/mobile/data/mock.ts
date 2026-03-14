export const SPORT_COLORS: Record<string, string> = {
  football: '#22c55e',
  tennis: '#f59e0b',
  formula1: '#ef4444',
  basketball: '#f97316',
  baseball: '#3b82f6',
  rugby: '#8b5cf6',
  golf: '#10b981',
  cycling: '#06b6d4',
  athletics: '#ec4899',
  cricket: '#84cc16',
  other: '#6b7280',
};

export const SPORT_EMOJI: Record<string, string> = {
  football: '⚽',
  tennis: '🎾',
  formula1: '🏎️',
  basketball: '🏀',
  baseball: '⚾',
  rugby: '🏉',
  golf: '⛳',
  cycling: '🚴',
  athletics: '🏃',
  cricket: '🏏',
  other: '🏆',
};

export interface MockEvent {
  id: string;
  name: string;
  sport: string;
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  startTime: string;
  endTime?: string;
  venue: { name: string; city: string; country: string; nearestIata?: string };
  minTicketPrice?: number;
  maxTicketPrice?: number;
  currency?: string;
  ticketUrl?: string;
}

export const MOCK_EVENTS_LIST: MockEvent[] = [
  {
    id: 'evt-ucl-final',
    name: 'UEFA Champions League Final 2026',
    sport: 'football',
    league: 'UEFA Champions League',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    startTime: '2026-05-30T20:00:00Z',
    endTime: '2026-05-30T22:00:00Z',
    venue: { name: 'Wembley Stadium', city: 'London', country: 'UK', nearestIata: 'LHR' },
    minTicketPrice: 250, maxTicketPrice: 2500, currency: '€',
    ticketUrl: 'https://www.stubhub.com',
  },
  {
    id: 'evt-roland-garros',
    name: "Roland Garros 2026 – Men's Semi-Final",
    sport: 'tennis',
    league: 'French Open',
    startTime: '2026-06-05T13:00:00Z',
    venue: { name: 'Roland Garros', city: 'Paris', country: 'France', nearestIata: 'CDG' },
    minTicketPrice: 80, maxTicketPrice: 600, currency: '€',
    ticketUrl: 'https://www.stubhub.com',
  },
  {
    id: 'evt-f1-spain',
    name: 'Formula 1 Spanish Grand Prix 2026',
    sport: 'formula1',
    league: 'Formula 1 World Championship',
    startTime: '2026-06-21T13:00:00Z',
    venue: { name: 'Circuit de Barcelona-Catalunya', city: 'Barcelona', country: 'Spain', nearestIata: 'BCN' },
    minTicketPrice: 150, maxTicketPrice: 1200, currency: '€',
    ticketUrl: 'https://www.stubhub.com',
  },
  {
    id: 'evt-nba-finals',
    name: 'NBA Finals 2026 – Game 1',
    sport: 'basketball',
    league: 'NBA',
    homeTeam: 'Chicago Bulls',
    awayTeam: 'Los Angeles Lakers',
    startTime: '2026-06-06T00:00:00Z',
    venue: { name: 'United Center', city: 'Chicago', country: 'USA', nearestIata: 'ORD' },
    minTicketPrice: 300, maxTicketPrice: 5000, currency: '$',
    ticketUrl: 'https://www.stubhub.com',
  },
  {
    id: 'evt-wimbledon',
    name: "Wimbledon 2026 – Men's Final",
    sport: 'tennis',
    league: 'Wimbledon',
    startTime: '2026-07-13T14:00:00Z',
    venue: { name: 'All England Club', city: 'London', country: 'UK', nearestIata: 'LHR' },
    minTicketPrice: 200, maxTicketPrice: 1800, currency: '£',
    ticketUrl: 'https://www.stubhub.com',
  },
];

export const MOCK_EVENTS_MAP: Record<string, MockEvent> = Object.fromEntries(
  MOCK_EVENTS_LIST.map((e) => [e.id, e]),
);

export const MOCK_DESTINATIONS = [
  {
    iataCode: 'LHR', city: 'London', country: 'United Kingdom', countryCode: 'GB',
    price: 320, currency: 'USD', directFlight: true, minDurationMinutes: 470, airline: 'British Airways',
    eventCount: 2,
    events: [MOCK_EVENTS_LIST[0]!, MOCK_EVENTS_LIST[4]!],
  },
  {
    iataCode: 'CDG', city: 'Paris', country: 'France', countryCode: 'FR',
    price: 350, currency: 'USD', directFlight: true, minDurationMinutes: 490, airline: 'Air France',
    eventCount: 1,
    events: [MOCK_EVENTS_LIST[1]!],
  },
  {
    iataCode: 'BCN', city: 'Barcelona', country: 'Spain', countryCode: 'ES',
    price: 390, currency: 'USD', directFlight: true, minDurationMinutes: 520, airline: 'Vueling',
    eventCount: 1,
    events: [MOCK_EVENTS_LIST[2]!],
  },
  {
    iataCode: 'MAD', city: 'Madrid', country: 'Spain', countryCode: 'ES',
    price: 420, currency: 'USD', directFlight: true, minDurationMinutes: 510, airline: 'Iberia',
    eventCount: 0, events: [],
  },
  {
    iataCode: 'LIS', city: 'Lisbon', country: 'Portugal', countryCode: 'PT',
    price: 380, currency: 'USD', directFlight: true, minDurationMinutes: 500, airline: 'TAP',
    eventCount: 0, events: [],
  },
  {
    iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL',
    price: 410, currency: 'USD', directFlight: false, minDurationMinutes: 550, airline: 'KLM',
    eventCount: 0, events: [],
  },
  {
    iataCode: 'DXB', city: 'Dubai', country: 'UAE', countryCode: 'AE',
    price: 650, currency: 'USD', directFlight: true, minDurationMinutes: 840, airline: 'Emirates',
    eventCount: 0, events: [],
  },
];
