import { z } from "zod";

// User Activity Types
export const UserActivitySchema = z.object({
  user_id: z.string(),
  username: z.string(),
  email: z.string(),
  created_at: z.string(),
  
  // Stats
  stats: z.object({
    contributions_count: z.number().default(0),
    verified_contributions: z.number().default(0),
    upvotes_given: z.number().default(0),
    upvotes_received: z.number().default(0),
    reviews_count: z.number().default(0),
    places_visited: z.number().default(0),
    badges_earned: z.array(z.string()).default([]),
  }).default({
    contributions_count: 0,
    verified_contributions: 0,
    upvotes_given: 0,
    upvotes_received: 0,
    reviews_count: 0,
    places_visited: 0,
    badges_earned: [],
  }),
});

export type UserActivity = z.infer<typeof UserActivitySchema>;

// Badge System
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: "contributor" | "explorer" | "reviewer" | "social";
}

export const BADGES: Badge[] = [
  {
    id: "first_contribution",
    name: "First Contribution",
    description: "Added your first venue to the map",
    icon: "🎉",
    requirement: 1,
    category: "contributor",
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Visited 10 different venues",
    icon: "🗺️",
    requirement: 10,
    category: "explorer",
  },
  {
    id: "curator",
    name: "Curator",
    description: "Contributed 5 verified venues",
    icon: "✨",
    requirement: 5,
    category: "contributor",
  },
  {
    id: "reviewer",
    name: "Reviewer",
    description: "Written 10 reviews",
    icon: "📝",
    requirement: 10,
    category: "reviewer",
  },
  {
    id: "popular",
    name: "Popular Contributor",
    description: "Received 50 upvotes",
    icon: "⭐",
    requirement: 50,
    category: "social",
  },
  {
    id: "influencer",
    name: "Vibe Influencer",
    description: "Received 200 upvotes",
    icon: "🔥",
    requirement: 200,
    category: "social",
  },
  {
    id: "super_curator",
    name: "Super Curator",
    description: "Contributed 20 verified venues",
    icon: "🏆",
    requirement: 20,
    category: "contributor",
  },
  {
    id: "local_legend",
    name: "Local Legend",
    description: "Visited 50 different venues",
    icon: "👑",
    requirement: 50,
    category: "explorer",
  },
];

// Review Schema
export const ReviewSchema = z.object({
  review_id: z.string(),
  venue_id: z.string(),
  user_id: z.string(),
  username: z.string(),
  rating: z.number().min(1).max(5),
  review_text: z.string(),
  upvotes: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string().optional(),
});

export type Review = z.infer<typeof ReviewSchema>;

// Upvote Schema
export const UpvoteSchema = z.object({
  user_id: z.string(),
  venue_id: z.string(),
  created_at: z.string(),
});

export type Upvote = z.infer<typeof UpvoteSchema>;

// Visit Schema
export const VisitSchema = z.object({
  user_id: z.string(),
  venue_id: z.string(),
  visited_at: z.string(),
  rating: z.number().min(1).max(5).optional(),
});

export type Visit = z.infer<typeof VisitSchema>;

// Helper function to calculate earned badges
export function calculateEarnedBadges(stats: UserActivity["stats"]): Badge[] {
  const earned: Badge[] = [];
  
  BADGES.forEach((badge) => {
    let qualifies = false;
    
    switch (badge.id) {
      case "first_contribution":
        qualifies = stats.contributions_count >= 1;
        break;
      case "explorer":
        qualifies = stats.places_visited >= 10;
        break;
      case "curator":
        qualifies = stats.verified_contributions >= 5;
        break;
      case "reviewer":
        qualifies = stats.reviews_count >= 10;
        break;
      case "popular":
        qualifies = stats.upvotes_received >= 50;
        break;
      case "influencer":
        qualifies = stats.upvotes_received >= 200;
        break;
      case "super_curator":
        qualifies = stats.verified_contributions >= 20;
        break;
      case "local_legend":
        qualifies = stats.places_visited >= 50;
        break;
    }
    
    if (qualifies) {
      earned.push(badge);
    }
  });
  
  return earned;
}

// Helper to get next badge progress
export function getNextBadgeProgress(stats: UserActivity["stats"]): Array<{
  badge: Badge;
  progress: number;
  remaining: number;
}> {
  const earned = calculateEarnedBadges(stats);
  const earnedIds = new Set(earned.map(b => b.id));
  
  const nextBadges = BADGES.filter(b => !earnedIds.has(b.id)).map((badge) => {
    let current = 0;
    
    switch (badge.id) {
      case "first_contribution":
        current = stats.contributions_count;
        break;
      case "explorer":
        current = stats.places_visited;
        break;
      case "curator":
        current = stats.verified_contributions;
        break;
      case "reviewer":
        current = stats.reviews_count;
        break;
      case "popular":
        current = stats.upvotes_received;
        break;
      case "influencer":
        current = stats.upvotes_received;
        break;
      case "super_curator":
        current = stats.verified_contributions;
        break;
      case "local_legend":
        current = stats.places_visited;
        break;
    }
    
    const progress = Math.min((current / badge.requirement) * 100, 100);
    const remaining = Math.max(badge.requirement - current, 0);
    
    return { badge, progress, remaining };
  });
  
  // Sort by closest to completion
  return nextBadges.sort((a, b) => b.progress - a.progress).slice(0, 3);
}
