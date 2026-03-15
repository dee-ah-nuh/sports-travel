import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import mapboxgl from 'mapbox-gl';
import { MOCK_EVENTS, SPORT_EMOJI, SPORT_COLORS, type MockEvent } from '../../data/mock.js';
import { ItineraryOptionCard } from './ItineraryOptionCard.js';
import { generateMockOptions } from './itinerary.mock.js';
import styles from './ItineraryPage.module.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

// Origin coords (Chicago ORD)
const ORIGIN = { iata: 'ORD', city: 'Chicago', lat: 41.9742, lng: -87.9073 };

// Destination coords per IATA
const DEST_COORDS: Record<string, { lat: number; lng: number }> = {
  LHR: { lat: 51.477928, lng: -0.461941 },
  CDG: { lat: 49.009724, lng: 2.547778 },
  BCN: { lat: 41.297078, lng: 2.078464 },
  MAD: { lat: 40.471926, lng: -3.56264 },
  LIS: { lat: 38.7756, lng: -9.1354 },
  AMS: { lat: 52.3086, lng: 4.7639 },
  MUC: { lat: 48.3538, lng: 11.7861 },
  FCO: { lat: 41.8003, lng: 12.2389 },
  DXB: { lat: 25.2532, lng: 55.3657 },
};

function RouteMap({ destIata, destCity }: { destIata: string; destCity: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPBOX_TOKEN) return;

    const destCoord = DEST_COORDS[destIata];
    if (!destCoord) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const midLng = (ORIGIN.lng + destCoord.lng) / 2;
    const midLat = (ORIGIN.lat + destCoord.lat) / 2;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [midLng, midLat],
      zoom: 2.5,
    });

    map.on('style.load', () => {
      map.setFog({ color: '#0a0c12', 'high-color': '#111420', 'horizon-blend': 0.02 });

      // Great circle arc via intermediate points
      const steps = 60;
      const arcCoords: [number, number][] = [];
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const lng = ORIGIN.lng + (destCoord.lng - ORIGIN.lng) * t;
        const lat = ORIGIN.lat + (destCoord.lat - ORIGIN.lat) * t;
        // Add slight arc
        const arc = Math.sin(Math.PI * t) * 8;
        arcCoords.push([lng, lat + arc]);
      }

      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: arcCoords },
        },
      });

      map.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#57ecb2', 'line-width': 3, 'line-opacity': 0.3, 'line-blur': 4 },
      });

      map.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#57ecb2',
          'line-width': 2,
          'line-opacity': 0.85,
          'line-dasharray': [2, 1.5],
        },
      });

      // Origin marker
      const originEl = makeMarkerEl(ORIGIN.iata, '$0', true);
      new mapboxgl.Marker({ element: originEl })
        .setLngLat([ORIGIN.lng, ORIGIN.lat])
        .addTo(map);

      // Destination marker
      const destEl = makeMarkerEl(destIata, destCity, false);
      new mapboxgl.Marker({ element: destEl })
        .setLngLat([destCoord.lng, destCoord.lat])
        .addTo(map);

      // Plane icon at midpoint
      const planeEl = document.createElement('div');
      planeEl.style.cssText = 'font-size:20px;filter:drop-shadow(0 0 6px #57ecb2);';
      planeEl.textContent = '✈';
      const midArcIdx = Math.floor(steps / 2);
      const midCoord = arcCoords[midArcIdx];
      if (midCoord) {
        new mapboxgl.Marker({ element: planeEl, rotation: 40 })
          .setLngLat(midCoord)
          .addTo(map);
      }
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, [destIata, destCity]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className={styles.mapFallback}>
        <span className={styles.mapFallbackIcon}>✈</span>
        <span className={styles.mapFallbackText}>{ORIGIN.iata} → {destIata}</span>
      </div>
    );
  }

  return <div ref={containerRef} className={styles.routeMapCanvas} />;
}

function makeMarkerEl(code: string, label: string, isOrigin: boolean) {
  const el = document.createElement('div');
  el.style.cssText = `
    background: ${isOrigin ? 'rgba(87,236,178,0.2)' : 'rgba(80,182,255,0.2)'};
    border: 2px solid ${isOrigin ? '#57ecb2' : '#50b6ff'};
    border-radius: 8px;
    padding: 4px 8px;
    display: flex; flex-direction: column; align-items: center;
    gap: 1px;
  `;
  el.innerHTML = `
    <span style="font-size:13px;font-weight:700;color:#eef0ff;letter-spacing:1px">${code}</span>
    <span style="font-size:10px;color:#7a80a0">${label}</span>
  `;
  return el;
}

