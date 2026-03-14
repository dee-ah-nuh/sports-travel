import type { FastifyInstance } from 'fastify';
import { MOCK_EVENTS } from '../../../mock/events.mock.js';
import { getMockFlightOffers } from '../../../mock/flights.mock.js';
import type { ItineraryOption, ItineraryLeg } from '@sports-travel/types';

function generateMockItineraryOptions(
  origin: string,
  eventId: string,
  budget: number,
): ItineraryOption[] {
  const event = MOCK_EVENTS.find((e) => e.id === eventId);
  if (!event) return [];

  const destination = event.venue.nearestIata ?? 'MAD';
  const eventDate = event.startTime.split('T')[0]!;
  const dayBefore = new Date(event.startTime);
  dayBefore.setDate(dayBefore.getDate() - 1);
  const departureDate = dayBefore.toISOString().split('T')[0]!;

  const outboundFlights = getMockFlightOffers(origin, destination, departureDate);
  const returnDate = event.endTime ? event.endTime.split('T')[0]! : eventDate;
  const returnFlights = getMockFlightOffers(destination, origin, returnDate);

  const options: ItineraryOption[] = [
    {
      id: `opt-cheapest-${eventId}`,
      label: 'cheapest',
      score: 78,
      totalCost: (outboundFlights[1]?.price ?? 310) + (returnFlights[1]?.price ?? 310),
      currency: 'USD',
      totalTravelMinutes: 1320,
      preEventBufferHours: 14,
      breakdown: {
        flightCost: (outboundFlights[1]?.price ?? 310) + (returnFlights[1]?.price ?? 310),
        trainCost: 0,
        hotelCost: 0,
        ticketCostEstimate: event.minTicketPrice,
      },
      legs: [
        {
          id: `leg-out-cheap`,
          legOrder: 0,
          type: 'flight',
          originIata: origin,
          destinationIata: destination,
          originCity: 'Chicago',
          destinationCity: event.venue.city,
          carrier: 'Mock Connect',
          flightNumber: 'MC 202',
          departureTime: `${departureDate}T06:00:00Z`,
          arrivalTime: `${departureDate}T17:00:00Z`,
          durationMinutes: 660,
          stops: 1,
          costEstimate: outboundFlights[1]?.price ?? 310,
          currency: 'USD',
        } satisfies ItineraryLeg,
        {
          id: `leg-event`,
          legOrder: 1,
          type: 'event',
          event,
        } satisfies ItineraryLeg,
        {
          id: `leg-ret-cheap`,
          legOrder: 2,
          type: 'flight',
          originIata: destination,
          destinationIata: origin,
          originCity: event.venue.city,
          destinationCity: 'Chicago',
          carrier: 'Mock Connect',
          flightNumber: 'MC 203',
          departureTime: `${returnDate}T22:00:00Z`,
          arrivalTime: `${new Date(new Date(returnDate).getTime() + 86400000).toISOString().split('T')[0]}T09:00:00Z`,
          durationMinutes: 660,
          stops: 1,
          costEstimate: returnFlights[1]?.price ?? 310,
          currency: 'USD',
        } satisfies ItineraryLeg,
      ],
    },
    {
      id: `opt-fastest-${eventId}`,
      label: 'fastest',
      score: 85,
      totalCost: (outboundFlights[0]?.price ?? 420) + (returnFlights[0]?.price ?? 420),
      currency: 'USD',
      totalTravelMinutes: 1020,
      preEventBufferHours: 22,
      breakdown: {
        flightCost: (outboundFlights[0]?.price ?? 420) + (returnFlights[0]?.price ?? 420),
        trainCost: 0,
        hotelCost: 0,
        ticketCostEstimate: event.minTicketPrice,
      },
      legs: [
        {
          id: `leg-out-fast`,
          legOrder: 0,
          type: 'flight',
          originIata: origin,
          destinationIata: destination,
          originCity: 'Chicago',
          destinationCity: event.venue.city,
          carrier: 'Mock Airways',
          flightNumber: 'MA 101',
          departureTime: `${departureDate}T08:00:00Z`,
          arrivalTime: `${departureDate}T16:30:00Z`,
          durationMinutes: 510,
          stops: 0,
          costEstimate: outboundFlights[0]?.price ?? 420,
          currency: 'USD',
        } satisfies ItineraryLeg,
        {
          id: `leg-event-fast`,
          legOrder: 1,
          type: 'event',
          event,
        } satisfies ItineraryLeg,
        {
          id: `leg-ret-fast`,
          legOrder: 2,
          type: 'flight',
          originIata: destination,
          destinationIata: origin,
          originCity: event.venue.city,
          destinationCity: 'Chicago',
          carrier: 'Mock Airways',
          flightNumber: 'MA 102',
          departureTime: `${returnDate}T20:00:00Z`,
          arrivalTime: `${new Date(new Date(returnDate).getTime() + 86400000).toISOString().split('T')[0]}T06:00:00Z`,
          durationMinutes: 510,
          stops: 0,
          costEstimate: returnFlights[0]?.price ?? 420,
          currency: 'USD',
        } satisfies ItineraryLeg,
      ],
    },
  ];

  return options;
}

export async function itineraryRoutes(app: FastifyInstance) {
  app.post('/generate', async (request, reply) => {
    const { origin = 'ORD', eventId, budget = 1500 } = request.body as Record<string, unknown>;
    if (!eventId) return reply.status(400).send({ error: { code: 'MISSING_FIELD', message: 'eventId is required' } });
    const options = generateMockItineraryOptions(String(origin), String(eventId), Number(budget));
    if (options.length === 0) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Event not found' } });
    return reply.send({ data: options, meta: { source: 'mock', generatedAt: new Date().toISOString() } });
  });
}
