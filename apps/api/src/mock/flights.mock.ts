import type { ExploreDestination, FlightOffer } from '@sports-travel/types';

export const MOCK_EXPLORE_DESTINATIONS: ExploreDestination[] = [
  { iataCode: 'MAD', city: 'Madrid', country: 'Spain', countryCode: 'ES', latitude: 40.4168, longitude: -3.7038, price: 420, currency: 'USD', directFlight: true, minDurationMinutes: 510, airline: 'Iberia' },
  { iataCode: 'BCN', city: 'Barcelona', country: 'Spain', countryCode: 'ES', latitude: 41.3851, longitude: 2.1734, price: 390, currency: 'USD', directFlight: true, minDurationMinutes: 520, airline: 'Vueling' },
  { iataCode: 'LIS', city: 'Lisbon', country: 'Portugal', countryCode: 'PT', latitude: 38.7223, longitude: -9.1393, price: 380, currency: 'USD', directFlight: true, minDurationMinutes: 500, airline: 'TAP' },
  { iataCode: 'CDG', city: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522, price: 350, currency: 'USD', directFlight: true, minDurationMinutes: 490, airline: 'Air France' },
  { iataCode: 'LHR', city: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278, price: 320, currency: 'USD', directFlight: true, minDurationMinutes: 470, airline: 'British Airways' },
  { iataCode: 'AMS', city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', latitude: 52.3676, longitude: 4.9041, price: 410, currency: 'USD', directFlight: false, minDurationMinutes: 550, airline: 'KLM' },
  { iataCode: 'MUC', city: 'Munich', country: 'Germany', countryCode: 'DE', latitude: 48.1351, longitude: 11.5820, price: 440, currency: 'USD', directFlight: false, minDurationMinutes: 570, airline: 'Lufthansa' },
  { iataCode: 'FCO', city: 'Rome', country: 'Italy', countryCode: 'IT', latitude: 41.9028, longitude: 12.4964, price: 460, currency: 'USD', directFlight: false, minDurationMinutes: 560, airline: 'Alitalia' },
  { iataCode: 'ATH', city: 'Athens', country: 'Greece', countryCode: 'GR', latitude: 37.9838, longitude: 23.7275, price: 510, currency: 'USD', directFlight: false, minDurationMinutes: 620, airline: 'Aegean' },
  { iataCode: 'DXB', city: 'Dubai', country: 'UAE', countryCode: 'AE', latitude: 25.2048, longitude: 55.2708, price: 650, currency: 'USD', directFlight: true, minDurationMinutes: 840, airline: 'Emirates' },
  { iataCode: 'NRT', city: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6762, longitude: 139.6503, price: 820, currency: 'USD', directFlight: true, minDurationMinutes: 900, airline: 'ANA' },
  { iataCode: 'SYD', city: 'Sydney', country: 'Australia', countryCode: 'AU', latitude: -33.8688, longitude: 151.2093, price: 1100, currency: 'USD', directFlight: false, minDurationMinutes: 1200, airline: 'Qantas' },
];

export function getMockFlightOffers(origin: string, destination: string, date: string): FlightOffer[] {
  return [
    {
      id: `mock-${origin}-${destination}-direct`,
      origin,
      destination,
      departureTime: `${date}T08:00:00Z`,
      arrivalTime: `${date}T16:30:00Z`,
      airline: 'Mock Airways',
      flightNumber: 'MA 101',
      durationMinutes: 510,
      stops: 0,
      price: 420,
      currency: 'USD',
      seatClass: 'economy',
      seatsAvailable: 12,
    },
    {
      id: `mock-${origin}-${destination}-connecting`,
      origin,
      destination,
      departureTime: `${date}T06:00:00Z`,
      arrivalTime: `${date}T17:00:00Z`,
      airline: 'Mock Connect',
      flightNumber: 'MC 202',
      durationMinutes: 660,
      stops: 1,
      price: 310,
      currency: 'USD',
      seatClass: 'economy',
      seatsAvailable: 24,
    },
  ];
}
