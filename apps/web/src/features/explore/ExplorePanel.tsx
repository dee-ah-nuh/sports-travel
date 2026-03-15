import React from 'react';
import { SPORT_COLORS, SPORT_EMOJI } from '../../data/mock.js';
import styles from './ExplorePanel.module.css';

interface Event {
  id: string;
  name: string;
  sport: string;
  startTime: string;
  minTicketPrice?: number;
  currency?: string;
}

interface Destination {
  iataCode: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  directFlight: boolean;
  minDurationMinutes: number;
  airline: string;
  eventCount: number;
  events: Event[];
}

interface Props {
  destinations: Destination[];
  selectedDest: Destination | null;
  onDestSelect: (iata: string | null) => void;
  onEventClick: (eventId: string) => void;
  origin: string;
}

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ExplorePanel({ destinations, selectedDest, onDestSelect, onEventClick, origin }: Props) {
  if (selectedDest) {
    return (
      <DestinationDetail
        dest={selectedDest}
        onClose={() => onDestSelect(null)}
        onEventClick={onEventClick}
        origin={origin}
      />
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>{destinations.length} destinations</span>
        <span className={styles.panelSub}>from {(origin.split('–')[0] ?? origin).trim()}</span>
      </div>
      <div className={styles.destScroll}>
        {destinations.map((dest) => (
          <DestinationChip
            key={dest.iataCode}
            dest={dest}
            onClick={() => onDestSelect(dest.iataCode)}
          />
        ))}
      </div>

      {/* Event stream — all events across destinations */}
      <div className={styles.eventStream}>
        {destinations
          .flatMap((d) => d.events.map((e) => ({ ...e, destCity: d.city, destIata: d.iataCode, destPrice: d.price, destDuration: d.minDurationMinutes, destDirect: d.directFlight })))
          .filter((e) => e.id)
          .map((e) => {
            const color = SPORT_COLORS[e.sport] ?? '#6b7280';
            const emoji = SPORT_EMOJI[e.sport] ?? '🏆';
            return (
              <button
                key={e.id}
                className={styles.eventCard}
                onClick={() => onEventClick(e.id)}
              >
                <div className={styles.eventCardLeft}>
                  <div className={styles.eventSport} style={{ color }}>
                    <span>{emoji}</span>
                    <span>{e.sport}</span>
                  </div>
                  <div className={styles.eventName}>{e.name}</div>
                  <div className={styles.eventMeta}>
                    <span>📍 {e.destCity}</span>
                    <span>·</span>
                    <span>📅 {formatDate(e.startTime)}</span>
                    {e.destDirect && <span className={styles.directBadge}>Direct</span>}
                  </div>
                </div>
                <div className={styles.eventCardRight}>
                  <div className={styles.flightPrice}>${e.destPrice}</div>
                  <div className={styles.flightDuration}>{formatDuration(e.destDuration)}</div>
                  {e.minTicketPrice && (
                    <div className={styles.ticketPrice}>🎟 {e.currency ?? '$'}{e.minTicketPrice}+</div>
                  )}
                  <div className={styles.viewBtn}>View trip →</div>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}

function DestinationChip({ dest, onClick }: { dest: Destination; onClick: () => void }) {
  const topSport = dest.events[0]?.sport;
  const color = topSport ? (SPORT_COLORS[topSport] ?? '#4f6ef7') : '#4f6ef7';
  return (
    <button
      className={`${styles.chip} ${dest.eventCount > 0 ? styles.chipEvent : ''}`}
      style={dest.eventCount > 0 ? { borderColor: `${color}66` } : undefined}
      onClick={onClick}
    >
      <span className={styles.chipIata}>{dest.iataCode}</span>
      <span className={styles.chipCity}>{dest.city}</span>
      <span className={styles.chipPrice}>${dest.price}</span>
      {dest.eventCount > 0 && (
        <span className={styles.chipBadge} style={{ color }}>
          {dest.eventCount} {SPORT_EMOJI[topSport ?? ''] ?? '🎟'}
        </span>
      )}
    </button>
  );
}

function DestinationDetail({
  dest, onClose, onEventClick, origin,
}: {
  dest: Destination;
  onClose: () => void;
  onEventClick: (id: string) => void;
  origin: string;
}) {
  const originCode = (origin.split('–')[0] ?? origin).trim();
  return (
    <div className={styles.detail}>
      <div className={styles.detailHeader}>
        <button className={styles.closeBtn} onClick={onClose}>← All destinations</button>
        <div className={styles.routeRow}>
          <div className={styles.iataBlock}>
            <span className={styles.iataCode}>{originCode}</span>
            <span className={styles.iataLabel}>Origin</span>
          </div>
          <div className={styles.routeArrow}>
            <span className={styles.routeLine} />
            <span className={styles.planIcon}>✈</span>
            <span className={styles.routeLine} />
          </div>
          <div className={styles.iataBlock}>
            <span className={styles.iataCode}>{dest.iataCode}</span>
            <span className={styles.iataLabel}>{dest.city}</span>
          </div>
          <div className={styles.flightInfo}>
            <span className={styles.flightBig}>${dest.price}</span>
            <span className={styles.flightSub}>{formatDuration(dest.minDurationMinutes)} · {dest.directFlight ? 'Direct' : dest.airline}</span>
          </div>
        </div>
      </div>

      <div className={styles.detailEvents}>
        {dest.events.length === 0 && (
          <p className={styles.noEvents}>No upcoming events — great time to explore {dest.city}.</p>
        )}
        {dest.events.map((e) => {
          const color = SPORT_COLORS[e.sport] ?? '#6b7280';
          const emoji = SPORT_EMOJI[e.sport] ?? '🏆';
          return (
            <button
              key={e.id}
              className={styles.detailEventCard}
              onClick={() => onEventClick(e.id)}
              style={{ borderColor: `${color}33` }}
            >
              <div className={styles.detailEventLeft}>
                <span className={styles.detailEmoji}>{emoji}</span>
                <div>
                  <div className={styles.detailEventName}>{e.name}</div>
                  <div className={styles.detailEventDate}>📅 {formatDate(e.startTime)}</div>
                </div>
              </div>
              <div className={styles.detailEventRight}>
                {e.minTicketPrice && (
                  <>
                    <span className={styles.detailTicketPrice} style={{ color }}>
                      {e.currency ?? '$'}{e.minTicketPrice}
                    </span>
                    <span className={styles.detailTicketLabel}>tickets from</span>
                  </>
                )}
                <span className={styles.detailCta} style={{ background: `${color}22`, color }}>
                  Plan trip →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
