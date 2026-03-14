import React from 'react';
import type { MockOption, MockLeg } from './itinerary.mock.js';
import styles from './ItineraryOptionCard.module.css';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function FlightLeg({ leg }: { leg: MockLeg }) {
  return (
    <div className={styles.leg}>
      <div className={styles.legIcon}>✈️</div>
      <div className={styles.legBody}>
        <div className={styles.legRoute}>
          <div className={styles.legEndpoint}>
            <div className={styles.iata}>{leg.originIata}</div>
            <div className={styles.city}>{leg.originCity}</div>
            {leg.departureTime && (
              <div className={styles.time}>
                {formatTime(leg.departureTime)}{' '}
                <span className={styles.date}>{formatDate(leg.departureTime)}</span>
              </div>
            )}
          </div>

          <div className={styles.legMiddle}>
            <div className={styles.lineWrapper}>
              <div className={styles.line} />
              <div className={styles.planeDot}>✈</div>
            </div>
            <div className={styles.duration}>
              {leg.durationMinutes ? formatDuration(leg.durationMinutes) : ''}
            </div>
            {leg.stops !== undefined && (
              <div className={styles.stops}>{leg.stops === 0 ? 'Direct' : `${leg.stops} stop`}</div>
            )}
          </div>

          <div className={`${styles.legEndpoint} ${styles.right}`}>
            <div className={styles.iata}>{leg.destinationIata}</div>
            <div className={styles.city}>{leg.destinationCity}</div>
            {leg.arrivalTime && (
              <div className={styles.time}>
                {formatTime(leg.arrivalTime)}{' '}
                <span className={styles.date}>{formatDate(leg.arrivalTime)}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.legMeta}>
          <span>
            {leg.carrier} · {leg.flightNumber}
          </span>
          <span className={styles.legCost}>${leg.costEstimate?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function EventLeg({ leg }: { leg: MockLeg }) {
  if (!leg.event) return null;
  const { event } = leg;
  return (
    <div className={`${styles.leg} ${styles.eventLeg}`}>
      <div className={styles.legIcon}>🎟️</div>
      <div className={styles.legBody}>
        <div className={styles.eventTitle}>{event.name}</div>
        <div className={styles.eventDetail}>
          <span>📍 {event.venue.name}, {event.venue.city}</span>
          <span>·</span>
          <span>
            📅{' '}
            {new Date(event.startTime).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
        {event.minTicketPrice && (
          <div className={styles.eventTickets}>
            Tickets from {event.currency}
            {event.minTicketPrice.toLocaleString()} ·{' '}
            <a
              href={event.ticketUrl ?? 'https://www.stubhub.com'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ticketLink}
            >
              Buy on StubHub ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function ItineraryOptionCard({ option }: { option: MockOption }) {
  const scoreColor =
    option.score >= 85 ? 'var(--success)' : option.score >= 70 ? 'var(--accent)' : 'var(--warning)';

  return (
    <div className={styles.card}>
      {/* Score bar */}
      <div className={styles.scoreBar}>
        <span className={styles.scoreLabel}>Match score</span>
        <div className={styles.scoreTrack}>
          <div
            className={styles.scoreFill}
            style={{ width: `${option.score}%`, background: `linear-gradient(90deg, var(--accent), ${scoreColor})` }}
          />
        </div>
        <span className={styles.scoreVal} style={{ color: scoreColor }}>
          {option.score}/100
        </span>
      </div>

      {/* Stats row */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total travel</span>
          <span className={styles.statVal}>{formatDuration(option.totalTravelMinutes)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Pre-event buffer</span>
          <span className={styles.statVal}>{option.preEventBufferHours}h</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Legs</span>
          <span className={styles.statVal}>{option.legs.filter((l) => l.type !== 'event').length}</span>
        </div>
      </div>

      {/* Legs timeline */}
      <div className={styles.legs}>
        {option.legs.map((leg) =>
          leg.type === 'event' ? (
            <EventLeg key={leg.id} leg={leg} />
          ) : (
            <FlightLeg key={leg.id} leg={leg} />
          ),
        )}
      </div>

      {/* Cost breakdown */}
      <div className={styles.breakdown}>
        <div className={styles.breakdownRow}>
          <span>Flights</span>
          <span>${option.breakdown.flightCost.toLocaleString()}</span>
        </div>
        {option.breakdown.trainCost > 0 && (
          <div className={styles.breakdownRow}>
            <span>Rail</span>
            <span>${option.breakdown.trainCost.toLocaleString()}</span>
          </div>
        )}
        {option.breakdown.ticketCostEstimate && (
          <div className={`${styles.breakdownRow} ${styles.ticketRow}`}>
            <span>Event tickets (est.)</span>
            <span>from ${option.breakdown.ticketCostEstimate.toLocaleString()}</span>
          </div>
        )}
        <div className={`${styles.breakdownRow} ${styles.total}`}>
          <span>Flight total</span>
          <span>${option.totalCost.toLocaleString()} {option.currency}</span>
        </div>
      </div>
    </div>
  );
}
