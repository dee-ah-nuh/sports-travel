import React from 'react';
import styles from './SearchBar.module.css';

interface Props {
  origin: string;
  onOriginChange: (v: string) => void;
}

const POPULAR_ORIGINS = ['ORD – Chicago', 'JFK – New York', 'LAX – Los Angeles', 'LHR – London', 'CDG – Paris'];

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
