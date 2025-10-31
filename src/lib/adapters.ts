import { Venue, VenueVM } from "@/types/venue";
import { haversine, toWalkingText } from "./geo";

/**
 * Clamp a value between 0 and 1
 */
function clamp01(value: number | undefined): number {
  if (value === undefined) return 0;
  return Math.max(0, Math.min(1, value));
}

/**
 * Format axis key to human-readable label
 */
function formatAxisLabel(key: string): string {
  const labels: Record<string, string> = {
    casualness: "Casualness",
    comfort: "Comfort",
    energy: "Energy",
    elegance: "Elegance",
    authenticity: "Authenticity",
    // Legacy support
    noise_level: "Noise",
    lighting_warmth: "Lighting",
    crowd_density: "Crowd",
    price_level: "Price",
  };
  return labels[key] || key;
}

/**
 * Convert Venue DTO to VenueVM for UI consumption
 * @param dto Venue from backend
 * @param userGeo Optional user location for distance calculation
 * @returns VenueVM ready for components
 */
export function toVenueVM(
  dto: Venue,
  userGeo?: { lat: number; lon: number }
): VenueVM {
  const axes = dto.llm_labels?.axes ?? {};
  
  // Define priority order for radar display - 5 core vibe metrics
  const radarKeysPriority = [
    "casualness",
    "comfort",
    "energy",
    "elegance",
    "authenticity",
    // Legacy support
    "noise_level",
    "price_level",
    "crowd_density",
  ];

  // Filter to only axes that exist in the data
  const radarKeys = radarKeysPriority.filter((k) => k in axes);

  // Calculate distance text
  const venueGeo = { lat: dto.geo.lat, lon: dto.geo.lon } as { lat: number; lon: number };
  const distanceText = userGeo
    ? toWalkingText(haversine(userGeo, venueGeo))
    : "";

  return {
    id: dto.venue_id,
    name: dto.name,
    distanceText,
    primaryVibe: dto.llm_labels?.vibe_tags?.[0] ?? "unknown",
    tags: dto.llm_labels?.vibe_tags ?? [],
    radar: radarKeys.map((k) => ({
      key: k,
      value: clamp01(axes[k as keyof typeof axes]),
      label: formatAxisLabel(k),
    })),
    rationale: (dto.llm_labels?.rationales ?? [])
      .slice(0, 3)
      .map((s) => s.slice(0, 140)),
    confidence: dto.confidence,
    heroImage: dto.images?.[0]?.url,
    category: dto.metadata?.category,
    address: dto.metadata?.addr,
    rating: dto.agg_signals?.avg_rating,
    timeNotes: dto.time_notes,
    geo: venueGeo,
    
    // Contribution metadata
    isVerified: dto.is_verified,
    isTemporary: dto.is_temporary,
    contributorName: dto.contributor_name,
    isAnonymous: dto.is_anonymous,
    contributionDate: dto.contribution_date,
  };
}

/**
 * Convert array of Venues to VenueVMs
 */
export function toVenueVMs(
  dtos: Venue[],
  userGeo?: { lat: number; lon: number }
): VenueVM[] {
  return dtos.map((dto) => toVenueVM(dto, userGeo));
}
