/**
 * Haversine formula to calculate distance between two coordinates
 * @param coord1 First coordinate {lat, lon}
 * @param coord2 Second coordinate {lat, lon}
 * @returns Distance in meters
 */
export function haversine(
  coord1: { lat: number; lon: number },
  coord2: { lat: number; lon: number }
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lon - coord1.lon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Convert distance in meters to walking time text
 * Assumes walking speed of 80 m/min
 * @param meters Distance in meters
 * @returns Human-readable text like "8 min walk" or "0.5 mi"
 */
export function toWalkingText(meters: number): string {
  const WALKING_SPEED = 80; // meters per minute
  const METERS_PER_MILE = 1609.34;

  if (meters < 400) {
    // Show walking time for close distances
    const minutes = Math.round(meters / WALKING_SPEED);
    return `${minutes} min walk`;
  } else {
    // Show miles for farther distances
    const miles = meters / METERS_PER_MILE;
    return `${miles.toFixed(1)} mi`;
  }
}

/**
 * Get user's current geolocation
 * @returns Promise resolving to {lat, lon} or null if unavailable
 */
export function getUserLocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      },
      { timeout: 5000 }
    );
  });
}

// Harvard Square default coordinates
export const HARVARD_SQUARE = {
  lat: 42.3736,
  lon: -71.1097,
};
