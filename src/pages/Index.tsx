import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { MapView } from "@/components/MapView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, MapPin, Star, Clock } from "lucide-react";

// Mock data for wireframe
const MOCK_PLACES = [
  {
    name: "Café Nero",
    address: "1 Harvard Square",
    rating: 4.5,
    category: "Coffee Shop",
    vibe: "cozy studying",
    distance: "0.2 mi",
    locationId: "cafe-nero",
  },
  {
    name: "The Sinclair",
    address: "52 Church St",
    rating: 4.7,
    category: "Bar & Music",
    vibe: "lively social",
    distance: "0.3 mi",
    locationId: "the-sinclair",
  },
  {
    name: "Tatte Bakery",
    address: "1288 Massachusetts Ave",
    rating: 4.6,
    category: "Bakery & Café",
    vibe: "instagram-worthy",
    distance: "0.4 mi",
    locationId: "tatte-bakery",
  },
  {
    name: "Widener Library",
    address: "Harvard Yard",
    rating: 4.8,
    category: "Library",
    vibe: "quiet reading",
    distance: "0.5 mi",
    locationId: "widener-library",
  },
];

const Index = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();

  const handleSearch = () => {
    setIsLoading(true);
    setShowResults(false);

    // Simulate API call with fake loading time
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 5000); // 5 second loading time
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VibeMap
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Harvard Area</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center space-y-6">
        <div className="space-y-4 mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Find Your Vibe
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover places that match your mood with natural language search
          </p>
        </div>

        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onSearch={handleSearch}
        />
      </section>

      {/* Loading Section */}
      {isLoading && (
        <section className="container mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Map Loading Skeleton */}
            <div className="order-2 md:order-1">
              <div className="h-[600px] sticky top-24">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            </div>

            {/* Results Loading Skeleton */}
            <div className="order-1 md:order-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-48" />
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground animate-pulse" />
                    <span className="text-sm text-muted-foreground">Searching...</span>
                  </div>
                </div>
              </div>

              {/* Loading Place Cards */}
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="border border-border rounded-lg p-6 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    {/* Place Image Skeleton */}
                    <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />

                    <div className="flex-1 space-y-3">
                      {/* Place Name */}
                      <Skeleton className="h-6 w-32" />

                      {/* Address */}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <Skeleton className="h-4 w-48" />
                      </div>

                      {/* Rating and Category */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <Skeleton className="h-4 w-8" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>

                      {/* Vibe */}
                      <Skeleton className="h-4 w-24" />

                      {/* Distance */}
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {showResults && !isLoading && (
        <section className="container mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Map */}
            <div className="order-2 md:order-1">
              <MapView className="h-[600px] sticky top-24" />
            </div>

            {/* Results List */}
            <div className="order-1 md:order-2 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Found {MOCK_PLACES.length} places
                </h2>
              </div>

              {MOCK_PLACES.map((place, index) => (
                <PlaceCard key={index} {...place} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
