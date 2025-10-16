/**
 * Feature flags for the application
 * Per PRD Section 9
 */

export const featureFlags = {
  // Use mock data instead of real API (default true during dev)
  useMocks: import.meta.env.VITE_USE_MOCKS !== "false",
  
  // Enable client-side personalization boost based on vibe profile
  clientRerank: import.meta.env.VITE_CLIENT_RERANK === "true",
  
  // Auto-refresh results when map is moved
  autoMapUpdate: import.meta.env.VITE_AUTO_MAP_UPDATE === "true",
  
  // Show dev badge with environment info
  showDevBadge: import.meta.env.DEV,
} as const;

/**
 * Get API base URL from environment or default to mocks
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature] === true;
}
