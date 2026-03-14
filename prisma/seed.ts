import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Top 30 airports for seeding — covers major sports event cities globally
const airports = [
  { iataCode: 'ORD', icaoCode: 'KORD', name: "O'Hare International Airport", cityName: 'Chicago', countryCode: 'US', latitude: 41.9742, longitude: -87.9073, timezone: 'America/Chicago' },
  { iataCode: 'MDW', icaoCode: 'KMDW', name: 'Chicago Midway International Airport', cityName: 'Chicago', countryCode: 'US', latitude: 41.7859, longitude: -87.7524, timezone: 'America/Chicago' },
  { iataCode: 'JFK', icaoCode: 'KJFK', name: 'John F. Kennedy International Airport', cityName: 'New York', countryCode: 'US', latitude: 40.6413, longitude: -73.7781, timezone: 'America/New_York' },
  { iataCode: 'LHR', icaoCode: 'EGLL', name: 'Heathrow Airport', cityName: 'London', countryCode: 'GB', latitude: 51.4700, longitude: -0.4543, timezone: 'Europe/London' },
  { iataCode: 'MAD', icaoCode: 'LEMD', name: 'Adolfo Suárez Madrid–Barajas Airport', cityName: 'Madrid', countryCode: 'ES', latitude: 40.4936, longitude: -3.5668, timezone: 'Europe/Madrid' },
  { iataCode: 'BCN', icaoCode: 'LEBL', name: 'Barcelona–El Prat Airport', cityName: 'Barcelona', countryCode: 'ES', latitude: 41.2971, longitude: 2.0785, timezone: 'Europe/Madrid' },
  { iataCode: 'LIS', icaoCode: 'LPPT', name: 'Humberto Delgado Airport', cityName: 'Lisbon', countryCode: 'PT', latitude: 38.7742, longitude: -9.1342, timezone: 'Europe/Lisbon' },
  { iataCode: 'CDG', icaoCode: 'LFPG', name: 'Charles de Gaulle Airport', cityName: 'Paris', countryCode: 'FR', latitude: 49.0097, longitude: 2.5479, timezone: 'Europe/Paris' },
  { iataCode: 'MXP', icaoCode: 'LIMC', name: 'Milan Malpensa Airport', cityName: 'Milan', countryCode: 'IT', latitude: 45.6306, longitude: 8.7281, timezone: 'Europe/Rome' },
  { iataCode: 'MUC', icaoCode: 'EDDM', name: 'Munich Airport', cityName: 'Munich', countryCode: 'DE', latitude: 48.3538, longitude: 11.7861, timezone: 'Europe/Berlin' },
  { iataCode: 'AMS', icaoCode: 'EHAM', name: 'Amsterdam Schiphol Airport', cityName: 'Amsterdam', countryCode: 'NL', latitude: 52.3105, longitude: 4.7683, timezone: 'Europe/Amsterdam' },
  { iataCode: 'FCO', icaoCode: 'LIRF', name: 'Leonardo da Vinci–Fiumicino Airport', cityName: 'Rome', countryCode: 'IT', latitude: 41.7999, longitude: 12.2462, timezone: 'Europe/Rome' },
  { iataCode: 'ATH', icaoCode: 'LGAV', name: 'Athens International Airport', cityName: 'Athens', countryCode: 'GR', latitude: 37.9364, longitude: 23.9445, timezone: 'Europe/Athens' },
  { iataCode: 'DXB', icaoCode: 'OMDB', name: 'Dubai International Airport', cityName: 'Dubai', countryCode: 'AE', latitude: 25.2532, longitude: 55.3657, timezone: 'Asia/Dubai' },
  { iataCode: 'SYD', icaoCode: 'YSSY', name: 'Sydney Kingsford Smith Airport', cityName: 'Sydney', countryCode: 'AU', latitude: -33.9399, longitude: 151.1753, timezone: 'Australia/Sydney' },
  { iataCode: 'NRT', icaoCode: 'RJAA', name: 'Narita International Airport', cityName: 'Tokyo', countryCode: 'JP', latitude: 35.7648, longitude: 140.3864, timezone: 'Asia/Tokyo' },
  { iataCode: 'LAX', icaoCode: 'KLAX', name: 'Los Angeles International Airport', cityName: 'Los Angeles', countryCode: 'US', latitude: 33.9425, longitude: -118.4081, timezone: 'America/Los_Angeles' },
  { iataCode: 'MIA', icaoCode: 'KMIA', name: 'Miami International Airport', cityName: 'Miami', countryCode: 'US', latitude: 25.7959, longitude: -80.2870, timezone: 'America/New_York' },
  { iataCode: 'GRU', icaoCode: 'SBGR', name: 'São Paulo/Guarulhos International Airport', cityName: 'São Paulo', countryCode: 'BR', latitude: -23.4356, longitude: -46.4731, timezone: 'America/Sao_Paulo' },
  { iataCode: 'MEX', icaoCode: 'MMMX', name: 'Mexico City International Airport', cityName: 'Mexico City', countryCode: 'MX', latitude: 19.4363, longitude: -99.0721, timezone: 'America/Mexico_City' },
];

