import { MapPin } from "lucide-react";

interface MapViewProps {
  className?: string;
}

export const MapView = ({ className }: MapViewProps) => {
  return (
    <div className={`relative bg-gradient-to-br from-secondary to-muted rounded-2xl overflow-hidden ${className}`}>
      {/* Placeholder map - will be replaced with actual map integration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <MapPin className="h-16 w-16 text-primary relative" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">Harvard Square Area</p>
            <p className="text-sm text-muted-foreground">Map view coming soon</p>
          </div>
        </div>
      </div>
      
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-foreground" />
          ))}
        </div>
      </div>
    </div>
  );
};
