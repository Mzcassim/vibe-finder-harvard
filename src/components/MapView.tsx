import { useState } from "react";
import { Map, Marker } from "pigeon-maps";
import { VenueVM } from "@/types/venue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Navigation, Star } from "lucide-react";

interface MapViewProps {
  venues?: VenueVM[];
  center?: { lat: number; lon: number };
  zoom?: number;
  onVenueClick?: (venueId: string) => void;
  selectedVenueId?: string;
  className?: string;
}

export const MapView = ({ 
  venues = [],
  center = { lat: 42.3736, lon: -71.1097 },
  zoom = 14,
  onVenueClick,
  selectedVenueId,
  className 
}: MapViewProps) => {
  const [hoveredVenue, setHoveredVenue] = useState<VenueVM | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([center.lat, center.lon]);
  const [mapZoom, setMapZoom] = useState(zoom);

  // Get color based on primary vibe
  const getVibeColor = (vibe: string): string => {
    const colors: Record<string, string> = {
      cozy: "#f59e0b",
      studious: "#3b82f6", 
      romantic: "#ec4899",
      lively: "#ef4444",
      quiet: "#8b5cf6",
      budget: "#10b981",
      upscale: "#6366f1",
      hidden_gem: "#14b8a6",
      outdoorsy: "#22c55e",
    };
    return colors[vibe] || "hsl(var(--primary))";
  };

  const handleMarkerClick = (venue: VenueVM) => {
    setHoveredVenue(venue);
    if (onVenueClick) {
      onVenueClick(venue.id);
    }
  };

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${className}`}>
      <Map 
        center={mapCenter}
        zoom={mapZoom}
        onBoundsChanged={({ center, zoom }) => {
          setMapCenter(center);
          setMapZoom(zoom);
        }}
        defaultWidth={800}
        defaultHeight={600}
      >
        {venues.map((venue) => {
          // Grey marker for unverified venues
          let markerColor = getVibeColor(venue.primaryVibe);
          if (venue.isVerified === false) {
            markerColor = "#9ca3af"; // Grey for unverified
          }
          if (selectedVenueId === venue.id) {
            markerColor = "#000"; // Black for selected
          }
          
          return (
            <Marker 
              key={venue.id}
              anchor={[venue.geo.lat, venue.geo.lon]}
              color={markerColor}
              onClick={() => handleMarkerClick(venue)}
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </Map>

      {/* Venue Info Popup */}
      {hoveredVenue && (
        <div className="absolute bottom-4 left-4 right-4 z-10 max-w-sm">
          <Card className="shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {hoveredVenue.name}
                  </CardTitle>
                  {hoveredVenue.address && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {hoveredVenue.address}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() => setHoveredVenue(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {hoveredVenue.category && (
                  <Badge variant="secondary" className="text-xs">
                    {hoveredVenue.category}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {hoveredVenue.primaryVibe}
                </Badge>
                {hoveredVenue.rating && (
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="font-medium">{hoveredVenue.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {hoveredVenue.distanceText && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Navigation className="h-3 w-3" />
                  <span>{hoveredVenue.distanceText}</span>
                </div>
              )}

              {onVenueClick && (
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => onVenueClick(hoveredVenue.id)}
                >
                  View Details
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
