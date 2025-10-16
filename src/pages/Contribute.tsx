import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { TagChips } from "@/components/TagChips";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, MapPin, Plus, Target } from "lucide-react";
import { toast } from "sonner";
import { Venue } from "@/types/venue";
import { Map, Marker } from "pigeon-maps";
import { HARVARD_SQUARE, getUserLocation } from "@/lib/geo";

const ALL_VIBE_TAGS = [
  "cozy", "studious", "romantic", "lively", "quiet", "budget", "upscale",
  "hidden_gem", "touristy", "date_spot", "group_friendly", "kid_friendly",
  "outdoorsy", "third_wave_coffee", "late_night", "brunch", "dive_bar",
  "clubby", "queer_friendly", "studenty", "bougie", "rustic", "pet_friendly",
];

const CATEGORIES = [
  "cafe", "restaurant", "bar", "library", "park", "gym", "bookstore",
  "museum", "theater", "music_venue", "coworking", "market", "other",
];

/**
 * Contribute page - Add new venues to the map
 */
const Contribute: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    lat: "",
    lon: "",
    category: "",
    imageUrl: "",
    description: "",
  });
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isTemporary, setIsTemporary] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Map selection state
  const [mapCenter, setMapCenter] = useState<[number, number]>([HARVARD_SQUARE.lat, HARVARD_SQUARE.lon]);
  const [mapZoom, setMapZoom] = useState(14);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isSelectingOnMap, setIsSelectingOnMap] = useState(false);

  // Get user location for initial map center
  useEffect(() => {
    getUserLocation().then((loc) => {
      if (loc) {
        setMapCenter([loc.lat, loc.lon]);
      }
    });
  }, []);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      // In production, use Google Maps Geocoding API or similar
      // For now, generate a placeholder address
      // Example: https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=YOUR_API_KEY
      
      // Mock implementation - generates a Cambridge-area address
      const streets = ["Massachusetts Ave", "Brattle St", "Mt Auburn St", "JFK St", "Harvard St", "Bow St"];
      const randomStreet = streets[Math.floor(Math.random() * streets.length)];
      const randomNumber = Math.floor(Math.random() * 200) + 1;
      
      return `${randomNumber} ${randomStreet}, Cambridge, MA 02138`;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)} (Cambridge area)`;
    }
  };

  // Update form when location is selected on map
  useEffect(() => {
    if (selectedLocation) {
      // Update coordinates immediately
      setFormData(prev => ({
        ...prev,
        lat: selectedLocation.lat.toFixed(6),
        lon: selectedLocation.lon.toFixed(6),
      }));
      
      // Fetch address via reverse geocoding
      reverseGeocode(selectedLocation.lat, selectedLocation.lon).then((address) => {
        setFormData(prev => ({
          ...prev,
          address: address,
        }));
      });
      
      setIsSelectingOnMap(false);
    }
  }, [selectedLocation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.address) {
      toast.error("Please fill in required fields", {
        description: "Name and address are required",
      });
      return;
    }

    if (!formData.lat || !formData.lon) {
      toast.error("Please select a location on the map", {
        description: "Click the map to choose where this venue is located",
      });
      return;
    }

    const lat = parseFloat(formData.lat);
    const lon = parseFloat(formData.lon);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      toast.error("Invalid coordinates", {
        description: "Latitude must be -90 to 90, longitude -180 to 180",
      });
      return;
    }

    if (selectedTags.length === 0) {
      toast.error("Please select at least one vibe tag");
      return;
    }

    setIsSubmitting(true);

    // Get current user name (from localStorage or auth context)
    const userName = localStorage.getItem("user_email") || "Anonymous User";

    // Create new venue object
    const newVenue: Venue = {
      venue_id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.name,
      geo: { lat, lon },
      images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
      metadata: {
        category: formData.category || "other",
        addr: formData.address,
      },
      llm_labels: {
        vibe_tags: selectedTags,
        axes: {},
        rationales: formData.description ? [formData.description] : [],
      },
      agg_signals: {},
      confidence: 0.3, // Low confidence for user-submitted
      updated_at: new Date().toISOString(),
      
      // Contribution metadata
      is_verified: false,
      is_temporary: isTemporary,
      contributor_name: isAnonymous ? undefined : userName,
      contributor_user_id: userName, // Always save for tracking, even if anonymous
      is_anonymous: isAnonymous,
      contribution_date: new Date().toISOString(),
    };

    try {
      // Submit to backend (or localStorage for now)
      const response = await fetch("/api/venues/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVenue),
      });

      if (!response.ok) throw new Error("Failed to submit");

      toast.success("Venue submitted!", {
        description: "Thanks for contributing! It will be reviewed and verified soon.",
      });

      // Reset form
      setFormData({
        name: "",
        address: "",
        lat: "",
        lon: "",
        category: "",
        imageUrl: "",
        description: "",
      });
      setSelectedTags([]);
      setIsTemporary(false);
      setIsAnonymous(false);

      // Navigate to explore to see all venues
      setTimeout(() => navigate("/explore"), 1500);
    } catch (error) {
      console.error("Failed to submit venue:", error);
      toast.error("Failed to submit venue", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <Button variant="outline" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Contribute to the Vibes</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Know a great spot that's not on our map? Add it! Your submission will be reviewed and verified by our team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about this place</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Venue Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Cozy Corner Café"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="e.g., 123 Main St, Cambridge, MA"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                  {selectedLocation && formData.address && (
                    <p className="text-xs text-muted-foreground">
                      ✓ Auto-filled from map location. You can edit if needed.
                    </p>
                  )}
                </div>

                {/* Map Location Picker */}
                <div className="space-y-2">
                  <Label>
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="space-y-3">
                    <div className="relative h-[400px] w-full rounded-lg overflow-hidden border border-border">
                      <Map
                        center={mapCenter}
                        zoom={mapZoom}
                        onClick={({ latLng }) => {
                          setSelectedLocation({ lat: latLng[0], lon: latLng[1] });
                          toast.success("Location selected!", {
                            description: `${latLng[0].toFixed(6)}, ${latLng[1].toFixed(6)}`,
                          });
                        }}
                        onBoundsChanged={({ center, zoom }) => {
                          setMapCenter(center);
                          setMapZoom(zoom);
                        }}
                      >
                        {selectedLocation && (
                          <Marker
                            anchor={[selectedLocation.lat, selectedLocation.lon]}
                            color="#ef4444"
                            width={40}
                          />
                        )}
                      </Map>
                      
                      {/* Crosshair hint */}
                      {!selectedLocation && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-border">
                            <div className="flex items-center gap-2 text-sm">
                              <Target className="h-4 w-4 text-primary" />
                              <span className="font-medium">Click on the map to select location</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Coordinates Display */}
                    {selectedLocation && (
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 text-sm">
                            <p className="font-medium text-green-900 dark:text-green-100">
                              Location selected!
                            </p>
                            <p className="text-green-700 dark:text-green-300 mt-1">
                              Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lon.toFixed(6)}
                            </p>
                            <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className="text-green-600 dark:text-green-400 h-auto p-0 mt-1"
                              onClick={() => {
                                setSelectedLocation(null);
                                setFormData(prev => ({ ...prev, lat: "", lon: "" }));
                              }}
                            >
                              Clear and select again
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                      <div className="flex gap-2">
                        <Target className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-medium">How to select location:</p>
                          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                            <li>Pan and zoom the map to find your venue</li>
                            <li>Click directly on the venue's location</li>
                            <li>A red marker will appear at the selected spot</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.category}
                    onChange={handleInputChange as any}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Find free images on Unsplash or use a URL from the venue's website
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vibe Tags */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Vibe Tags <span className="text-red-500">*</span>
                </CardTitle>
                <CardDescription>Select all that apply - first tag will be the primary vibe</CardDescription>
              </CardHeader>
              <CardContent>
                <TagChips
                  tags={ALL_VIBE_TAGS}
                  selectedTags={selectedTags}
                  onTagToggle={(tag) => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter((t) => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  selectable
                  variant="default"
                />
                {selectedTags.length > 0 && (
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium">Selected ({selectedTags.length}):</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedTags.join(", ")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>Why does this place have these vibes?</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="description"
                  placeholder="e.g., Great coffee and cozy atmosphere, perfect for studying. Has comfortable seating and good WiFi."
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.description.length}/500 characters
                </p>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Contribution Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="temporary">Temporary Event/Pop-up</Label>
                    <p className="text-sm text-muted-foreground">
                      Is this a temporary event, pop-up, or seasonal venue?
                    </p>
                  </div>
                  <Switch
                    id="temporary"
                    checked={isTemporary}
                    onCheckedChange={setIsTemporary}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="anonymous">Submit Anonymously</Label>
                    <p className="text-sm text-muted-foreground">
                      Hide your name from the public contribution
                    </p>
                  </div>
                  <Switch
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>

                {!isAnonymous && (
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    <p className="text-muted-foreground">
                      Your contribution will be attributed to:{" "}
                      <span className="font-medium text-foreground">
                        {localStorage.getItem("user_email") || "Your Account"}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="space-y-4">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Venue for Review"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Your submission will be reviewed by our team and appear on the map once verified
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
