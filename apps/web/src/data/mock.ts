// All mock data lives here — swap for real API calls later

export interface MockEvent {
  id: string;
  name: string;
  sport: string;
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  startTime: string;
  endTime?: string;
  venue: { name: string; city: string; country: string; countryCode: string; nearestIata?: string };
  minTicketPrice?: number;
  maxTicketPrice?: number;
  currency?: string;
  ticketUrl?: string;
  popularity?: number;
}

export const MOCK_DESTINATIONS = [
  { iataCode: 'LHR', city: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278, price: 320, currency: 'USD', directFlight: true, minDurationMinutes: 470, airline: 'British Airways', eventCount: 2, events: [
    { id: 'evt-ucl-final', name: 'UEFA Champions League Final 2026', sport: 'football', startTime: '2026-05-30T20:00:00Z', minTicketPrice: 250, currency: 'EUR' },
    { id: 'evt-wimbledon', name: "Wimbledon 2026 – Men's Final", sport: 'tennis', startTime: '2026-07-13T14:00:00Z', minTicketPrice: 200, currency: 'GBP' },
  ]},
  { iataCode: 'CDG', city: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522, price: 350, currency: 'USD', directFlight: true, minDurationMinutes: 490, airline: 'Air France', eventCount: 1, events: [
    { id: 'evt-roland-garros', name: "Roland Garros 2026 – Men's Semi-Final", sport: 'tennis', startTime: '2026-06-05T13:00:00Z', minTicketPrice: 80, currency: 'EUR' },
  ]},
  { iataCode: 'BCN', city: 'Barcelona', country: 'Spain', countryCode: 'ES', latitude: 41.3851, longitude: 2.1734, price: 390, currency: 'USD', directFlight: true, minDurationMinutes: 520, airline: 'Vueling', eventCount: 1, events: [
    { id: 'evt-f1-spain', name: 'Formula 1 Spanish Grand Prix 2026', sport: 'formula1', startTime: '2026-06-21T13:00:00Z', minTicketPrice: 150, currency: 'EUR' },
  ]},
  { iataCode: 'MAD', city: 'Madrid', country: 'Spain', countryCode: 'ES', latitude: 40.4168, longitude: -3.7038, price: 420, currency: 'USD', directFlight: true, minDurationMinutes: 510, airline: 'Iberia', eventCount: 0, events: [] },
  { iataCode: 'LIS', city: 'Lisbon', country: 'Portugal', countryCode: 'PT', latitude: 38.7223, longitude: -9.1393, price: 380, currency: 'USD', directFlight: true, minDurationMinutes: 500, airline: 'TAP', eventCount: 0, events: [] },
  { iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', latitude: 52.3676, longitude: 4.9041, price: 410, currency: 'USD', directFlight: false, minDurationMinutes: 550, airline: 'KLM', eventCount: 0, events: [] },
  { iataCode: 'MUC', city: 'Munich', country: 'Germany', countryCode: 'DE', latitude: 48.1351, longitude: 11.5820, price: 440, currency: 'USD', directFlight: false, minDurationMinutes: 570, airline: 'Lufthansa', eventCount: 0, events: [] },
  { iataCode: 'FCO', city: 'Rome', country: 'Italy', countryCode: 'IT', latitude: 41.9028, longitude: 12.4964, price: 460, currency: 'USD', directFlight: false, minDurationMinutes: 560, airline: 'Alitalia', eventCount: 0, events: [] },
  { iataCode: 'DXB', city: 'Dubai', country: 'UAE', countryCode: 'AE', latitude: 25.2048, longitude: 55.2708, price: 650, currency: 'USD', directFlight: true, minDurationMinutes: 840, airline: 'Emirates', eventCount: 0, events: [] },
  { iataCode: 'ORD', city: 'Chicago', country: 'United States', countryCode: 'US', latitude: 41.8781, longitude: -87.6298, price: 0, currency: 'USD', directFlight: true, minDurationMinutes: 0, airline: '', eventCount: 1, events: [
    { id: 'evt-nba-finals', name: 'NBA Finals 2026 – Game 1', sport: 'basketball', startTime: '2026-06-06T00:00:00Z', minTicketPrice: 300, currency: 'USD' },
  ]},
];

export const MOCK_EVENTS = {
  'evt-ucl-final': {
    id: 'evt-ucl-final', name: 'UEFA Champions League Final 2026', sport: 'football', league: 'UEFA Champions League',
    homeTeam: 'Real Madrid', awayTeam: 'Manchester City', startTime: '2026-05-30T20:00:00Z', endTime: '2026-05-30T22:00:00Z',
    venue: { name: 'Wembley Stadium', city: 'London', country: 'United Kingdom', countryCode: 'GB', nearestIata: 'LHR' },
    minTicketPrice: 250, maxTicketPrice: 2500, currency: 'EUR', ticketUrl: 'https://www.stubhub.com', popularity: 100,
  },
  'evt-roland-garros': {
    id: 'evt-roland-garros', name: "Roland Garros 2026 – Men's Semi-Final", sport: 'tennis', league: 'French Open',
    startTime: '2026-06-05T13:00:00Z', endTime: '2026-06-05T18:00:00Z',
    venue: { name: 'Roland Garros', city: 'Paris', country: 'France', countryCode: 'FR', nearestIata: 'CDG' },
    minTicketPrice: 80, maxTicketPrice: 600, currency: 'EUR', ticketUrl: 'https://www.stubhub.com', popularity: 85,
  },
  'evt-f1-spain': {
    id: 'evt-f1-spain', name: 'Formula 1 Spanish Grand Prix 2026', sport: 'formula1', league: 'F1 World Championship',
    startTime: '2026-06-21T13:00:00Z', endTime: '2026-06-21T15:30:00Z',
    venue: { name: 'Circuit de Barcelona-Catalunya', city: 'Barcelona', country: 'Spain', countryCode: 'ES', nearestIata: 'BCN' },
    minTicketPrice: 150, maxTicketPrice: 1200, currency: 'EUR', ticketUrl: 'https://www.stubhub.com', popularity: 95,
  },
  'evt-nba-finals': {
    id: 'evt-nba-finals', name: 'NBA Finals 2026 – Game 1', sport: 'basketball', league: 'NBA',
    homeTeam: 'Chicago Bulls', awayTeam: 'Los Angeles Lakers',
    startTime: '2026-06-06T00:00:00Z', endTime: '2026-06-06T03:00:00Z',
    venue: { name: 'United Center', city: 'Chicago', country: 'United States', countryCode: 'US', nearestIata: 'ORD' },
    minTicketPrice: 300, maxTicketPrice: 5000, currency: 'USD', ticketUrl: 'https://www.stubhub.com', popularity: 90,
  },
  'evt-wimbledon': {
    id: 'evt-wimbledon', name: "Wimbledon 2026 – Men's Final", sport: 'tennis', league: 'Wimbledon',
    startTime: '2026-07-13T14:00:00Z', endTime: '2026-07-13T18:00:00Z',
    venue: { name: 'All England Club', city: 'London', country: 'United Kingdom', countryCode: 'GB', nearestIata: 'LHR' },
    minTicketPrice: 200, maxTicketPrice: 1800, currency: 'GBP', ticketUrl: 'https://www.stubhub.com', popularity: 88,
  },
};

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

export const SPORTS = ['football', 'tennis', 'formula1', 'basketball', 'baseball', 'rugby', 'golf', 'cycling', 'other'] as const;
