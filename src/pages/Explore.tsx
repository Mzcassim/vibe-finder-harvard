import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/MapView";
import { VenueCard } from "@/components/VenueCard";
import { FiltersDrawer, FilterState } from "@/components/FiltersDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, List, Map as MapIcon, User } from "lucide-react";
import { VenueVM, SearchResponseSchema } from "@/types/venue";
import { toVenueVMs } from "@/lib/adapters";
import { HARVARD_SQUARE, getUserLocation } from "@/lib/geo";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Explore page - Browse all venues on interactive map
 */
const Explore: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [venues, setVenues] = useState<VenueVM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userGeo, setUserGeo] = useState(HARVARD_SQUARE);
  const [savedVenues, setSavedVenues] = useState<Set<string>>(new Set());
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "split">("map");
  
  const [filters, setFilters] = useState<FilterState>({
    tags: [],
    axes: {},
    openNow: false,
  });

  // Get user location
  useEffect(() => {
    getUserLocation().then((loc) => {
      if (loc) setUserGeo(loc);
    });
  }, []);

  // Load saved venues
  useEffect(() => {
    const saved = localStorage.getItem("saved_venues");
    if (saved) {
      try {
        const ids = JSON.parse(saved) as string[];
        setSavedVenues(new Set(ids));
      } catch (error) {
        console.error("Failed to load saved venues:", error);
      }
    }
  }, []);

  // Fetch all venues
  useEffect(() => {
    const fetchVenues = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          q: "",
          lat: userGeo.lat.toString(),
          lon: userGeo.lon.toString(),
          radius_m: "5000", // 5km radius for explore
        });

        if (filters.tags.length > 0) {
          params.set("tags", filters.tags.join(","));
        }

        const response = await fetch(`/api/search?${params}`);
        const data = await response.json();
        const validated = SearchResponseSchema.parse(data);
        const vms = toVenueVMs(validated.items, userGeo);

        setVenues(vms);
      } catch (error) {
        console.error("Failed to fetch venues:", error);
        setVenues([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, [userGeo, filters]);

  const handleVenueClick = (id: string) => {
    setSelectedVenueId(id);
    navigate(`/venue/${id}`);
  };

  const handleSave = (id: string) => {
    const saved = localStorage.getItem("saved_venues");
    let ids: string[] = [];
    
    if (saved) {
      try {
        ids = JSON.parse(saved);
      } catch (error) {
        console.error("Failed to parse saved venues:", error);
      }
    }

    if (savedVenues.has(id)) {
      ids = ids.filter((i) => i !== id);
      setSavedVenues((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } else {
      ids.push(id);
      setSavedVenues((prev) => new Set([...prev, id]));
    }

    localStorage.setItem("saved_venues", JSON.stringify(ids));
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === "map" ? "split" : "map")}
            >
              {viewMode === "map" ? <List className="h-4 w-4 mr-2" /> : <MapIcon className="h-4 w-4 mr-2" />}
              {viewMode === "map" ? "Show List" : "Map Only"}
            </Button>
            <FiltersDrawer filters={filters} onChange={handleFiltersChange} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const userEmail = localStorage.getItem("user_email");
                if (userEmail) {
                  navigate(`/user/${encodeURIComponent(userEmail)}`);
                }
              }}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="h-[calc(100vh-73px)]">
        {viewMode === "map" ? (
          /* Full Map View */
          <div className="h-full">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <MapView
                venues={venues}
                center={userGeo}
                zoom={14}
                onVenueClick={handleVenueClick}
                selectedVenueId={selectedVenueId || undefined}
                className="h-full rounded-none"
              />
            )}
          </div>
        ) : (
          /* Split View */
          <div className="container mx-auto px-4 py-4 h-full">
            <div className="grid md:grid-cols-2 gap-4 h-full">
              {/* Map */}
              <div className="h-full">
                {isLoading ? (
                  <Skeleton className="w-full h-full rounded-lg" />
                ) : (
                  <MapView
                    venues={venues}
                    center={userGeo}
                    zoom={14}
                    onVenueClick={handleVenueClick}
                    selectedVenueId={selectedVenueId || undefined}
                    className="h-full"
                  />
                )}
              </div>

              {/* Venue List */}
              <div className="overflow-y-auto space-y-4 h-full">
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold">
                    {venues.length} venues nearby
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Click on markers or cards to view details
                  </p>
                </div>

                {isLoading ? (
                  <>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-64 w-full rounded-lg" />
                    ))}
                  </>
                ) : venues.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No venues found</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setFilters({ tags: [], axes: {}, openNow: false })}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  venues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      vm={venue}
                      onOpen={handleVenueClick}
                      onSave={handleSave}
                      isSaved={savedVenues.has(venue.id)}
                      source="map"
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Explore;
