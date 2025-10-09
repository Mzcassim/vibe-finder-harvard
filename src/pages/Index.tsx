import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { MapView } from "@/components/MapView";

// Mock data for wireframe
const MOCK_PLACES = [
  {
    name: "Café Nero",
    address: "1 Harvard Square",
    rating: 4.5,
    category: "Coffee Shop",
    vibe: "cozy studying",
    distance: "0.2 mi",
  },
  {
    name: "The Sinclair",
    address: "52 Church St",
    rating: 4.7,
    category: "Bar & Music",
    vibe: "lively social",
    distance: "0.3 mi",
  },
  {
    name: "Tatte Bakery",
    address: "1288 Massachusetts Ave",
    rating: 4.6,
    category: "Bakery & Café",
    vibe: "instagram-worthy",
    distance: "0.4 mi",
  },
  {
    name: "Widener Library",
    address: "Harvard Yard",
    rating: 4.8,
    category: "Library",
    vibe: "quiet reading",
    distance: "0.5 mi",
  },
];

const Index = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setShowResults(true);
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
          <span className="text-sm text-muted-foreground">Harvard Area</span>
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

      {/* Results Section */}
      {showResults && (
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
