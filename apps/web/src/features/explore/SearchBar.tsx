import React from 'react';
import styles from './SearchBar.module.css';

interface Props {
  origin: string;
  onOriginChange: (v: string) => void;
}

// Origins that have direct inbound flights in wc2026_flights.json are marked (direct)
// Others will show connecting flight options
const POPULAR_ORIGINS = [
  'ORD – Chicago',       // direct
  'LHR – London',        // direct
  'CDG – Paris',         // direct
  'AMS – Amsterdam',     // direct
  'MAD – Madrid',        // direct
  'DEN – Denver',        // direct
  'DXB – Dubai',         // direct
  'ICN – Seoul',         // direct
  'NRT – Tokyo',         // direct
  'FRA – Frankfurt',     // direct
  'YUL – Montréal',      // direct
  'YYC – Calgary',       // direct
  'GRU – São Paulo',     // direct
  'BOG – Bogotá',        // direct
  'SYD – Sydney',        // direct
  'MSP – Minneapolis',   // direct
  'DCA – Washington DC', // direct
  'DFW – Dallas',        // direct (venue, also origin)
  'JFK – New York',      // connecting
  'LAX – Los Angeles',   // connecting
  'MEX – Mexico City',   // connecting
];

export function SearchBar({ origin, onOriginChange }: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.field}>
        <span className={styles.icon}>✈️</span>
        <select
          className={styles.select}
          value={origin}
          onChange={(e) => onOriginChange(e.target.value)}
        >
          {POPULAR_ORIGINS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className={styles.divider} />
      <div className={styles.field}>
        <span className={styles.icon}>📅</span>
        <span className={styles.placeholder}>Any time · 2026</span>
      </div>
    </div>
  );
}
