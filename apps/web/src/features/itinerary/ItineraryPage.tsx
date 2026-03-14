import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MOCK_EVENTS, SPORT_EMOJI, SPORT_COLORS, type MockEvent } from '../../data/mock.js';
import { ItineraryOptionCard } from './ItineraryOptionCard.js';
import { generateMockOptions } from './itinerary.mock.js';
import styles from './ItineraryPage.module.css';

export function ItineraryPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event: MockEvent | null = eventId
    ? (MOCK_EVENTS[eventId as keyof typeof MOCK_EVENTS] as MockEvent) ?? null
    : null;
  const [selectedOption, setSelectedOption] = useState(0);
  const [origin] = useState('ORD');

  if (!event) {
    return (
      <div className={styles.error}>
        <h2>Event not found</h2>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← Back to Explore</button>
      </div>
    );
  }

  const options = generateMockOptions(origin, event);
  const sportColor = SPORT_COLORS[event.sport] ?? '#6b7280';

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← Explore</button>
        <div className={styles.headerInner}>
          <div className={styles.eventBadge} style={{ backgroundColor: `${sportColor}22`, borderColor: `${sportColor}44` }}>
            <span className={styles.sportEmoji}>{SPORT_EMOJI[event.sport] ?? '🏆'}</span>
            <span className={styles.sportName} style={{ color: sportColor }}>{event.sport.charAt(0).toUpperCase() + event.sport.slice(1)}</span>
          </div>
          <h1 className={styles.eventName}>{event.name}</h1>
          <div className={styles.eventMeta}>
            <span>📍 {event.venue.name}, {event.venue.city}</span>
            <span>·</span>
            <span>📅 {new Date(event.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          {event.homeTeam && event.awayTeam && (
            <div className={styles.matchup}>
              {event.homeTeam} vs {event.awayTeam}
            </div>
          )}
        </div>

        {/* Ticket summary */}
        <div className={styles.ticketBox}>
          <div className={styles.ticketLabel}>Tickets from StubHub</div>
          <div className={styles.ticketPrice} style={{ color: sportColor }}>
            {event.currency}{event.minTicketPrice?.toLocaleString()}
          </div>
          <div className={styles.ticketRange}>up to {event.currency}{event.maxTicketPrice?.toLocaleString()}</div>
          <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className={styles.ticketBtn} style={{ backgroundColor: sportColor }}>
            Get Tickets
          </a>
        </div>
      </header>

      {/* Itinerary options */}
      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>✈️ Itinerary Options from Chicago (ORD)</h2>
        <p className={styles.sectionSub}>Depart 1–2 days before · Return same night or next morning</p>

        <div className={styles.optionsTabs}>
          {options.map((opt, i) => (
            <button
              key={opt.id}
              className={`${styles.tab} ${selectedOption === i ? styles.tabActive : ''}`}
              onClick={() => setSelectedOption(i)}
            >
              <span className={styles.tabLabel}>{opt.label === 'cheapest' ? '💰 Cheapest' : opt.label === 'fastest' ? '⚡ Fastest' : '⭐ Best'}</span>
              <span className={styles.tabPrice}>${opt.totalCost.toLocaleString()}</span>
            </button>
          ))}
        </div>

        {options[selectedOption] && <ItineraryOptionCard option={options[selectedOption]!} />}
      </div>
    </div>
  );
}
