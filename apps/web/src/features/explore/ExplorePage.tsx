import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { SearchBar } from './SearchBar.js';
import { ExploreMap } from './ExploreMap.js';
import { FilterBar } from './FilterBar.js';
import { ExplorePanel } from './ExplorePanel.js';
import { MOCK_DESTINATIONS, SPORTS } from '../../data/mock.js';
import styles from './ExplorePage.module.css';

type SortMode = 'price' | 'events' | 'duration';

const DEFAULT_PANEL_HEIGHT = 300;
const MIN_PANEL_HEIGHT = 72;

export function ExplorePage() {
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortMode>('events');
  const [maxBudget, setMaxBudget] = useState(1500);
  const [origin, setOrigin] = useState('ORD – Chicago');
  const [selectedDestIata, setSelectedDestIata] = useState<string | null>(null);
  const [panelHeight, setPanelHeight] = useState(DEFAULT_PANEL_HEIGHT);
  const [collapsed, setCollapsed] = useState(false);

  const splitRef = useRef<HTMLDivElement>(null);
  const prevHeightRef = useRef(DEFAULT_PANEL_HEIGHT);

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
    const dest = filtered.find((d) => d.events.some((e) => e.id === eventId));
    if (dest) {
      setSelectedDestIata(dest.iataCode);
      // Expand panel if collapsed
      if (collapsed) {
        setCollapsed(false);
        setPanelHeight(prevHeightRef.current);
      }
    }
  };

  const handleEventClick = (eventId: string) => navigate(`/itinerary/${eventId}`);
  const handleDestSelect = (iata: string | null) => setSelectedDestIata(iata);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = panelHeight;

    const onMouseMove = (e: MouseEvent) => {
      const splitH = splitRef.current?.clientHeight ?? 600;
      const maxH = splitH - 150;
      const delta = startY - e.clientY;
      const newH = Math.max(MIN_PANEL_HEIGHT, Math.min(maxH, startH + delta));
      setPanelHeight(newH);
      if (newH > MIN_PANEL_HEIGHT + 10) setCollapsed(false);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [panelHeight]);

  const toggleCollapse = () => {
    if (collapsed) {
      setCollapsed(false);
      setPanelHeight(prevHeightRef.current);
    } else {
      prevHeightRef.current = panelHeight;
      setCollapsed(true);
      setPanelHeight(MIN_PANEL_HEIGHT);
    }
  };

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

      <div className={styles.splitLayout} ref={splitRef}>
        {/* Map fills remaining space above panel */}
        <div className={styles.mapPane}>
          <ExploreMap
            destinations={filtered}
            onEventClick={handleMarkerClick}
            selectedDest={selectedDest}
            origin={origin}
          />
        </div>

        {/* Drag handle */}
        <div
          className={styles.resizeHandle}
          onMouseDown={handleResizeStart}
        >
          <div className={styles.resizeGrip} />
          <button
            className={styles.collapseBtn}
            onClick={toggleCollapse}
            title={collapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {collapsed ? '▲' : '▼'}
          </button>
        </div>

        {/* Bottom info panel */}
        <div className={styles.panelPane} style={{ height: panelHeight }}>
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
