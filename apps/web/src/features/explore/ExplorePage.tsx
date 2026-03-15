import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { SearchBar } from './SearchBar.js';
import { ExploreMap } from './ExploreMap.js';
import { FilterBar } from './FilterBar.js';
import { ExplorePanel } from './ExplorePanel.js';
import { MOCK_DESTINATIONS, SPORTS } from '../../data/mock.js';
import styles from './ExplorePage.module.css';

type SortMode = 'price' | 'events' | 'duration';

export function ExplorePage() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortMode>('events');
  const [maxBudget, setMaxBudget] = useState(1500);
  const [origin, setOrigin] = useState('ORD – Chicago');
  const [selectedDestIata, setSelectedDestIata] = useState<string | null>(null);

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

  const selectedDest = selectedDestIata
    ? filtered.find((d) => d.iataCode === selectedDestIata) ?? null
    : null;

  const handleMarkerClick = (eventId: string) => {
    // Find destination for this event and select it in the panel
    const dest = filtered.find((d) => d.events.some((e) => e.id === eventId));
    if (dest) setSelectedDestIata(dest.iataCode);
  };

  const handleEventClick = (eventId: string) => navigate(`/itinerary/${eventId}`);
  const handleDestSelect = (iata: string | null) => setSelectedDestIata(iata);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>ST</span>
            <span className={styles.logoText}>Sports Travel</span>
          </div>
          <SearchBar origin={origin} onOriginChange={setOrigin} />
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

      <div className={styles.splitLayout}>
        {/* Top: Map */}
        <div className={styles.mapPane}>
          <ExploreMap
            destinations={filtered}
            onEventClick={handleMarkerClick}
          />
        </div>

        {/* Bottom: Info panel */}
        <div className={styles.panelPane}>
          <ExplorePanel
            destinations={filtered}
            selectedDest={selectedDest}
            onDestSelect={handleDestSelect}
            onEventClick={handleEventClick}
            origin={origin}
          />
        </div>
      </div>
    </div>
  );
}
