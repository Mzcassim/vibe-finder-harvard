import { http, HttpResponse } from "msw";
import { MOCK_VENUES } from "./data";
import { Venue, SearchResponse } from "@/types/venue";

const API_BASE = "/api";

/**
 * MSW handlers for API mocking
 * Per PRD Section 10
 */
export const handlers = [
  // GET /api/search - Search for venues
  http.get(`${API_BASE}/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const tags = url.searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const lat = parseFloat(url.searchParams.get("lat") || "42.3736");
    const lon = parseFloat(url.searchParams.get("lon") || "-71.1097");
    const radiusM = parseInt(url.searchParams.get("radius_m") || "2000");
    const cursor = url.searchParams.get("cursor");
    
    // Combine mock venues with user contributions and verified venues
    let results = [...MOCK_VENUES];
    
    // Add user contributions (unverified)
    const contributionsStr = localStorage.getItem("user_contributions");
    if (contributionsStr) {
      try {
        const contributions = JSON.parse(contributionsStr);
        results = [...results, ...contributions];
      } catch (error) {
        console.error("Failed to parse user contributions:", error);
      }
    }
    
    // Add verified user venues
    const verifiedStr = localStorage.getItem("verified_venues");
    if (verifiedStr) {
      try {
        const verified = JSON.parse(verifiedStr);
        results = [...results, ...verified];
      } catch (error) {
        console.error("Failed to parse verified venues:", error);
      }
    }
    
    // Filter by tags if provided
    if (tags.length > 0) {
      results = results.filter((venue) =>
        tags.some((tag) =>
          venue.llm_labels.vibe_tags.some((vt) =>
            vt.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }
    
    // Filter by query text (simple search in name, tags, and category)
    // More lenient: search for individual words in the query
    if (q && q.trim().length > 0) {
      const queryWords = q.toLowerCase().split(/\s+/).filter(Boolean);
      results = results.filter((venue) => {
        const searchText = [
          venue.name.toLowerCase(),
          venue.metadata.category?.toLowerCase() || "",
          venue.metadata.addr?.toLowerCase() || "",
          ...venue.llm_labels.vibe_tags.map(t => t.toLowerCase()),
          ...venue.llm_labels.rationales.map(r => r.toLowerCase()),
        ].join(" ");
        
        // Match if ANY query word is found in the venue's search text
        return queryWords.some(word => searchText.includes(word));
      });
    }
    
    // Simulate pagination
    const page = cursor ? parseInt(atob(cursor)) : 0;
    const pageSize = 10;
    const startIdx = page * pageSize;
    const endIdx = startIdx + pageSize;
    const paginatedResults = results.slice(startIdx, endIdx);
    const hasMore = endIdx < results.length;
    
    const response: SearchResponse = {
      items: paginatedResults,
      cursor: hasMore ? btoa(String(page + 1)) : undefined,
    };
    
    // Simulate network delay
    return HttpResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // GET /api/venues/:id - Get venue details
  http.get(`${API_BASE}/venues/:id`, ({ params }) => {
    const { id } = params;
    
    // Search in mock venues
    let venue = MOCK_VENUES.find((v) => v.venue_id === id);
    
    // Search in user contributions if not found
    if (!venue) {
      const contributionsStr = localStorage.getItem("user_contributions");
      if (contributionsStr) {
        try {
          const contributions = JSON.parse(contributionsStr);
          venue = contributions.find((v: any) => v.venue_id === id);
        } catch (error) {
          console.error("Failed to parse contributions:", error);
        }
      }
    }
    
    // Search in verified venues if still not found
    if (!venue) {
      const verifiedStr = localStorage.getItem("verified_venues");
      if (verifiedStr) {
        try {
          const verified = JSON.parse(verifiedStr);
          venue = verified.find((v: any) => v.venue_id === id);
        } catch (error) {
          console.error("Failed to parse verified venues:", error);
        }
      }
    }
    
    if (!venue) {
      return HttpResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(venue);
  }),

  // POST /api/vibe-check - Submit vibe check feedback
  http.post(`${API_BASE}/vibe-check`, async ({ request }) => {
    const body = await request.json();
    
    // Mock success response
    return HttpResponse.json(
      {
        success: true,
        message: "Thanks for your feedback!",
        contribution_count: Math.floor(Math.random() * 50) + 1,
      },
      { status: 201 }
    );
  }),

  // GET /api/collections - Get user's saved collections
  http.get(`${API_BASE}/collections`, () => {
    // Mock empty collections for now
    return HttpResponse.json({
      collections: [],
    });
  }),

  // POST /api/collections - Create a new collection
  http.post(`${API_BASE}/collections`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    
    return HttpResponse.json(
      {
        id: `collection-${Date.now()}`,
        ...body,
        created_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // POST /api/venues/contribute - Submit new venue
  http.post(`${API_BASE}/venues/contribute`, async ({ request }) => {
    const body = await request.json();
    
    // Store in localStorage (simulating backend storage)
    const stored = localStorage.getItem("user_contributions");
    const contributions = stored ? JSON.parse(stored) : [];
    contributions.push(body);
    localStorage.setItem("user_contributions", JSON.stringify(contributions));
    
    return HttpResponse.json(
      {
        success: true,
        message: "Venue submitted for review",
        venue_id: (body as any).venue_id,
      },
      { status: 201 }
    );
  }),

  // GET /api/admin/unverified - Get unverified venues
  http.get(`${API_BASE}/admin/unverified`, () => {
    // Get user contributions from localStorage
    const stored = localStorage.getItem("user_contributions");
    const contributions = stored ? JSON.parse(stored) : [];
    
    return HttpResponse.json({
      items: contributions,
      cursor: undefined,
    });
  }),

  // POST /api/admin/verify - Verify or reject venue
  http.post(`${API_BASE}/admin/verify`, async ({ request }) => {
    const body = (await request.json()) as { venue_id: string; approved: boolean };
    
    if (body.approved) {
      // Move from contributions to main venues
      const stored = localStorage.getItem("user_contributions");
      const contributions = stored ? JSON.parse(stored) : [];
      const venue = contributions.find((v: any) => v.venue_id === body.venue_id);
      
      if (venue) {
        // Mark as verified
        venue.is_verified = true;
        
        // Remove from contributions
        const remaining = contributions.filter((v: any) => v.venue_id !== body.venue_id);
        localStorage.setItem("user_contributions", JSON.stringify(remaining));
        
        // Add to verified venues (in a real app, this would go to the backend)
        const verified = localStorage.getItem("verified_venues");
        const verifiedList = verified ? JSON.parse(verified) : [];
        verifiedList.push(venue);
        localStorage.setItem("verified_venues", JSON.stringify(verifiedList));
      }
    } else {
      // Just remove from contributions
      const stored = localStorage.getItem("user_contributions");
      const contributions = stored ? JSON.parse(stored) : [];
      const remaining = contributions.filter((v: any) => v.venue_id !== body.venue_id);
      localStorage.setItem("user_contributions", JSON.stringify(remaining));
    }
    
    return HttpResponse.json(
      {
        success: true,
        message: body.approved ? "Venue verified" : "Venue rejected",
      },
      { status: 200 }
    );
  }),

  // POST /api/venues/:id/upvote - Toggle upvote on venue
  http.post(`${API_BASE}/venues/:id/upvote`, async ({ params }) => {
    const { id } = params;
    const userId = localStorage.getItem("user_email") || "anonymous";
    const upvotesKey = `upvotes_${id}`;
    
    // Get current upvotes
    const upvotes = JSON.parse(localStorage.getItem(upvotesKey) || "[]");
    const hasUpvoted = upvotes.includes(userId);
    
    if (hasUpvoted) {
      // Remove upvote
      const newUpvotes = upvotes.filter((u: string) => u !== userId);
      localStorage.setItem(upvotesKey, JSON.stringify(newUpvotes));
      return HttpResponse.json({
        upvoted: false,
        total_upvotes: newUpvotes.length,
      });
    } else {
      // Add upvote
      upvotes.push(userId);
      localStorage.setItem(upvotesKey, JSON.stringify(upvotes));
      return HttpResponse.json({
        upvoted: true,
        total_upvotes: upvotes.length,
      });
    }
  }),

  // GET /api/users/:username - Get user profile
  http.get(`${API_BASE}/users/:username`, ({ params }) => {
    const { username } = params;
    const userEmail = decodeURIComponent(username as string);
    
    // Calculate user stats from localStorage
    const contributions = JSON.parse(localStorage.getItem("user_contributions") || "[]");
    const verified = JSON.parse(localStorage.getItem("verified_venues") || "[]");
    const userContributions = contributions.filter((v: any) => v.contributor_name === userEmail);
    const userVerified = verified.filter((v: any) => v.contributor_name === userEmail);
    
    // Count upvotes received on user's contributions
    let upvotesReceived = 0;
    [...userContributions, ...userVerified].forEach((venue: any) => {
      const upvotesKey = `upvotes_${venue.venue_id}`;
      const upvotes = JSON.parse(localStorage.getItem(upvotesKey) || "[]");
      upvotesReceived += upvotes.length;
    });
    
    return HttpResponse.json({
      user_id: username,
      username: userEmail,
      email: userEmail,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Mock: 30 days ago
      stats: {
        contributions_count: userContributions.length + userVerified.length,
        verified_contributions: userVerified.length,
        upvotes_given: 0, // TODO: Track in localStorage
        upvotes_received: upvotesReceived,
        reviews_count: 0, // TODO: Implement reviews
        places_visited: 0, // TODO: Implement visits
        badges_earned: [],
      },
    });
  }),

  // GET /api/users/:username/contributions - Get user's contributed venues
  http.get(`${API_BASE}/users/:username/contributions`, ({ params, request }) => {
    const { username } = params;
    const userEmail = decodeURIComponent(username as string);
    const currentUser = localStorage.getItem("user_email");
    const isOwnProfile = currentUser === userEmail;
    
    const contributions = JSON.parse(localStorage.getItem("user_contributions") || "[]");
    const verified = JSON.parse(localStorage.getItem("verified_venues") || "[]");
    
    // Get user's contributions
    const userVenues = [...contributions, ...verified].filter((v: any) => {
      // Match by contributor_name
      const isContributor = v.contributor_name === userEmail;
      
      // For own profile, also include anonymous contributions
      // We need to track these separately by user_id in the venue object
      const isOwnAnonymous = isOwnProfile && 
                            v.is_anonymous && 
                            v.contributor_user_id === userEmail;
      
      return isContributor || isOwnAnonymous;
    });
    
    // For public profiles, filter out anonymous contributions
    const publicVenues = isOwnProfile 
      ? userVenues 
      : userVenues.filter((v: any) => !v.is_anonymous);
    
    return HttpResponse.json({
      items: publicVenues,
      cursor: undefined,
    });
  }),

  // POST /api/venues/:id/reviews - Submit a review
  http.post(`${API_BASE}/venues/:id/reviews`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { rating: number; review_text: string };
    const userId = localStorage.getItem("user_email") || "anonymous";
    
    const reviewsKey = `reviews_${id}`;
    const reviews = JSON.parse(localStorage.getItem(reviewsKey) || "[]");
    
    const newReview = {
      review_id: `review_${Date.now()}`,
      venue_id: id,
      user_id: userId,
      username: userId,
      rating: body.rating,
      review_text: body.review_text,
      upvotes: 0,
      created_at: new Date().toISOString(),
    };
    
    reviews.unshift(newReview);
    localStorage.setItem(reviewsKey, JSON.stringify(reviews));
    
    return HttpResponse.json(newReview);
  }),

  // GET /api/venues/:id/reviews - Get reviews for a venue
  http.get(`${API_BASE}/venues/:id/reviews`, ({ params }) => {
    const { id } = params;
    const reviewsKey = `reviews_${id}`;
    const reviews = JSON.parse(localStorage.getItem(reviewsKey) || "[]");
    
    return HttpResponse.json(reviews);
  }),

  // DELETE /api/venues/:id - Delete a user contribution
  http.delete(`${API_BASE}/venues/:id`, ({ params }) => {
    const { id } = params;
    const userId = localStorage.getItem("user_email");
    
    // Remove from user contributions
    const contributions = JSON.parse(localStorage.getItem("user_contributions") || "[]");
    const filtered = contributions.filter((v: any) => v.venue_id !== id);
    localStorage.setItem("user_contributions", JSON.stringify(filtered));
    
    // Remove from verified venues (in case it was verified)
    const verified = JSON.parse(localStorage.getItem("verified_venues") || "[]");
    const filteredVerified = verified.filter((v: any) => v.venue_id !== id);
    localStorage.setItem("verified_venues", JSON.stringify(filteredVerified));
    
    // Clean up associated data
    localStorage.removeItem(`upvotes_${id}`);
    localStorage.removeItem(`reviews_${id}`);
    
    return HttpResponse.json({ success: true, message: "Venue deleted" });
  }),

  // PUT /api/reviews/:id - Update a review
  http.put(`${API_BASE}/reviews/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { rating: number; review_text: string };
    const userId = localStorage.getItem("user_email");
    
    // Find and update the review in all venue review lists
    const allKeys = Object.keys(localStorage);
    const reviewKeys = allKeys.filter(key => key.startsWith("reviews_"));
    
    for (const key of reviewKeys) {
      const reviews = JSON.parse(localStorage.getItem(key) || "[]");
      const reviewIndex = reviews.findIndex((r: any) => r.review_id === id && r.user_id === userId);
      
      if (reviewIndex !== -1) {
        reviews[reviewIndex] = {
          ...reviews[reviewIndex],
          rating: body.rating,
          review_text: body.review_text,
          updated_at: new Date().toISOString(),
        };
        localStorage.setItem(key, JSON.stringify(reviews));
        return HttpResponse.json(reviews[reviewIndex]);
      }
    }
    
    return HttpResponse.json({ error: "Review not found" }, { status: 404 });
  }),

  // DELETE /api/reviews/:id - Delete a review
  http.delete(`${API_BASE}/reviews/:id`, ({ params }) => {
    const { id } = params;
    const userId = localStorage.getItem("user_email");
    
    // Find and delete the review from all venue review lists
    const allKeys = Object.keys(localStorage);
    const reviewKeys = allKeys.filter(key => key.startsWith("reviews_"));
    
    for (const key of reviewKeys) {
      const reviews = JSON.parse(localStorage.getItem(key) || "[]");
      const filtered = reviews.filter((r: any) => !(r.review_id === id && r.user_id === userId));
      
      if (filtered.length < reviews.length) {
        localStorage.setItem(key, JSON.stringify(filtered));
        return HttpResponse.json({ success: true, message: "Review deleted" });
      }
    }
    
    return HttpResponse.json({ error: "Review not found" }, { status: 404 });
  }),
];
