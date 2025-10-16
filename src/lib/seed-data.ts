/**
 * Seed sample data to localStorage for production demo
 * This ensures the app has data even without a backend
 */

export const SAMPLE_VENUES = [
  {
    venue_id: "sample-cafe-001",
    name: "Tatte Bakery & Cafe",
    lat: 42.373611,
    lon: -71.118944,
    primary_vibe: "cozy",
    vibe_tags: ["cozy", "studious", "trendy"],
    axes: {
      noise_level: 0.4,
      price_level: 0.6,
      wifi_quality: 0.8,
      crowd_density: 0.7,
      lighting: 0.7,
      seating_comfort: 0.8,
    },
    is_verified: true,
    confidence: 0.95,
    contributor_name: "AI Vibe Maps Team",
  },
  {
    venue_id: "sample-cafe-002",
    name: "Pavement Coffeehouse",
    lat: 42.373333,
    lon: -71.119167,
    primary_vibe: "studious",
    vibe_tags: ["studious", "quiet", "cozy"],
    axes: {
      noise_level: 0.2,
      price_level: 0.4,
      wifi_quality: 0.9,
      crowd_density: 0.5,
      lighting: 0.6,
      seating_comfort: 0.6,
    },
    is_verified: true,
    confidence: 0.92,
    contributor_name: "AI Vibe Maps Team",
  },
  {
    venue_id: "sample-cafe-003",
    name: "Render Coffee",
    lat: 42.372778,
    lon: -71.116944,
    primary_vibe: "trendy",
    vibe_tags: ["trendy", "modern", "vibrant"],
    axes: {
      noise_level: 0.6,
      price_level: 0.7,
      wifi_quality: 0.8,
      crowd_density: 0.8,
      lighting: 0.8,
      seating_comfort: 0.7,
    },
    is_verified: true,
    confidence: 0.88,
    contributor_name: "AI Vibe Maps Team",
  },
  {
    venue_id: "sample-cafe-004",
    name: "Cafe Nero",
    lat: 42.372222,
    lon: -71.118056,
    primary_vibe: "vibrant",
    vibe_tags: ["vibrant", "social", "energetic"],
    axes: {
      noise_level: 0.7,
      price_level: 0.5,
      wifi_quality: 0.7,
      crowd_density: 0.9,
      lighting: 0.7,
      seating_comfort: 0.6,
    },
    is_verified: true,
    confidence: 0.85,
    contributor_name: "AI Vibe Maps Team",
  },
  {
    venue_id: "sample-lib-001",
    name: "Widener Library",
    lat: 42.374444,
    lon: -71.116667,
    primary_vibe: "quiet",
    vibe_tags: ["quiet", "studious", "historic"],
    axes: {
      noise_level: 0.1,
      price_level: 0.0,
      wifi_quality: 0.9,
      crowd_density: 0.4,
      lighting: 0.5,
      seating_comfort: 0.7,
    },
    is_verified: true,
    confidence: 0.98,
    contributor_name: "AI Vibe Maps Team",
  },
  {
    venue_id: "sample-restaurant-001",
    name: "Felipe's Taqueria",
    lat: 42.373056,
    lon: -71.118611,
    primary_vibe: "energetic",
    vibe_tags: ["energetic", "casual", "social"],
    axes: {
      noise_level: 0.8,
      price_level: 0.3,
      wifi_quality: 0.6,
      crowd_density: 0.9,
      lighting: 0.7,
      seating_comfort: 0.5,
    },
    is_verified: true,
    confidence: 0.9,
    contributor_name: "AI Vibe Maps Team",
  },
  {
    venue_id: "sample-cafe-005",
    name: "Clover Food Lab",
    lat: 42.373889,
    lon: -71.117778,
    primary_vibe: "healthy",
    vibe_tags: ["healthy", "modern", "casual"],
    axes: {
      noise_level: 0.5,
      price_level: 0.5,
      wifi_quality: 0.7,
      crowd_density: 0.7,
      lighting: 0.8,
      seating_comfort: 0.6,
    },
    is_verified: true,
    confidence: 0.87,
    contributor_name: "AI Vibe Maps Team",
  },
  {
    venue_id: "sample-bookstore-001",
    name: "Harvard Book Store",
    lat: 42.372500,
    lon: -71.117500,
    primary_vibe: "cozy",
    vibe_tags: ["cozy", "quiet", "intellectual"],
    axes: {
      noise_level: 0.2,
      price_level: 0.6,
      wifi_quality: 0.5,
      crowd_density: 0.4,
      lighting: 0.6,
      seating_comfort: 0.7,
    },
    is_verified: true,
    confidence: 0.91,
    contributor_name: "AI Vibe Maps Team",
  },
];

/**
 * Initialize localStorage with sample data if it's empty
 * This runs once on first app load
 * 
 * Toggle via VITE_ENABLE_SEED_DATA environment variable
 * Set to 'false' when using a real backend
 */
export function seedSampleData() {
  // Check if seeding is enabled (default: true for demos)
  const envValue = import.meta.env.VITE_ENABLE_SEED_DATA;
  const seedingEnabled = envValue === undefined || envValue === "true" || envValue === true;
  
  console.log("🌱 Seed data config:", { envValue, seedingEnabled });
  
  if (!seedingEnabled) {
    console.log("⏭️ Sample data seeding disabled (VITE_ENABLE_SEED_DATA=false)");
    return;
  }
  
  // Check if we've already seeded data
  const hasSeeded = localStorage.getItem("data_seeded");
  const existingVerified = JSON.parse(localStorage.getItem("verified_venues") || "[]");
  
  console.log("📊 Current state:", { 
    hasSeeded, 
    existingVenueCount: existingVerified.length 
  });
  
  // Seed if never seeded OR if seeded but venues are missing (recovery)
  if (!hasSeeded || existingVerified.length === 0) {
    console.log("🌱 Seeding sample venue data...");
    
    localStorage.setItem("verified_venues", JSON.stringify(SAMPLE_VENUES));
    console.log(`✅ Seeded ${SAMPLE_VENUES.length} sample venues`);
    
    // Mark as seeded
    localStorage.setItem("data_seeded", "true");
    localStorage.setItem("data_seeded_timestamp", new Date().toISOString());
  } else {
    console.log(`ℹ️ Sample data already present (${existingVerified.length} venues)`);
  }
}

/**
 * Reset all data (useful for testing)
 */
export function resetAllData() {
  const keys = [
    "verified_venues",
    "user_contributions",
    "data_seeded",
    "data_seeded_timestamp",
    "vibe_profile",
    "auth_token",
    "user_email",
  ];
  
  keys.forEach((key) => localStorage.removeItem(key));
  
  // Remove dynamic keys (upvotes, reviews, etc.)
  const allKeys = Object.keys(localStorage);
  allKeys.forEach((key) => {
    if (key.startsWith("upvotes_") || key.startsWith("reviews_")) {
      localStorage.removeItem(key);
    }
  });
  
  console.log("🗑️ All data cleared. Refresh to reseed.");
}

// Expose reset function for debugging in console
if (typeof window !== "undefined") {
  (window as any).resetAppData = resetAllData;
}
