import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { SPORT_COLORS, SPORT_EMOJI } from '../../data/mock.js';
import styles from './ExploreMap.module.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

const ORIGIN_COORDS: Record<string, { lat: number; lng: number }> = {
  ORD: { lat: 41.9742, lng: -87.9073 },
  JFK: { lat: 40.6413, lng: -73.7781 },
  LAX: { lat: 33.9425, lng: -118.4081 },
  LHR: { lat: 51.477928, lng: -0.461941 },
  CDG: { lat: 49.009724, lng: 2.547778 },
};

interface Event { id: string; name: string; sport: string; }
interface Destination {
  iataCode: string; city: string; country: string; latitude: number; longitude: number;
  price: number; currency: string; eventCount: number; events: Event[];
}
interface Props {
  destinations: Destination[];
  onEventClick: (eventId: string) => void;
  selectedDest?: Destination | null;
  origin?: string;
}

// ── Fallback when no token is set ─────────────────────────────────────────────
function MapPlaceholder({ destinations, onEventClick }: Props) {
  return (
    <div className={styles.mapPlaceholder}>
      <div className={styles.mapBg}>🗺️</div>
      <div className={styles.mapMessage}>
        <h3>Interactive Map</h3>
        <p>Add your Mapbox token to <code>VITE_MAPBOX_TOKEN</code> in <code>.env</code> to enable the map.</p>
        <p className={styles.hint}>Showing {destinations.length} destinations · switch to Grid view above.</p>
      </div>
      <div className={styles.destPins}>
        {destinations.slice(0, 8).map((dest) => (
          <button
            key={dest.iataCode}
            className={`${styles.pin} ${dest.eventCount > 0 ? styles.pinEvent : ''}`}
            onClick={() => dest.events[0] && onEventClick(dest.events[0].id)}
          >
            <span className={styles.pinCity}>{dest.city}</span>
            <span className={styles.pinPrice}>${dest.price}</span>
            {dest.eventCount > 0 && (
              <span className={styles.pinBadge}>{dest.eventCount} 🎟</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Real Mapbox map ───────────────────────────────────────────────────────────
function MapboxMap({ destinations, onEventClick, selectedDest, origin }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const planeMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [ready, setReady] = useState(false);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN!;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [10, 30],
      zoom: 1.8,
      projection: 'globe' as unknown as mapboxgl.ProjectionSpecification,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    map.on('load', () => setReady(true));
    map.on('style.load', () => {
      map.setFog({ color: '#0f1117', 'high-color': '#1a1d27', 'horizon-blend': 0.02 });
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Add/update markers whenever destinations or map readiness changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    destinations.forEach((dest) => {
      const hasEvents = dest.eventCount > 0;
      const topEvent = dest.events[0];
      const color = topEvent ? (SPORT_COLORS[topEvent.sport] ?? '#4f6ef7') : '#4f6ef7';

      // Build marker element
      const el = document.createElement('div');
      el.style.cssText = `
        background: ${hasEvents ? color : '#1e2235'};
        border: 2px solid ${hasEvents ? color : '#3a3f5a'};
        border-radius: 20px;
        padding: 4px 10px;
        display: flex; align-items: center; gap: 5px;
        cursor: pointer;
        box-shadow: 0 2px 12px rgba(0,0,0,0.5);
        transition: box-shadow 0.15s, border-color 0.15s;
        white-space: nowrap;
        will-change: box-shadow;
      `;

      const sportIcon = topEvent ? SPORT_EMOJI[topEvent.sport] ?? '🏆' : '';
      el.innerHTML = `
        ${hasEvents ? `<span style="font-size:12px">${sportIcon}</span>` : ''}
        <span style="font-size:13px;font-weight:700;color:${hasEvents ? '#fff' : '#8b91b0'}">$${dest.price}</span>
      `;

      // Hover: glow effect only — no position movement
      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = `0 0 0 3px ${color}55, 0 4px 20px rgba(0,0,0,0.7)`;
        el.style.borderColor = hasEvents ? '#fff' : color;
      });
      el.addEventListener('mouseleave', () => {
        el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.5)';
        el.style.borderColor = hasEvents ? color : '#3a3f5a';
      });

      // Popup (opens on click via mapboxgl marker default behaviour)
      const popupHtml = `
        <div style="font-family:system-ui;background:#1e2235;border-radius:10px;padding:12px;min-width:180px;">
          <div style="font-size:15px;font-weight:700;color:#f0f2ff;margin-bottom:4px;">${dest.city}</div>
          <div style="font-size:13px;color:#8b91b0;margin-bottom:8px;">from $${dest.price} · ${dest.currency}</div>
          ${dest.events.map((e) => `
            <div style="background:${SPORT_COLORS[e.sport] ?? '#333'}22;border:1px solid ${SPORT_COLORS[e.sport] ?? '#333'}44;border-radius:6px;padding:6px 8px;margin-bottom:4px;cursor:pointer;" data-event-id="${e.id}">
              <span style="font-size:13px">${SPORT_EMOJI[e.sport] ?? '🏆'}</span>
              <span style="font-size:12px;color:#f0f2ff;font-weight:500;">${e.name}</span>
            </div>
          `).join('')}
          ${dest.events.length === 0 ? '<div style="font-size:12px;color:#5a607a;">No upcoming events</div>' : ''}
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 20,
        closeButton: false,
        maxWidth: '240px',
      }).setHTML(popupHtml);

      popup.on('open', () => {
        setTimeout(() => {
          document.querySelectorAll('[data-event-id]').forEach((el) => {
            el.addEventListener('click', () => {
              const id = el.getAttribute('data-event-id');
              if (id) { popup.remove(); onEventClick(id); }
            });
          });
        }, 50);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([Number(dest.longitude), Number(dest.latitude)])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [destinations, ready, onEventClick]);

  // Draw flight arc when a destination is selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const removeArc = () => {
      try {
        if (map.getLayer('explore-route-glow')) map.removeLayer('explore-route-glow');
        if (map.getLayer('explore-route-line')) map.removeLayer('explore-route-line');
        if (map.getSource('explore-route')) map.removeSource('explore-route');
      } catch (_) { /* map may have been removed */ }
      if (planeMarkerRef.current) {
        planeMarkerRef.current.remove();
        planeMarkerRef.current = null;
      }
    };

    if (!selectedDest) {
      removeArc();
      return;
    }

    const originIata = (origin ?? 'ORD – Chicago').split('–')[0].trim();
    const originCoords = ORIGIN_COORDS[originIata] ?? ORIGIN_COORDS['ORD']!;

    const steps = 60;
    const arcCoords: [number, number][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lng = originCoords.lng + (selectedDest.longitude - originCoords.lng) * t;
      const lat = originCoords.lat + (selectedDest.latitude - originCoords.lat) * t;
      const arc = Math.sin(Math.PI * t) * 8;
      arcCoords.push([lng, lat + arc]);
    }

    removeArc();

    map.addSource('explore-route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: { type: 'LineString', coordinates: arcCoords },
      },
    });

    map.addLayer({
      id: 'explore-route-glow',
      type: 'line',
      source: 'explore-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#57ecb2', 'line-width': 4, 'line-opacity': 0.3, 'line-blur': 6 },
    });

    map.addLayer({
      id: 'explore-route-line',
      type: 'line',
      source: 'explore-route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#57ecb2', 'line-width': 2, 'line-opacity': 0.9, 'line-dasharray': [2, 1.5] },
    });

    // Plane icon at arc midpoint
    const planeEl = document.createElement('div');
    // Calculate bearing for rotation
    const dx = selectedDest.longitude - originCoords.lng;
    const dy = selectedDest.latitude - originCoords.lat;
    const bearing = Math.atan2(dx, dy) * (180 / Math.PI);
    planeEl.style.cssText = 'font-size:20px;filter:drop-shadow(0 0 6px #57ecb2);pointer-events:none;';
    planeEl.textContent = '✈';
    const midCoord = arcCoords[Math.floor(steps / 2)];
    if (midCoord) {
      planeMarkerRef.current = new mapboxgl.Marker({ element: planeEl, rotation: bearing - 90 })
        .setLngLat(midCoord)
        .addTo(map);
    }

    // Fit map to show the full route
    const minLng = Math.min(originCoords.lng, selectedDest.longitude);
    const maxLng = Math.max(originCoords.lng, selectedDest.longitude);
    const minLat = Math.min(originCoords.lat, selectedDest.latitude);
    const maxLat = Math.max(originCoords.lat, selectedDest.latitude);
    map.fitBounds(
      [[minLng - 8, minLat - 5], [maxLng + 8, maxLat + 10]],
      { padding: 60, duration: 900, maxZoom: 5 },
    );

    return removeArc;
  }, [selectedDest, ready, origin]);

  return <div ref={containerRef} className={styles.mapCanvas} />;
}

// ── Public export — picks the right implementation ────────────────────────────
export function ExploreMap(props: Props) {
  if (!MAPBOX_TOKEN) return <MapPlaceholder {...props} />;
  return (
    <div className={styles.mapContainer}>
      <MapboxMap {...props} />
    </div>
  );
}
