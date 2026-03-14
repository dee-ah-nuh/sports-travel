import React from 'react';
import { SPORT_EMOJI, SPORT_COLORS } from '../../data/mock.js';
import styles from './FilterBar.module.css';

interface Props {
  selectedSport: string;
  onSportChange: (s: string) => void;
  sortBy: string;
  onSortChange: (s: 'price' | 'events' | 'duration') => void;
  maxBudget: number;
  onBudgetChange: (n: number) => void;
  sports: readonly string[];
}

export function FilterBar({ selectedSport, onSportChange, sortBy, onSortChange, maxBudget, onBudgetChange, sports }: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {/* Sport chips */}
        <div className={styles.chips}>
          {sports.map((sport) => (
            <button
              key={sport}
              className={`${styles.chip} ${selectedSport === sport ? styles.active : ''}`}
              onClick={() => onSportChange(sport)}
              style={selectedSport === sport && sport !== 'all' ? { borderColor: SPORT_COLORS[sport], color: SPORT_COLORS[sport], backgroundColor: `${SPORT_COLORS[sport]}22` } : {}}
            >
              {sport === 'all' ? '🌍 All Sports' : `${SPORT_EMOJI[sport] ?? '🏆'} ${sport.charAt(0).toUpperCase() + sport.slice(1)}`}
            </button>
          ))}
        </div>

        <div className={styles.controls}>
          {/* Sort */}
          <div className={styles.control}>
            <label className={styles.label}>Sort</label>
            <select className={styles.select} value={sortBy} onChange={(e) => onSortChange(e.target.value as 'price' | 'events' | 'duration')}>
              <option value="events">Most events</option>
              <option value="price">Cheapest</option>
              <option value="duration">Shortest flight</option>
            </select>
          </div>

          {/* Budget slider */}
          <div className={styles.control}>
            <label className={styles.label}>Budget: <strong>${maxBudget.toLocaleString()}</strong></label>
            <input
              type="range" min={200} max={2000} step={50}
              value={maxBudget}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
