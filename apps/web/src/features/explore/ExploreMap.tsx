import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { SPORT_COLORS, SPORT_EMOJI } from '../../data/mock.js';
import styles from './ExploreMap.module.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

// All 39 inbound origins from mock_flights.json + common user origins
const ORIGIN_COORDS: Record<string, { lat: number; lng: number }> = {
  AMS: { lat: 52.3086, lng: 4.7639 },
  AUS: { lat: 30.1944, lng: -97.6699 },
  BNA: { lat: 36.1245, lng: -86.6782 },
  BOG: { lat: 4.7016, lng: -74.1469 },
  CDG: { lat: 49.0097, lng: 2.5479 },
  CLE: { lat: 41.4117, lng: -81.8498 },
  CLT: { lat: 35.2140, lng: -80.9431 },
  CMH: { lat: 39.9980, lng: -82.8919 },
  CUN: { lat: 21.0365, lng: -86.8771 },
  CVG: { lat: 39.0488, lng: -84.6678 },
  DCA: { lat: 38.8521, lng: -77.0402 },
  DEN: { lat: 39.8561, lng: -104.6737 },
  DTW: { lat: 42.2162, lng: -83.3554 },
  DXB: { lat: 25.2532, lng: 55.3657 },
  FRA: { lat: 50.0379, lng: 8.5622 },
  GRU: { lat: -23.4356, lng: -46.4731 },
  ICN: { lat: 37.4602, lng: 126.4407 },
  IND: { lat: 39.7173, lng: -86.2944 },
  JFK: { lat: 40.6413, lng: -73.7781 },
  LAS: { lat: 36.0840, lng: -115.1537 },
  LAX: { lat: 33.9425, lng: -118.4081 },
  LHR: { lat: 51.4775, lng: -0.4614 },
  MAD: { lat: 40.4983, lng: -3.5676 },
  MCO: { lat: 28.4312, lng: -81.3081 },
  MKE: { lat: 42.9472, lng: -87.8966 },
  MSP: { lat: 44.8848, lng: -93.2223 },
  MSY: { lat: 29.9934, lng: -90.2580 },
  NRT: { lat: 35.7653, lng: 140.3864 },
  OMA: { lat: 41.3032, lng: -95.8940 },
  ORD: { lat: 41.9742, lng: -87.9073 },
  PDX: { lat: 45.5887, lng: -122.5975 },
  PHX: { lat: 33.4373, lng: -112.0078 },
  PIT: { lat: 40.4959, lng: -80.2426 },
  RDU: { lat: 35.8801, lng: -78.7880 },
  SLC: { lat: 40.7884, lng: -111.9778 },
  STL: { lat: 38.7487, lng: -90.3700 },
  SYD: { lat: -33.9399, lng: 151.1753 },
  TPA: { lat: 27.9755, lng: -82.5332 },
  TUL: { lat: 36.1984, lng: -95.8881 },
  YUL: { lat: 45.4706, lng: -73.7408 },
  YYC: { lat: 51.1225, lng: -114.0133 },
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
      center: [-87.9073, 41.9742], // Chicago O'Hare
      zoom: 3.2,
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

    const originIata = ((origin ?? 'ORD – Chicago').split('–')[0] ?? 'ORD').trim();
    const originCoords = ORIGIN_COORDS[originIata] ?? { lat: 41.9742, lng: -87.9073 };

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
