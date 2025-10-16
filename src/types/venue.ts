import { z } from "zod";

// Axes Schema - all values normalized to 0..1
export const AxesSchema = z.object({
  noise_level: z.number().min(0).max(1).optional(),
  lighting_warmth: z.number().min(0).max(1).optional(),
  crowd_density: z.number().min(0).max(1).optional(),
  price_level: z.number().min(0).max(1).optional(),
  music_energy: z.number().min(0).max(1).optional(),
  formality: z.number().min(0).max(1).optional(),
  novelty: z.number().min(0).max(1).optional(),
  authenticity: z.number().min(0).max(1).optional(),
  cleanliness: z.number().min(0).max(1).optional(),
  accessibility: z.number().min(0).max(1).optional(),
});

export type Axes = z.infer<typeof AxesSchema>;

// Venue Schema (DTO from backend)
export const VenueSchema = z.object({
  venue_id: z.string(),
  name: z.string(),
  geo: z.object({ 
    lat: z.number().min(-90).max(90), 
    lon: z.number().min(-180).max(180) 
  }),
  images: z.array(z.object({ url: z.string().url() })).default([]),
  metadata: z.object({
    category: z.string().optional(),
    price_level: z.number().optional(),
    addr: z.string().optional(),
  }).default({}),
  llm_labels: z.object({
    vibe_tags: z.array(z.string()).default([]),
    axes: AxesSchema.default({}),
    rationales: z.array(z.string()).default([]),
  }).default({ vibe_tags: [], axes: {}, rationales: [] }),
  agg_signals: z.object({
    avg_rating: z.number().optional(),
    review_count: z.number().optional(),
    recentness_days: z.number().optional(),
    image_count: z.number().optional(),
  }).default({}),
  confidence: z.number().min(0).max(1).optional(),
  updated_at: z.string().optional(),
  time_notes: z.string().optional(), // Optional time-aware notes
  
  // User contribution metadata
  is_verified: z.boolean().default(true), // False for user-submitted unverified venues
  is_temporary: z.boolean().default(false), // True for events/pop-ups
  contributor_name: z.string().optional(), // Name of user who added it
  is_anonymous: z.boolean().default(false), // If true, hide contributor name
  contribution_date: z.string().optional(), // When it was submitted
});

export type Venue = z.infer<typeof VenueSchema>;

// Search Response Schema
export const SearchResponseSchema = z.object({
  items: z.array(VenueSchema),
  cursor: z.string().optional(),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

// View Model for UI components
export type VenueVM = {
  id: string;
  name: string;
  distanceText: string;
  primaryVibe: string;
  tags: string[];
  radar: Array<{ key: string; value: number; label: string }>;
  rationale: string[];
  confidence?: number;
  heroImage?: string;
  category?: string;
  address?: string;
  rating?: number;
  timeNotes?: string;
  geo: { lat: number; lon: number };
  
  // Contribution metadata
  isVerified?: boolean;
  isTemporary?: boolean;
  contributorName?: string;
  isAnonymous?: boolean;
  contributionDate?: string;
};

// Vibe Profile Schema (stored in localStorage)
export const VibeProfileSchema = z.object({
  preferences: z.object({
    noise_level: z.number().min(0).max(1).default(0.5),
    lighting_warmth: z.number().min(0).max(1).default(0.5),
    price_level: z.number().min(0).max(1).default(0.5),
  }),
  liked_vibes: z.array(z.string()).default([]),
  disliked_vibes: z.array(z.string()).default([]),
  completed: z.boolean().default(false),
});

export type VibeProfile = z.infer<typeof VibeProfileSchema>;

// Vibe Check Submission Schema
export const VibeCheckSchema = z.object({
  venue_id: z.string(),
  overall: z.enum(["positive", "negative"]),
  axes: AxesSchema.partial().optional(),
  tags: z.array(z.string()).optional(),
});

export type VibeCheck = z.infer<typeof VibeCheckSchema>;

// Confidence thresholds
export const CONFIDENCE_THRESHOLDS = {
  LOW: 0.5,
  MEDIUM: 0.75,
  HIGH: 1.0,
} as const;

export type ConfidenceLevel = "low" | "medium" | "high";

export function getConfidenceLevel(confidence?: number): ConfidenceLevel {
  if (!confidence || confidence < CONFIDENCE_THRESHOLDS.LOW) return "low";
  if (confidence < CONFIDENCE_THRESHOLDS.MEDIUM) return "medium";
  return "high";
}
