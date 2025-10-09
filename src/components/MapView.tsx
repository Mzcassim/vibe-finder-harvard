import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface MapViewProps {
  className?: string;
}

export const MapView = ({ className }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [tokenSubmitted, setTokenSubmitted] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !tokenSubmitted || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    // Harvard Square coordinates
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-71.1167, 42.3736], // Harvard Square
      zoom: 14,
      pitch: 45,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    // Add markers for mock places
    const places = [
      { name: "Café Nero", coords: [-71.1185, 42.3745] },
      { name: "The Sinclair", coords: [-71.1195, 42.3730] },
      { name: "Tatte Bakery", coords: [-71.1210, 42.3720] },
      { name: "Widener Library", coords: [-71.1165, 42.3744] },
    ];

    places.forEach((place) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.borderRadius = "50%";
      el.style.background = "linear-gradient(135deg, hsl(263 70% 50%), hsl(14 100% 65%))";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";

      new mapboxgl.Marker(el)
        .setLngLat(place.coords as [number, number])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px; font-weight: 600;">${place.name}</div>`
          )
        )
        .addTo(map.current!);
    });

    return () => {
      map.current?.remove();
    };
  }, [tokenSubmitted, mapboxToken]);

  if (!tokenSubmitted) {
    return (
      <div className={`relative bg-gradient-to-br from-secondary to-muted rounded-2xl overflow-hidden flex items-center justify-center p-8 ${className}`}>
        <div className="max-w-md w-full space-y-4 text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
            <MapPin className="h-12 w-12 text-primary relative mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Enter Mapbox Token</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get your free token at{" "}
            <a
              href="https://mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="bg-background"
            />
            <Button
              onClick={() => setTokenSubmitted(true)}
              disabled={!mapboxToken}
              className="w-full bg-gradient-to-r from-primary to-primary-glow"
            >
              Load Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-lg ${className}`}>
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};