export function ItineraryPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event: MockEvent | null = eventId
    ? (MOCK_EVENTS[eventId as keyof typeof MOCK_EVENTS] as MockEvent) ?? null
    : null;
  const [selectedOption, setSelectedOption] = useState(0);
  const origin = 'ORD';

  if (!event) {
    return (
      <div className={styles.errorPage}>
        <h2>Event not found</h2>
        <button className={styles.backBtn} onClick={() => navigate('/')}>← Back to Explore</button>
      </div>
    );
  }

  const options = generateMockOptions(origin, event);
  const sportColor = SPORT_COLORS[event.sport] ?? '#50b6ff';
  const destIata = event.venue.nearestIata ?? '';
  const destCity = event.venue.city;

  return (
    <div className={styles.page}>
      {/* Top: Route map */}
      <div className={styles.mapPane}>
        <div className={styles.mapOverlay}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>← Explore</button>
          <div className={styles.routeLabel}>
            <span className={styles.routeCode}>{origin}</span>
            <span className={styles.routeArrow}>✈</span>
            <span className={styles.routeCode}>{destIata || destCity}</span>
          </div>
        </div>
        <RouteMap destIata={destIata} destCity={destCity} />
      </div>

      {/* Bottom: Event + tickets + itinerary */}
      <div className={styles.panelPane}>
        <div className={styles.panelScroll}>
          {/* Event header */}
          <div className={styles.eventHeader}>
            <div className={styles.eventBadge} style={{ background: `${sportColor}20`, borderColor: `${sportColor}44` }}>
              <span>{SPORT_EMOJI[event.sport] ?? '🏆'}</span>
              <span style={{ color: sportColor }}>{event.sport}</span>
            </div>
            <h1 className={styles.eventName}>{event.name}</h1>
            <div className={styles.eventMeta}>
              <span>📍 {event.venue.name}, {event.venue.city}</span>
              <span>·</span>
              <span>📅 {new Date(event.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            {event.homeTeam && event.awayTeam && (
              <div className={styles.matchup}>{event.homeTeam} vs {event.awayTeam}</div>
            )}
          </div>

          {/* Ticket strip */}
          {event.minTicketPrice && (
            <div className={styles.ticketStrip} style={{ borderColor: `${sportColor}33` }}>
              <div className={styles.ticketLeft}>
                <span className={styles.ticketLabel}>Tickets via StubHub</span>
                <span className={styles.ticketRange}>
                  from <strong style={{ color: sportColor }}>{event.currency}{event.minTicketPrice?.toLocaleString()}</strong>
                  {event.maxTicketPrice && ` — ${event.currency}${event.maxTicketPrice?.toLocaleString()}`}
                </span>
              </div>
              <a
                href={event.ticketUrl ?? 'https://www.stubhub.com'}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ticketBtn}
                style={{ background: `${sportColor}22`, color: sportColor, borderColor: `${sportColor}55` }}
              >
                Get Tickets ↗
              </a>
            </div>
          )}

          {/* Itinerary options */}
          <div className={styles.optionsSection}>
            <div className={styles.optionsTabs}>
              {options.map((opt, i) => (
                <button
                  key={opt.id}
                  className={`${styles.tab} ${selectedOption === i ? styles.tabActive : ''}`}
                  onClick={() => setSelectedOption(i)}
                >
                  <span className={styles.tabEmoji}>
                    {opt.label === 'cheapest' ? '💰' : opt.label === 'fastest' ? '⚡' : '⭐'}
                  </span>
                  <span className={styles.tabLabel}>
                    {opt.label === 'cheapest' ? 'Cheapest' : opt.label === 'fastest' ? 'Fastest' : 'Best'}
                  </span>
                  <span className={styles.tabPrice}>${opt.totalCost.toLocaleString()}</span>
                </button>
              ))}
            </div>

            {options[selectedOption] && <ItineraryOptionCard option={options[selectedOption]!} />}
          </div>
        </div>
      </div>
    </div>
  );
}
