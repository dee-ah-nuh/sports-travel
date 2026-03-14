import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { SearchBar } from './SearchBar.js';
import { DestinationGrid } from './DestinationGrid.js';
import { ExploreMap } from './ExploreMap.js';
import { FilterBar } from './FilterBar.js';
import { MOCK_DESTINATIONS, SPORTS } from '../../data/mock.js';
import styles from './ExplorePage.module.css';

type ViewMode = 'grid' | 'map';
type SortMode = 'price' | 'events' | 'duration';

export function ExplorePage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortMode>('events');
  const [maxBudget, setMaxBudget] = useState(1500);
  const [origin, setOrigin] = useState('ORD – Chicago');
  const [selectedDest, setSelectedDest] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let dests = MOCK_DESTINATIONS.filter((d) => d.iataCode !== 'ORD' && d.price <= maxBudget);
    if (selectedSport !== 'all') {
      dests = dests.filter((d) => d.events.some((e) => e.sport === selectedSport));
    }
    return dests.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'events') return b.eventCount - a.eventCount;
      if (sortBy === 'duration') return a.minDurationMinutes - b.minDurationMinutes;
      return 0;
    });
  }, [selectedSport, sortBy, maxBudget]);

  const handleEventClick = (eventId: string) => navigate(`/itinerary/${eventId}`);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoEmoji}>✈️</span>
            <span className={styles.logoText}>Sports Travel</span>
          </div>
          <SearchBar origin={origin} onOriginChange={setOrigin} />
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >⊞ Grid</button>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'map' ? styles.active : ''}`}
              onClick={() => setViewMode('map')}
            >🗺 Map</button>
          </div>
        </div>
      </header>

      <FilterBar
        selectedSport={selectedSport}
        onSportChange={setSelectedSport}
        sortBy={sortBy}
        onSortChange={setSortBy}
        maxBudget={maxBudget}
        onBudgetChange={setMaxBudget}
        sports={['all', ...SPORTS]}
      />

      <main className={styles.main}>
        {viewMode === 'grid' ? (
          <DestinationGrid
            destinations={filtered}
            onEventClick={handleEventClick}
            selectedDest={selectedDest}
            onDestSelect={setSelectedDest}
          />
        ) : (
          <ExploreMap
            destinations={filtered}
            onEventClick={handleEventClick}
          />
        )}
      </main>
    </div>
  );
}