// Major sports venues
const venues = [
  { name: 'Santiago Bernabéu Stadium', cityName: 'Madrid', countryCode: 'ES', latitude: 40.4531, longitude: -3.6883, capacity: 81044, nearestIata: 'MAD' },
  { name: 'Camp Nou', cityName: 'Barcelona', countryCode: 'ES', latitude: 41.3809, longitude: 2.1228, capacity: 99354, nearestIata: 'BCN' },
  { name: 'Wembley Stadium', cityName: 'London', countryCode: 'GB', latitude: 51.5560, longitude: -0.2796, capacity: 90000, nearestIata: 'LHR' },
  { name: 'Allianz Arena', cityName: 'Munich', countryCode: 'DE', latitude: 48.2188, longitude: 11.6247, capacity: 75000, nearestIata: 'MUC' },
  { name: 'San Siro', cityName: 'Milan', countryCode: 'IT', latitude: 45.4781, longitude: 9.1240, capacity: 80018, nearestIata: 'MXP' },
  { name: 'Stade de France', cityName: 'Paris', countryCode: 'FR', latitude: 48.9244, longitude: 2.3601, capacity: 81338, nearestIata: 'CDG' },
  { name: 'Luís Filipe Menezes Stadium', cityName: 'Lisbon', countryCode: 'PT', latitude: 38.7613, longitude: -9.1609, capacity: 65647, nearestIata: 'LIS' },
  { name: 'Roland Garros', cityName: 'Paris', countryCode: 'FR', latitude: 48.8473, longitude: 2.2527, capacity: 15000, nearestIata: 'CDG' },
  { name: 'Wimbledon', cityName: 'London', countryCode: 'GB', latitude: 51.4335, longitude: -0.2143, capacity: 14979, nearestIata: 'LHR' },
  { name: 'Madison Square Garden', cityName: 'New York', countryCode: 'US', latitude: 40.7505, longitude: -73.9934, capacity: 20789, nearestIata: 'JFK' },
  { name: 'United Center', cityName: 'Chicago', countryCode: 'US', latitude: 41.8807, longitude: -87.6742, capacity: 20917, nearestIata: 'ORD' },
  { name: 'Monza Circuit', cityName: 'Monza', countryCode: 'IT', latitude: 45.6156, longitude: 9.2811, capacity: 113000, nearestIata: 'MXP' },
  { name: 'Circuit de Barcelona-Catalunya', cityName: 'Barcelona', countryCode: 'ES', latitude: 41.5700, longitude: 2.2585, capacity: 140000, nearestIata: 'BCN' },
];

// Sample sporting events (mock data for MVP)
const sampleEvents = [
  {
    externalId: 'ucl-2026-final',
    externalSource: 'mock',
    name: 'UEFA Champions League Final 2026',
    sport: 'football',
    league: 'UEFA Champions League',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    startTime: new Date('2026-05-30T20:00:00Z'),
    endTime: new Date('2026-05-30T22:00:00Z'),
    minTicketPrice: 250,
    maxTicketPrice: 2500,
    currency: 'EUR',
    popularity: 100,
    expiresAt: new Date('2026-06-01T00:00:00Z'),
  },
  {
    externalId: 'rolland-garros-2026-sf',
    externalSource: 'mock',
    name: 'Roland Garros 2026 – Men\'s Semi-Final',
    sport: 'tennis',
    league: 'French Open',
    startTime: new Date('2026-06-05T13:00:00Z'),
    endTime: new Date('2026-06-05T18:00:00Z'),
    minTicketPrice: 80,
    maxTicketPrice: 600,
    currency: 'EUR',
    popularity: 85,
    expiresAt: new Date('2026-06-07T00:00:00Z'),
  },
  {
    externalId: 'f1-barcelona-2026',
    externalSource: 'mock',
    name: 'Formula 1 Spanish Grand Prix 2026',
    sport: 'formula1',
    league: 'Formula 1 World Championship',
    startTime: new Date('2026-06-21T13:00:00Z'),
    endTime: new Date('2026-06-21T15:30:00Z'),
    minTicketPrice: 150,
    maxTicketPrice: 1200,
    currency: 'EUR',
    popularity: 95,
    expiresAt: new Date('2026-06-23T00:00:00Z'),
  },
  {
    externalId: 'nba-finals-2026-g1',
    externalSource: 'mock',
    name: 'NBA Finals 2026 – Game 1',
    sport: 'basketball',
    league: 'NBA',
    homeTeam: 'Chicago Bulls',
    awayTeam: 'Los Angeles Lakers',
    startTime: new Date('2026-06-06T00:00:00Z'),
    endTime: new Date('2026-06-06T03:00:00Z'),
    minTicketPrice: 300,
    maxTicketPrice: 5000,
    currency: 'USD',
    popularity: 90,
    expiresAt: new Date('2026-06-08T00:00:00Z'),
  },
];

async function main() {
  console.info('🌱 Seeding database...');

  // Upsert airports
  for (const airport of airports) {
    await prisma.airport.upsert({
      where: { iataCode: airport.iataCode },
      update: {},
      create: airport,
    });
  }
  console.info(`✅ Seeded ${airports.length} airports`);

  // Upsert venues
  const venueRecords: Array<{ id: string; name: string }> = [];
  for (const venue of venues) {
    const record = await prisma.venue.upsert({
      where: { id: `seed-${venue.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: { id: `seed-${venue.name.toLowerCase().replace(/\s+/g, '-')}`, ...venue },
    });
    venueRecords.push(record);
  }
  console.info(`✅ Seeded ${venues.length} venues`);

  // Seed events linked to known venues
  const venueMap: Record<string, string> = {
    'UEFA Champions League Final 2026': 'seed-wembley-stadium',
    "Roland Garros 2026 – Men's Semi-Final": 'seed-roland-garros',
    'Formula 1 Spanish Grand Prix 2026': 'seed-circuit-de-barcelona-catalunya',
    'NBA Finals 2026 – Game 1': 'seed-united-center',
  };

  for (const event of sampleEvents) {
    const venueId = venueMap[event.name] ?? venueRecords[0]!.id;
    await prisma.event.upsert({
      where: {
        externalId_externalSource: {
          externalId: event.externalId,
          externalSource: event.externalSource,
        },
      },
      update: {},
      create: { ...event, venueId },
    });
  }
  console.info(`✅ Seeded ${sampleEvents.length} events`);

  console.info('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
