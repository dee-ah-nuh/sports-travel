import React from 'react';
import { DestinationCard } from './DestinationCard.js';
import styles from './DestinationGrid.module.css';

interface Destination {
  iataCode: string; city: string; country: string; countryCode: string;
  price: number; currency: string; directFlight: boolean; minDurationMinutes: number;
  airline: string; eventCount: number;
  events: Array<{ id: string; name: string; sport: string; startTime: string; minTicketPrice?: number; currency?: string }>;
}

interface Props {
  destinations: Destination[];
  onEventClick: (eventId: string) => void;
  selectedDest: string | null;
  onDestSelect: (iata: string | null) => void;
}

export function DestinationGrid({ destinations, onEventClick, selectedDest, onDestSelect }: Props) {
  if (destinations.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🌍</span>
        <p>No destinations match your filters.</p>
        <p className={styles.hint}>Try adjusting sport or budget.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.count}>{destinations.length} destinations found</div>
      <div className={styles.grid}>
        {destinations.map((dest) => (
          <DestinationCard
            key={dest.iataCode}
            destination={dest}
            isSelected={selectedDest === dest.iataCode}
            onSelect={() => onDestSelect(selectedDest === dest.iataCode ? null : dest.iataCode)}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
}
