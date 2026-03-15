import React, { useState, useEffect } from 'react';
import { SPORT_COLORS, SPORT_EMOJI } from '../../data/mock.js';
import { searchFlights, formatDuration, type FlightResult } from '../../data/flightSearch.js';
import styles from './ExplorePanel.module.css';

interface WCEvent {
  id: string;
  name: string;
  sport: string;
  startTime: string;
  stage: string;
  group?: string;
  team1?: string;
  team2?: string;
  venueId?: string;
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
  events: WCEvent[];
  // WC-specific
  venueId?: string;
  stadiumName?: string;
  connectingAirport?: string;
  allAirports?: string[];
}

interface Props {
  destinations: Destination[];
  selectedDest: Destination | null;
  onDestSelect: (iata: string | null) => void;
  onEventClick: (eventId: string) => void;
  origin: string;
  flightsLoading?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Stage badge colour ────────────────────────────────────────────────────────

const STAGE_COLORS: Record<string, string> = {
  'Group Stage': '#50b6ff',
  'Round of 32': '#57ecb2',
  'Round of 16': '#57ecb2',
  Quarterfinal: '#f59e0b',
  Semifinal: '#f97316',
  'Third Place': '#8b5cf6',
  Final: '#ef4444',
};

// ── Main panel ────────────────────────────────────────────────────────────────

export function ExplorePanel({
  destinations,
  selectedDest,
  onDestSelect,
  onEventClick,
  origin,
  flightsLoading,
}: Props) {
  if (selectedDest) {
    return (
      <DestinationDetail
        dest={selectedDest}
        onClose={() => onDestSelect(null)}
        onEventClick={onEventClick}
        origin={origin}
        flightsLoading={flightsLoading ?? false}
      />
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitle}>
          {destinations.length} World Cup venues
        </span>
        <span className={styles.panelSub}>
          from {(origin.split('–')[0] ?? origin).trim()}
          {flightsLoading && (
            <span className={styles.loadingPill}>⟳ loading prices…</span>
          )}
        </span>
      </div>

      {/* Venue chips */}
      <div className={styles.destScroll}>
        {destinations.map((dest) => (
          <DestinationChip
            key={dest.iataCode}
            dest={dest}
            onClick={() => onDestSelect(dest.iataCode)}
          />
        ))}
      </div>

      {/* Match stream — all matches across venues */}
      <div className={styles.eventStream}>
        {destinations
          .flatMap((d) =>
            d.events.map((e) => ({
              ...e,
              destCity: d.city,
              destIata: d.iataCode,
              destPrice: d.price,
              destDuration: d.minDurationMinutes,
              destDirect: d.directFlight,
              destConnecting: d.connectingAirport,
            })),
          )
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map((e) => {
            const color = SPORT_COLORS[e.sport] ?? '#50b6ff';
            const emoji = SPORT_EMOJI[e.sport] ?? '⚽';
            const stageColor = STAGE_COLORS[e.stage ?? ''] ?? '#50b6ff';
            return (
              <button
                key={e.id}
                className={styles.eventCard}
                onClick={() => onEventClick(e.id)}
              >
                <div className={styles.eventCardLeft}>
                  <div className={styles.eventSport} style={{ color }}>
                    <span>{emoji}</span>
                    <span
                      className={styles.stageBadge}
                      style={{ background: `${stageColor}22`, color: stageColor }}
                    >
                      {e.stage}
                    </span>
                  </div>
                  <div className={styles.eventName}>{e.name}</div>
                  <div className={styles.eventMeta}>
                    <span>📍 {e.destCity}</span>
                    <span>·</span>
                    <span>📅 {formatShortDate(e.startTime)}</span>
                    {e.destDirect ? (
                      <span className={styles.directBadge}>Direct</span>
                    ) : e.destConnecting ? (
                      <span className={styles.connectBadge}>via {e.destConnecting}</span>
                    ) : null}
                  </div>
                </div>
                <div className={styles.eventCardRight}>
                  {e.destPrice > 0 ? (
                    <div className={styles.flightPrice}>${e.destPrice}</div>
                  ) : (
                    <div className={styles.flightPricePending}>—</div>
                  )}
                  {e.destDuration > 0 && (
                    <div className={styles.flightDuration}>{formatDuration(e.destDuration)}</div>
                  )}
                  {e.minTicketPrice && (
                    <div className={styles.ticketPrice}>
                      🎟 {e.currency ?? '$'}{e.minTicketPrice}+
                    </div>
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

// ── Venue chip ────────────────────────────────────────────────────────────────

function DestinationChip({ dest, onClick }: { dest: Destination; onClick: () => void }) {
  return (
    <button
      className={`${styles.chip} ${dest.eventCount > 0 ? styles.chipEvent : ''}`}
      onClick={onClick}
    >
      <span className={styles.chipIata}>{dest.iataCode}</span>
      <span className={styles.chipCity}>{dest.city}</span>
      {dest.price > 0 ? (
        <span className={styles.chipPrice}>${dest.price}</span>
      ) : (
        <span className={styles.chipPricePending}>—</span>
      )}
      {dest.eventCount > 0 && (
        <span className={styles.chipBadge}>⚽ {dest.eventCount}</span>
      )}
    </button>
  );
}

// ── Destination detail with Matches / Flights tabs ────────────────────────────

type DetailTab = 'matches' | 'flights';

function DestinationDetail({
  dest,
  onClose,
  onEventClick,
  origin,
  flightsLoading: globalFlightsLoading = false,
}: {
  dest: Destination;
  onClose: () => void;
  onEventClick: (id: string) => void;
  origin: string;
  flightsLoading?: boolean;
}) {
  const [tab, setTab] = useState<DetailTab>('matches');
  const originCode = (origin.split('–')[0] ?? origin).trim();

  return (
    <div className={styles.detail}>
      {/* Header */}
      <div className={styles.detailHeader}>
        <button className={styles.closeBtn} onClick={onClose}>← All venues</button>

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
            {dest.price > 0 ? (
              <>
                <span className={styles.flightBig}>${dest.price}</span>
                <span className={styles.flightSub}>
                  {dest.minDurationMinutes > 0 ? formatDuration(dest.minDurationMinutes) + ' · ' : ''}
                  {dest.directFlight
                    ? 'Direct'
                    : dest.connectingAirport
                    ? `via ${dest.connectingAirport}`
                    : '1 stop'}
                </span>
              </>
            ) : (
              <span className={styles.flightSub}>Loading prices…</span>
            )}
          </div>
        </div>

        {dest.stadiumName && (
          <div className={styles.venueRow}>
            🏟 {dest.stadiumName}
          </div>
        )}

        {/* Tab switcher */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'matches' ? styles.tabActive : ''}`}
            onClick={() => setTab('matches')}
          >
            ⚽ Matches ({dest.events.length})
          </button>
          <button
            className={`${styles.tab} ${tab === 'flights' ? styles.tabActive : ''}`}
            onClick={() => setTab('flights')}
          >
            ✈ Flights
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className={styles.detailBody}>
        {tab === 'matches' && (
          <MatchesTab events={dest.events} onEventClick={onEventClick} />
        )}
        {tab === 'flights' && (
          <FlightsTab
            dest={dest}
            originCode={originCode}
            globalFlightsLoading={globalFlightsLoading}
          />
        )}
      </div>
    </div>
  );
}

// ── Matches tab ───────────────────────────────────────────────────────────────

function MatchesTab({
  events,
  onEventClick,
}: {
  events: WCEvent[];
  onEventClick: (id: string) => void;
}) {
  if (events.length === 0) {
    return <p className={styles.noEvents}>No matches scheduled at this venue.</p>;
  }

  return (
    <>
      {events.map((e) => {
        const stageColor = STAGE_COLORS[e.stage ?? ''] ?? '#50b6ff';
        return (
          <button
            key={e.id}
            className={styles.detailEventCard}
            onClick={() => onEventClick(e.id)}
            style={{ borderColor: `${stageColor}33` }}
          >
            <div className={styles.detailEventLeft}>
              <span className={styles.detailEmoji}>⚽</span>
              <div>
                <div className={styles.detailEventName}>{e.name}</div>
                <div className={styles.detailEventMeta}>
                  <span
                    className={styles.stagePill}
                    style={{ background: `${stageColor}22`, color: stageColor }}
                  >
                    {e.stage}{e.group ? ` · Group ${e.group}` : ''}
                  </span>
                  <span>📅 {formatDate(e.startTime)}</span>
                </div>
              </div>
            </div>
            <div className={styles.detailEventRight}>
              {e.minTicketPrice && (
                <>
                  <span className={styles.detailTicketPrice} style={{ color: stageColor }}>
                    ${e.minTicketPrice}
                  </span>
                  <span className={styles.detailTicketLabel}>tickets from</span>
                </>
              )}
              <span
                className={styles.detailCta}
                style={{ background: `${stageColor}22`, color: stageColor }}
              >
                Plan trip →
              </span>
            </div>
          </button>
        );
      })}
    </>
  );
}

// ── Flights tab ───────────────────────────────────────────────────────────────

function FlightsTab({
  dest,
  originCode,
  globalFlightsLoading = false,
}: {
  dest: Destination;
  originCode: string;
  globalFlightsLoading?: boolean;
}) {
  const [results, setResults] = useState<FlightResult[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!dest.venueId) return;
    setLoading(true);
    setResults(null);
    setError(false);

    // Date window: earliest to latest match at this venue (±3 days padding)
    const dates = dest.events.map((e) => e.startTime.slice(0, 10)).sort();
    const dateFrom = dates[0] ?? '2026-06-11';
    const dateTo = dates[dates.length - 1] ?? '2026-07-19';

    searchFlights(originCode, dest.venueId, dateFrom, dateTo)
      .then((r) => { setResults(r); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [originCode, dest.venueId, dest.events]);

  if (loading || globalFlightsLoading) {
    return (
      <div className={styles.flightsLoading}>
        <div className={styles.loadingSpinner}>✈</div>
        <p>Loading flights to {dest.city}…</p>
        {globalFlightsLoading && (
          <p className={styles.loadingHint}>Fetching 25,000+ flights (first load)</p>
        )}
      </div>
    );
  }

  if (error) {
    return <p className={styles.noEvents}>Could not load flight data.</p>;
  }

  if (!results || results.length === 0) {
    return <p className={styles.noEvents}>No flights found from {originCode} to {dest.city}.</p>;
  }

  // Group by date
  const byDate = new Map<string, FlightResult[]>();
  for (const r of results) {
    const arr = byDate.get(r.date) ?? [];
    arr.push(r);
    byDate.set(r.date, arr);
  }

  return (
    <>
      {[...byDate.entries()].map(([date, dayResults]) => (
        <div key={date} className={styles.flightDateGroup}>
          <div className={styles.flightDateLabel}>
            📅 {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric',
            })}
          </div>
          {dayResults.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      ))}
    </>
  );
}

// ── Flight result card ────────────────────────────────────────────────────────

function FlightCard({ flight }: { flight: FlightResult }) {
  const [expanded, setExpanded] = useState(false);
  const leg1 = flight.legs[0];
  const leg2 = flight.legs[1];

  return (
    <button
      className={`${styles.flightCard} ${flight.direct ? styles.flightCardDirect : ''}`}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className={styles.flightCardTop}>
        <div className={styles.flightCardLeft}>
          <span className={styles.flightBadge} style={{
            background: flight.direct ? 'rgba(87,236,178,0.15)' : 'rgba(80,182,255,0.15)',
            color: flight.direct ? '#57ecb2' : '#50b6ff',
          }}>
            {flight.direct ? 'Direct' : `1 stop · ${flight.connectingAirport}`}
          </span>
          <div className={styles.flightRoute}>
            <span className={styles.flightIata}>{leg1?.origin}</span>
            <span className={styles.flightArrow}>→</span>
            {!flight.direct && leg2 && (
              <>
                <span className={styles.flightHub}>{flight.connectingAirport}</span>
                <span className={styles.flightArrow}>→</span>
              </>
            )}
            <span className={styles.flightIata}>{flight.legs[flight.legs.length - 1]?.destination}</span>
          </div>
          <div className={styles.flightMeta}>
            {leg1?.departureTime} → {flight.legs[flight.legs.length - 1]?.arrivalTime}
            <span className={styles.flightDot}>·</span>
            {formatDuration(flight.totalDurationMin)}
          </div>
        </div>
        <div className={styles.flightCardRight}>
          <div className={styles.flightCardPrice}>${flight.price}</div>
          <div className={styles.flightCardExpand}>{expanded ? '▲' : '▼'}</div>
        </div>
      </div>

      {expanded && (
        <div className={styles.flightLegs}>
          {flight.legs.map((leg, i) => (
            <React.Fragment key={leg.flightNumber + i}>
              <div className={styles.legRow}>
                <div className={styles.legAirline}>
                  <span className={styles.legCode}>{leg.airlineCode}</span>
                  <span className={styles.legNumber}>{leg.flightNumber}</span>
                  {leg.synthesized && <span className={styles.synthLabel}>est.</span>}
                </div>
                <div className={styles.legTimes}>
                  <div className={styles.legTime}>
                    <span className={styles.legIata}>{leg.origin}</span>
                    <span className={styles.legHour}>{leg.departureTime}</span>
                  </div>
                  <div className={styles.legDuration}>{formatDuration(leg.durationMin)}</div>
                  <div className={styles.legTime}>
                    <span className={styles.legHour}>{leg.arrivalTime}</span>
                    <span className={styles.legIata}>{leg.destination}</span>
                  </div>
                </div>
              </div>
              {i < flight.legs.length - 1 && (
                <div className={styles.layoverRow}>
                  🔄 Layover at {leg.destination} · {
                    (() => {
                      const nextLeg = flight.legs[i + 1];
                      if (!nextLeg) return '';
                      const layover = flight.legs.slice(0, i + 1).reduce((s, l) => s + l.durationMin, 0);
                      const totalBeforeNext = flight.totalDurationMin - (flight.legs.slice(i + 1).reduce((s, l) => s + l.durationMin, 0));
                      return formatDuration(totalBeforeNext - layover);
                    })()
                  }
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </button>
  );
}
