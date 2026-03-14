/** Haversine distance between two lat/lng points in kilometers */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Get bounding box [minLng, minLat, maxLng, maxLat] for a center + radius (km) */
export function getBoundingBox(
  centerLat: number,
  centerLng: number,
  radiusKm: number,
): [number, number, number, number] {
  const latDelta = (radiusKm / 111) as number;
  const lngDelta = radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180));
  return [
    centerLng - lngDelta,
    centerLat - latDelta,
    centerLng + lngDelta,
    centerLat + latDelta,
  ];
}

/** Sport emoji map */
export const SPORT_EMOJI: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  tennis: '🎾',
  formula1: '🏎️',
  baseball: '⚾',
  cricket: '🏏',
  rugby: '🏉',
  golf: '⛳',
  cycling: '🚴',
  athletics: '🏃',
  other: '🏆',
};
