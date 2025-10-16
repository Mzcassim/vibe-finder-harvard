import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Heart, Navigation, AlertCircle, Clock, User } from "lucide-react";
import { VenueVM } from "@/types/venue";
import { UncertaintyPill } from "./UncertaintyPill";
import { MiniRadar } from "./MiniRadar";
import { TagChips } from "./TagChips";
import { UpvoteButton } from "./UpvoteButton";
import { cn } from "@/lib/utils";
import { trackVenueOpened, trackSave } from "@/lib/analytics";

interface VenueCardProps {
  vm: VenueVM;
  onSave?: (id: string) => void;
  onOpen?: (id: string) => void;
  isSaved?: boolean;
  source?: "list" | "map";
  className?: string;
}

/**
 * VenueCard component for displaying venue information
 * Per PRD Section 3 - with hero image, tags, mini-radar, rationale, uncertainty pill
 */
export const VenueCard: React.FC<VenueCardProps> = ({
  vm,
  onSave,
  onOpen,
  isSaved = false,
  source = "list",
  className = "",
}) => {
  const handleCardClick = () => {
    if (onOpen) {
      trackVenueOpened(vm.id, source);
      onOpen(vm.id);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSave) {
      trackSave(vm.id);
      onSave(vm.id);
    }
  };

  // Get top 3-4 axes for mini-radar
  const radarAxes = vm.radar.slice(0, 4);

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-300 cursor-pointer group",
        vm.isVerified === false && "opacity-75 bg-muted/30 border-amber-200 dark:border-amber-900",
        className
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Hero Image */}
        {vm.heroImage ? (
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <img
              src={vm.heroImage}
              alt={vm.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute top-2 right-2">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={handleSaveClick}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isSaved && "fill-red-500 text-red-500"
                  )}
                />
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative h-48 w-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg flex items-center justify-center">
            <div className="text-6xl font-bold text-muted-foreground/20">
              {vm.name.charAt(0)}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg leading-tight">
                {vm.name}
              </h3>
              {vm.rating && (
                <div className="flex items-center gap-1 bg-accent/10 px-2 py-0.5 rounded-lg flex-shrink-0">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-sm font-medium text-accent">
                    {vm.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {vm.address && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{vm.address}</span>
              </div>
            )}

            {vm.distanceText && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Navigation className="h-3 w-3" />
                <span>{vm.distanceText}</span>
              </div>
            )}
          </div>

          {/* Tags and Category */}
          <div className="flex flex-wrap gap-2 items-center">
            {vm.category && (
              <Badge variant="secondary" className="text-xs">
                {vm.category}
              </Badge>
            )}
            <TagChips
              tags={vm.tags.slice(0, 3)}
              variant="outline"
              className="text-xs"
            />
            <UncertaintyPill confidence={vm.confidence} />
            
            {/* Unverified Badge */}
            {vm.isVerified === false && (
              <Badge variant="outline" className="text-xs border-amber-500 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unverified
              </Badge>
            )}
            
            {/* Temporary Badge */}
            {vm.isTemporary && (
              <Badge variant="outline" className="text-xs border-blue-500 text-blue-600 dark:text-blue-400">
                <Clock className="h-3 w-3 mr-1" />
                Temporary
              </Badge>
            )}
          </div>
          
          {/* Contributor Attribution */}
          {vm.isVerified === false && vm.contributorName && !vm.isAnonymous && (
            <div 
              className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 px-3 py-2 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 text-xs">
                <User className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                <span className="text-muted-foreground">Contributed by</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate to user profile
                    window.location.href = `/user/${encodeURIComponent(vm.contributorName)}`;
                  }}
                  className="font-medium text-amber-700 dark:text-amber-300 hover:underline"
                >
                  {vm.contributorName}
                </button>
              </div>
            </div>
          )}

          {/* Mini Radar and Rationale */}
          <div className="flex gap-4">
            {radarAxes.length > 0 && (
              <div className="flex-shrink-0">
                <MiniRadar axes={radarAxes} size={70} />
              </div>
            )}
            
            {vm.rationale.length > 0 && (
              <div className="flex-1 min-w-0">
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {vm.rationale.slice(0, 2).map((reason, idx) => (
                    <li key={idx} className="flex gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="flex-1 line-clamp-2">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Time Notes */}
          {vm.timeNotes && (
            <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded">
              ⏰ {vm.timeNotes}
            </div>
          )}
          
          {/* Action Bar */}
          <div 
            className="flex items-center justify-between pt-2 border-t border-border" 
            onClick={(e) => e.stopPropagation()}
          >
            <UpvoteButton venueId={vm.id} size="sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
