/**
 * Analytics event tracking
 * Per PRD Section 7
 */

type AnalyticsEvent = 
  | { type: "search_submitted"; data: { q_len: number; tags_count: number; axes_count: number; radius_m: number } }
  | { type: "results_viewed"; data: { items: number; latency_ms: number } }
  | { type: "venue_opened"; data: { venue_id: string; from: "list" | "map" } }
  | { type: "vibe_check_submitted"; data: { venue_id: string; axes_count: number; overall: string } }
  | { type: "save_clicked"; data: { venue_id: string } }
  | { type: "filters_changed"; data: { tag_count: number; axes_changed: string[] } }
  | { type: "abandon_no_results"; data: { q: string; radius_m: number } }
  | { type: "onboarding_completed"; data: { duration_ms: number } }
  | { type: "onboarding_skipped"; data: {} };

/**
 * Track an analytics event
 * In production, this would send to your analytics service (e.g., Mixpanel, Amplitude, GA4)
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (import.meta.env.DEV) {
    console.log("[Analytics]", event.type, event.data);
  }
  
  // TODO: Integrate with your analytics service
  // Example:
  // mixpanel.track(event.type, event.data);
  // amplitude.track(event.type, event.data);
}

/**
 * Track search submission
 */
export function trackSearch(params: {
  query: string;
  tags: string[];
  axes: Record<string, number>;
  radiusMeters: number;
}) {
  trackEvent({
    type: "search_submitted",
    data: {
      q_len: params.query.length,
      tags_count: params.tags.length,
      axes_count: Object.keys(params.axes).length,
      radius_m: params.radiusMeters,
    },
  });
}

/**
 * Track results view
 */
export function trackResultsViewed(itemCount: number, latencyMs: number) {
  trackEvent({
    type: "results_viewed",
    data: { items: itemCount, latency_ms: latencyMs },
  });
}

/**
 * Track venue detail opened
 */
export function trackVenueOpened(venueId: string, source: "list" | "map") {
  trackEvent({
    type: "venue_opened",
    data: { venue_id: venueId, from: source },
  });
}

/**
 * Track vibe check submission
 */
export function trackVibeCheck(venueId: string, axesCount: number, overall: string) {
  trackEvent({
    type: "vibe_check_submitted",
    data: { venue_id: venueId, axes_count: axesCount, overall },
  });
}

/**
 * Track save action
 */
export function trackSave(venueId: string) {
  trackEvent({
    type: "save_clicked",
    data: { venue_id: venueId },
  });
}

/**
 * Track filter changes
 */
export function trackFiltersChanged(tagCount: number, axesChanged: string[]) {
  trackEvent({
    type: "filters_changed",
    data: { tag_count: tagCount, axes_changed: axesChanged },
  });
}

/**
 * Track no results abandonment
 */
export function trackAbandonNoResults(query: string, radiusMeters: number) {
  trackEvent({
    type: "abandon_no_results",
    data: { q: query, radius_m: radiusMeters },
  });
}
