import { Venue } from "@/types/venue";

/**
 * Mock venue data for Harvard Square area
 * Per PRD Section 10 - realistic ranges and tag mixes
 */
export const MOCK_VENUES: Venue[] = [
  {
    venue_id: "harv-cafe-001",
    name: "Andover Café",
    geo: { lat: 42.3741, lon: -71.1162 },
    images: [
      { url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800" }
    ],
    metadata: {
      category: "cafe",
      price_level: 2,
      addr: "75 Mt Auburn St, Cambridge, MA",
    },
    llm_labels: {
      vibe_tags: ["cozy", "studious", "hidden_gem"],
      axes: {
        noise_level: 0.25,
        lighting_warmth: 0.85,
        crowd_density: 0.40,
        price_level: 0.45,
        formality: 0.20,
      },
      rationales: [
        "Mentioned candles and soft jazz in reviews",
        "Perfect for laptop work with reliable WiFi",
        "Less crowded than chain cafes nearby",
      ],
    },
    agg_signals: {
      avg_rating: 4.3,
      review_count: 128,
      recentness_days: 14,
      image_count: 12,
    },
    confidence: 0.82,
    updated_at: "2025-10-16T12:00:00Z",
  },
  {
    venue_id: "harv-lib-001",
    name: "Widener Library",
    geo: { lat: 42.3744, lon: -71.1169 },
    images: [
      { url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800" }
    ],
    metadata: {
      category: "library",
      price_level: 0,
      addr: "Harvard Yard, Cambridge, MA",
    },
    llm_labels: {
      vibe_tags: ["quiet", "studious", "historic"],
      axes: {
        noise_level: 0.05,
        crowd_density: 0.60,
        formality: 0.80,
        authenticity: 0.95,
      },
      rationales: [
        "Harvard's flagship library - absolute silence enforced",
        "Beautiful architecture inspires focused work",
        "Can get crowded during exam periods",
      ],
    },
    agg_signals: {
      avg_rating: 4.8,
      review_count: 342,
      recentness_days: 7,
    },
    confidence: 0.91,
    updated_at: "2025-10-16T10:00:00Z",
  },
  {
    venue_id: "harv-bar-001",
    name: "The Sinclair",
    geo: { lat: 42.3740, lon: -71.1189 },
    images: [
      { url: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800" }
    ],
    metadata: {
      category: "bar",
      price_level: 3,
      addr: "52 Church St, Cambridge, MA",
    },
    llm_labels: {
      vibe_tags: ["lively", "social", "date_spot", "late_night"],
      axes: {
        noise_level: 0.85,
        lighting_warmth: 0.40,
        crowd_density: 0.75,
        price_level: 0.70,
        music_energy: 0.90,
        formality: 0.30,
      },
      rationales: [
        "Live music venue with excellent acoustics",
        "Craft cocktails and energetic atmosphere",
        "Gets very loud after 9pm",
      ],
    },
    agg_signals: {
      avg_rating: 4.5,
      review_count: 567,
      recentness_days: 3,
      image_count: 89,
    },
    confidence: 0.88,
    updated_at: "2025-10-16T11:30:00Z",
    time_notes: "Much quieter before 8pm, becomes a loud music venue after",
  },
  {
    venue_id: "harv-bakery-001",
    name: "Tatte Bakery & Café",
    geo: { lat: 42.3736, lon: -71.1189 },
    images: [
      { url: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800" }
    ],
    metadata: {
      category: "bakery",
      price_level: 3,
      addr: "1288 Massachusetts Ave, Cambridge, MA",
    },
    llm_labels: {
      vibe_tags: ["instagram_worthy", "romantic", "bougie", "brunch"],
      axes: {
        noise_level: 0.60,
        lighting_warmth: 0.75,
        crowd_density: 0.70,
        price_level: 0.75,
        formality: 0.40,
        novelty: 0.60,
      },
      rationales: [
        "Stunning Middle Eastern-inspired décor",
        "Beautiful pastries and latte art",
        "Popular brunch spot - expect waits on weekends",
      ],
    },
    agg_signals: {
      avg_rating: 4.6,
      review_count: 891,
      recentness_days: 2,
      image_count: 234,
    },
    confidence: 0.85,
    updated_at: "2025-10-16T09:00:00Z",
  },
  {
    venue_id: "harv-diner-001",
    name: "Charlie's Kitchen",
    geo: { lat: 42.3751, lon: -71.1186 },
    images: [
      { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800" }
    ],
    metadata: {
      category: "diner",
      price_level: 1,
      addr: "10 Eliot St, Cambridge, MA",
      },
    llm_labels: {
      vibe_tags: ["casual", "budget", "dive_bar", "group_friendly"],
      axes: {
        noise_level: 0.70,
        crowd_density: 0.65,
        price_level: 0.25,
        formality: 0.15,
        authenticity: 0.85,
      },
      rationales: [
        "Classic Cambridge dive with cheap burgers",
        "Lively atmosphere, great for groups",
        "Cash-only upstairs bar",
      ],
    },
    agg_signals: {
      avg_rating: 4.2,
      review_count: 456,
      recentness_days: 5,
    },
    confidence: 0.79,
    updated_at: "2025-10-15T16:00:00Z",
  },
  {
    venue_id: "harv-coffee-002",
    name: "Café Nero",
    geo: { lat: 42.3730, lon: -71.1195 },
    images: [
      { url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800" }
    ],
    metadata: {
      category: "coffee_shop",
      price_level: 2,
      addr: "1 Harvard Square, Cambridge, MA",
    },
    llm_labels: {
      vibe_tags: ["cozy", "third_wave_coffee", "studenty"],
      axes: {
        noise_level: 0.50,
        lighting_warmth: 0.70,
        crowd_density: 0.75,
        price_level: 0.50,
        formality: 0.25,
      },
      rationales: [
        "European-style coffee chain with good WiFi",
        "Popular student hangout spot",
        "Can get crowded during peak hours",
      ],
    },
    agg_signals: {
      avg_rating: 4.1,
      review_count: 234,
      recentness_days: 1,
    },
    confidence: 0.76,
    updated_at: "2025-10-16T08:00:00Z",
  },
  {
    venue_id: "harv-restaurant-001",
    name: "Harvest Restaurant",
    geo: { lat: 42.3738, lon: -71.1201 },
    images: [
      { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800" }
    ],
    metadata: {
      category: "restaurant",
      price_level: 4,
      addr: "44 Brattle St, Cambridge, MA",
    },
    llm_labels: {
      vibe_tags: ["romantic", "upscale", "date_spot", "farm_to_table"],
      axes: {
        noise_level: 0.35,
        lighting_warmth: 0.80,
        crowd_density: 0.50,
        price_level: 0.85,
        formality: 0.70,
        authenticity: 0.75,
      },
      rationales: [
        "Farm-to-table fine dining with seasonal menu",
        "Intimate atmosphere perfect for special occasions",
        "Known for creative New England cuisine",
      ],
    },
    agg_signals: {
      avg_rating: 4.7,
      review_count: 678,
      recentness_days: 4,
      image_count: 145,
    },
    confidence: 0.89,
    updated_at: "2025-10-16T13:00:00Z",
  },
  {
    venue_id: "harv-park-001",
    name: "Cambridge Common",
    geo: { lat: 42.3774, lon: -71.1214 },
    images: [
      { url: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800" }
    ],
    metadata: {
      category: "park",
      price_level: 0,
      addr: "Cambridge Common, Cambridge, MA",
    },
    llm_labels: {
      vibe_tags: ["outdoorsy", "quiet", "historic", "pet_friendly"],
      axes: {
        noise_level: 0.20,
        crowd_density: 0.30,
        formality: 0.10,
        accessibility: 0.90,
      },
      rationales: [
        "Historic park where Washington took command of Continental Army",
        "Great for outdoor reading or picnics",
        "Dog-friendly and family-oriented",
      ],
    },
    agg_signals: {
      avg_rating: 4.4,
      review_count: 156,
    },
    confidence: 0.71,
    updated_at: "2025-10-15T14:00:00Z",
  },
];
