import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Bookmark, Sparkles, MapPin, Settings as SettingsIcon, Plus, User } from "lucide-react";
import { trackSearch } from "@/lib/analytics";

// Example search suggestions
const SUGGESTED_VIBES = [
  "cozy study spot",
  "romantic dinner",
  "lively brunch",
  "quiet reading",
  "group hangout",
  "late night food",
];

const Index = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [parsedTags, setParsedTags] = useState<string[]>([]);
  const { logout } = useAuth();

  // Check if user has completed onboarding
  useEffect(() => {
    const profile = localStorage.getItem("vibe_profile");
    if (!profile) {
      navigate("/onboarding");
    }
  }, [navigate]);

  // Simple client-side parser preview
  useEffect(() => {
    if (!searchValue) {
      setParsedTags([]);
      return;
    }

    const query = searchValue.toLowerCase();
    const tags: string[] = [];

    // Simple keyword matching
    if (query.includes("cozy") || query.includes("warm")) tags.push("cozy");
    if (query.includes("quiet") || query.includes("silent")) tags.push("quiet");
    if (query.includes("study") || query.includes("work")) tags.push("studious");
    if (query.includes("romantic") || query.includes("date")) tags.push("romantic");
    if (query.includes("lively") || query.includes("energetic")) tags.push("lively");
    if (query.includes("cheap") || query.includes("budget")) tags.push("budget");
    if (query.includes("upscale") || query.includes("fancy")) tags.push("upscale");

    setParsedTags(tags);
  }, [searchValue]);

  const handleSearch = () => {
    if (!searchValue.trim()) return;

    // Track search
    trackSearch({
      query: searchValue,
      tags: parsedTags,
      axes: {},
      radiusMeters: 2000,
    });

    // Navigate to results page with query params
    const params = new URLSearchParams({
      q: searchValue,
      ...(parsedTags.length > 0 && { tags: parsedTags.join(",") }),
    });
    navigate(`/results?${params}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/explore")}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Explore</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/saved")}
              className="flex items-center gap-2"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const userEmail = localStorage.getItem("user_email");
                console.log("My Profile clicked, user email:", userEmail);
                if (userEmail) {
                  const profileUrl = `/user/${encodeURIComponent(userEmail)}`;
                  console.log("Navigating to:", profileUrl);
                  navigate(profileUrl);
                } else {
                  console.error("No user email found in localStorage");
                }
              }}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">My Profile</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2"
            >
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
            Find Your Vibe
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover places that match your mood with natural language search
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
          />

          {/* Parser Preview */}
          {parsedTags.length > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Detected vibes:</span>
              <div className="flex gap-1">
                {parsedTags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground mb-3">
            Try searching for:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGGESTED_VIBES.map((vibe) => (
              <Button
                key={vibe}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(vibe)}
                className="text-xs"
              >
                {vibe}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/20 mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Know a Hidden Gem?</h3>
          <p className="text-muted-foreground mb-6">
            Help the community discover amazing places! Add venues, events, and pop-ups to our map.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/contribute")}
            className="bg-gradient-to-r from-primary to-accent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Contribute to the Vibes
          </Button>
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-border rounded-lg bg-card/50">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">
              Smart vibe detection from reviews and data
            </p>
          </div>
          <div className="text-center p-6 border border-border rounded-lg bg-card/50">
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-semibold mb-2">Harvard Square</h3>
            <p className="text-sm text-muted-foreground">
              Curated spots around campus and beyond
            </p>
          </div>
          <div className="text-center p-6 border border-border rounded-lg bg-card/50">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-semibold mb-2">Personalized</h3>
            <p className="text-sm text-muted-foreground">
              Results tailored to your vibe preferences
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
