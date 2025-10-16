import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VenueCard } from "@/components/VenueCard";
import { FiltersDrawer, FilterState } from "@/components/FiltersDrawer";
import { MapView } from "@/components/MapView";
import { ArrowLeft, Loader2 } from "lucide-react";
import { VenueVM } from "@/types/venue";
import { trackResultsViewed, trackAbandonNoResults } from "@/lib/analytics";
import { useAuth } from "@/contexts/AuthContext";
import { HARVARD_SQUARE, getUserLocation } from "@/lib/geo";
import { toVenueVMs } from "@/lib/adapters";
import { SearchResponseSchema } from "@/types/venue";

/**
 * Results page with split pane (list + map), filters, and pagination
 * Per PRD Section 2.3
 */
const Results: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout } = useAuth();

  const [venues, setVenues] = useState<VenueVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const [userGeo, setUserGeo] = useState(HARVARD_SQUARE);
  const [savedVenues, setSavedVenues] = useState<Set<string>>(new Set());
  const [requestStartTime, setRequestStartTime] = useState(Date.now());

  // Parse URL params
  const query = searchParams.get("q") || "";
  const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const radiusM = parseInt(searchParams.get("radius_m") || "2000");

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    tags: tags,
    axes: {},
    openNow: false,
  });

  // Get user location on mount
  useEffect(() => {
    getUserLocation().then((loc) => {
      if (loc) setUserGeo(loc);
    });
  }, []);

  // Fetch results
  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setRequestStartTime(Date.now());

      try {
        // Build query params
        const params = new URLSearchParams({
          q: query,
          lat: userGeo.lat.toString(),
          lon: userGeo.lon.toString(),
          radius_m: radiusM.toString(),
        });

        if (filters.tags.length > 0) {
          params.set("tags", filters.tags.join(","));
        }

        const response = await fetch(`/api/search?${params}`);
        const data = await response.json();

        // Validate response
        const validated = SearchResponseSchema.parse(data);
        const vms = toVenueVMs(validated.items, userGeo);

        setVenues(vms);
        setCursor(validated.cursor);
        setHasMore(!!validated.cursor);

        const latency = Date.now() - requestStartTime;
        trackResultsViewed(vms.length, latency);

        // Track abandonment if no results
        if (vms.length === 0) {
          trackAbandonNoResults(query, radiusM);
        }
      } catch (error) {
        console.error("Failed to fetch results:", error);
        setVenues([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, filters, radiusM]);

  const handleLoadMore = async () => {
    if (!cursor || !hasMore) return;

    try {
      const params = new URLSearchParams({
        q: query,
        lat: userGeo.lat.toString(),
        lon: userGeo.lon.toString(),
        radius_m: radiusM.toString(),
        cursor: cursor,
      });

      if (filters.tags.length > 0) {
        params.set("tags", filters.tags.join(","));
      }

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      const validated = SearchResponseSchema.parse(data);
      const vms = toVenueVMs(validated.items, userGeo);

      setVenues([...venues, ...vms]);
      setCursor(validated.cursor);
      setHasMore(!!validated.cursor);
    } catch (error) {
      console.error("Failed to load more:", error);
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (newFilters.tags.length > 0) {
      params.set("tags", newFilters.tags.join(","));
    } else {
      params.delete("tags");
    }
    setSearchParams(params);
  };

  const handleVenueOpen = (id: string) => {
    navigate(`/venue/${id}`);
  };

  const handleSave = (id: string) => {
    setSavedVenues((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">V</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VibeMap
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FiltersDrawer filters={filters} onChange={handleFiltersChange} />
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Search Query Display */}
      {query && (
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-muted-foreground">
            Searching for: <span className="font-semibold text-foreground">{query}</span>
          </p>
        </div>
      )}

      {/* Results Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Map */}
          <div className="order-2 md:order-1">
            <div className="h-[600px] sticky top-24">
              <MapView 
                venues={venues}
                center={userGeo}
                zoom={14}
                onVenueClick={handleVenueOpen}
                className="h-full w-full rounded-lg"
              />
            </div>
          </div>

          {/* Results List */}
          <div className="order-1 md:order-2 space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                {isLoading ? (
                  <Skeleton className="h-8 w-32" />
                ) : venues.length > 0 ? (
                  `Found ${venues.length} place${venues.length === 1 ? "" : "s"}`
                ) : (
                  "No results"
                )}
              </h2>
            </div>

            {/* Loading State */}
            {isLoading && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 bg-card">
                    <div className="space-y-3">
                      <Skeleton className="h-48 w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Empty State */}
            {!isLoading && venues.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <p className="text-lg text-muted-foreground">
                  No venues found matching your search
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Try:</p>
                  <ul className="list-disc list-inside">
                    <li>Widening your search radius</li>
                    <li>Using different vibe tags</li>
                    <li>Adjusting your filters</li>
                  </ul>
                </div>
                <Button onClick={() => navigate("/")}>
                  Start New Search
                </Button>
              </div>
            )}

            {/* Venue Cards */}
            {!isLoading && venues.map((venue) => (
              <VenueCard
                key={venue.id}
                vm={venue}
                onOpen={handleVenueOpen}
                onSave={handleSave}
                isSaved={savedVenues.has(venue.id)}
                source="list"
              />
            ))}

            {/* Load More */}
            {hasMore && !isLoading && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLoadMore}
              >
                <Loader2 className="h-4 w-4 mr-2" />
                Load More
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Results;
