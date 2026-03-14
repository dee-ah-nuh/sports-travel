import type { MockEvent } from './mock';

export interface MockLeg {
  id: string;
  legOrder: number;
  type: 'flight' | 'event';
  originIata?: string;
  destinationIata?: string;
  originCity?: string;
  destinationCity?: string;
  carrier?: string;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
  durationMinutes?: number;
  stops?: number;
  costEstimate?: number;
  event?: MockEvent;
}

export interface MockOption {
  id: string;
  label: 'cheapest' | 'fastest' | 'best';
  score: number;
  totalCost: number;
  currency: string;
  totalTravelMinutes: number;
  preEventBufferHours: number;
  breakdown: { flightCost: number; trainCost: number; hotelCost: number; ticketCostEstimate?: number };
  legs: MockLeg[];
}

export function generateMockOptions(origin: string, event: MockEvent): MockOption[] {
  const destination = event.venue.nearestIata ?? 'MAD';
  const eventDate = event.startTime.split('T')[0]!;
  const dayBefore = new Date(new Date(event.startTime).getTime() - 86400000)
    .toISOString()
    .split('T')[0]!;

  return [
    {
      id: 'opt-cheapest',
      label: 'cheapest',
      score: 74,
      totalCost: 620,
      currency: 'USD',
      totalTravelMinutes: 1440,
      preEventBufferHours: 14,
      breakdown: { flightCost: 620, trainCost: 0, hotelCost: 0, ticketCostEstimate: event.minTicketPrice },
      legs: [
        { id: 'l1', legOrder: 0, type: 'flight', originIata: origin, destinationIata: destination, originCity: 'Chicago', destinationCity: event.venue.city, carrier: 'Connect Air', flightNumber: 'CA 202', departureTime: `${dayBefore}T06:00:00Z`, arrivalTime: `${dayBefore}T18:00:00Z`, durationMinutes: 720, stops: 1, costEstimate: 310 },
        { id: 'l2', legOrder: 1, type: 'event', event },
        { id: 'l3', legOrder: 2, type: 'flight', originIata: destination, destinationIata: origin, originCity: event.venue.city, destinationCity: 'Chicago', carrier: 'Connect Air', flightNumber: 'CA 203', departureTime: `${eventDate}T23:00:00Z`, arrivalTime: `${eventDate}T23:59:00Z`, durationMinutes: 720, stops: 1, costEstimate: 310 },
      ],
    },
    {
      id: 'opt-fastest',
      label: 'fastest',
      score: 83,
      totalCost: 840,
      currency: 'USD',
      totalTravelMinutes: 1020,
      preEventBufferHours: 22,
      breakdown: { flightCost: 840, trainCost: 0, hotelCost: 0, ticketCostEstimate: event.minTicketPrice },
      legs: [
        { id: 'l4', legOrder: 0, type: 'flight', originIata: origin, destinationIata: destination, originCity: 'Chicago', destinationCity: event.venue.city, carrier: 'Direct Air', flightNumber: 'DA 101', departureTime: `${dayBefore}T08:00:00Z`, arrivalTime: `${dayBefore}T16:30:00Z`, durationMinutes: 510, stops: 0, costEstimate: 420 },
        { id: 'l5', legOrder: 1, type: 'event', event },
        { id: 'l6', legOrder: 2, type: 'flight', originIata: destination, destinationIata: origin, originCity: event.venue.city, destinationCity: 'Chicago', carrier: 'Direct Air', flightNumber: 'DA 102', departureTime: `${eventDate}T21:00:00Z`, arrivalTime: `${eventDate}T23:59:00Z`, durationMinutes: 510, stops: 0, costEstimate: 420 },
      ],
    },
    {
      id: 'opt-best',
      label: 'best',
      score: 91,
      totalCost: 730,
      currency: 'USD',
      totalTravelMinutes: 1120,
      preEventBufferHours: 18,
      breakdown: { flightCost: 730, trainCost: 0, hotelCost: 0, ticketCostEstimate: event.minTicketPrice },
      legs: [
        { id: 'l7', legOrder: 0, type: 'flight', originIata: origin, destinationIata: destination, originCity: 'Chicago', destinationCity: event.venue.city, carrier: 'Premium Air', flightNumber: 'PA 301', departureTime: `${dayBefore}T10:00:00Z`, arrivalTime: `${dayBefore}T19:00:00Z`, durationMinutes: 540, stops: 0, costEstimate: 365 },
        { id: 'l8', legOrder: 1, type: 'event', event },
        { id: 'l9', legOrder: 2, type: 'flight', originIata: destination, destinationIata: origin, originCity: event.venue.city, destinationCity: 'Chicago', carrier: 'Premium Air', flightNumber: 'PA 302', departureTime: `${eventDate}T22:30:00Z`, arrivalTime: `${eventDate}T23:59:00Z`, durationMinutes: 580, stops: 0, costEstimate: 365 },
      ],
    },
  ];
}
