import React, { useState } from 'react';
import { SPORT_EMOJI, SPORT_COLORS } from '../../data/mock.js';
import styles from './DestinationCard.module.css';

interface Event {
  id: string; name: string; sport: string; startTime: string;
  minTicketPrice?: number; currency?: string;
}
interface Destination {
  iataCode: string; city: string; country: string; countryCode: string;
  price: number; currency: string; directFlight: boolean; minDurationMinutes: number;
  airline: string; eventCount: number; events: Event[];
}
interface Props {
  destination: Destination;
  isSelected: boolean;
  onSelect: () => void;
  onEventClick: (eventId: string) => void;
}

function flagEmoji(code: string): string {
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60); const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function DestinationCard({ destination, isSelected, onSelect, onEventClick }: Props) {
  const { city, country, countryCode, price, currency, directFlight, minDurationMinutes, airline, events, eventCount } = destination;
  const hasEvents = eventCount > 0;

  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ''} ${hasEvents ? styles.hasEvents : ''}`} onClick={onSelect}>
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.location}>
          <span className={styles.flag}>{flagEmoji(countryCode)}</span>
          <div>
            <div className={styles.city}>{city}</div>
            <div className={styles.country}>{country}</div>
          </div>
        </div>
        <div className={styles.priceBlock}>
          <div className={styles.priceLabel}>from</div>
          <div className={styles.price}>${price.toLocaleString()}</div>
          <div className={styles.priceSub}>{currency}</div>
        </div>
      </div>

      {/* Flight info */}
      <div className={styles.flightInfo}>
        <span className={styles.badge}>{directFlight ? '✈️ Direct' : '🔗 Connecting'}</span>
        <span className={styles.dot}>·</span>
        <span className={styles.duration}>{formatDuration(minDurationMinutes)}</span>
        <span className={styles.dot}>·</span>
        <span className={styles.airline}>{airline}</span>
      </div>

      {/* Events */}
      {hasEvents ? (
        <div className={styles.eventsSection}>
          <div className={styles.eventsLabel}>{eventCount} event{eventCount > 1 ? 's' : ''} during your dates</div>
          <div className={styles.eventsList}>
            {events.map((event) => (
              <button
                key={event.id}
                className={styles.eventChip}
                style={{ borderColor: `${SPORT_COLORS[event.sport] ?? '#6b7280'}44`, backgroundColor: `${SPORT_COLORS[event.sport] ?? '#6b7280'}11` }}
                onClick={(e) => { e.stopPropagation(); onEventClick(event.id); }}
              >
                <span className={styles.eventEmoji}>{SPORT_EMOJI[event.sport] ?? '🏆'}</span>
                <span className={styles.eventName}>{event.name}</span>
                <span className={styles.eventDate}>{formatDate(event.startTime)}</span>
                {event.minTicketPrice && (
                  <span className={styles.eventPrice}>from {event.currency ?? '$'}{event.minTicketPrice}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.noEvents}>No upcoming events · Great for sightseeing</div>
      )}
    </div>
  );
}
