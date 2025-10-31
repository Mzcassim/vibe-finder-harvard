import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TagChips } from "./TagChips";
import { AxesSliders, DEFAULT_VIBE_AXES } from "./AxesSliders";
import { SlidersHorizontal, X } from "lucide-react";

export interface FilterState {
  tags: string[];
  axes: Record<string, { min: number; max: number }>;
  openNow: boolean;
  maxWalkMinutes?: number;
}

interface FiltersDrawerProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableTags?: string[];
  className?: string;
}

/**
 * FiltersDrawer component for search results filtering
 * Per PRD Section 2.3 and 3
 */
export const FiltersDrawer: React.FC<FiltersDrawerProps> = ({
  filters,
  onChange,
  availableTags = [
    "cozy",
    "studious",
    "romantic",
    "lively",
    "quiet",
    "budget",
    "upscale",
    "outdoorsy",
    "date_spot",
    "group_friendly",
    "hidden_gem",
  ],
  className = "",
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    const newTags = localFilters.tags.includes(tag)
      ? localFilters.tags.filter((t) => t !== tag)
      : [...localFilters.tags, tag];
    setLocalFilters({ ...localFilters, tags: newTags });
  };

  const handleAxisChange = (key: string, min: number, max: number) => {
    setLocalFilters({
      ...localFilters,
      axes: {
        ...localFilters.axes,
        [key]: { min, max },
      },
    });
  };

  const handleApply = () => {
    onChange(localFilters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      tags: [],
      axes: {},
      openNow: false,
    };
    setLocalFilters(resetFilters);
    onChange(resetFilters);
  };

  const activeFilterCount =
    localFilters.tags.length +
    Object.keys(localFilters.axes).length +
    (localFilters.openNow ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className={`relative ${className}`}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="default"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine your search to find the perfect vibe
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Vibe Tags */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Vibe Tags
            </Label>
            <TagChips
              tags={availableTags}
              selectedTags={localFilters.tags}
              onTagToggle={handleTagToggle}
              selectable
            />
          </div>

          {/* Quick Toggles */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Quick Filters</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="open-now" className="text-sm">
                Open Now
              </Label>
              <Switch
                id="open-now"
                checked={localFilters.openNow}
                onCheckedChange={(checked) =>
                  setLocalFilters({ ...localFilters, openNow: checked })
                }
              />
            </div>
          </div>

          {/* Vibe Metrics Sliders */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Vibe Metrics
            </Label>
            <p className="text-xs text-muted-foreground mb-4">
              Set your preferred range for each vibe metric (±30%)
            </p>
            <AxesSliders
              axes={DEFAULT_VIBE_AXES}
              values={Object.fromEntries(
                Object.entries(localFilters.axes).map(([k, v]) => [
                  k,
                  (v.min + v.max) / 2,
                ])
              )}
              onChange={(key, value) => {
                // Set a ±30% range around the selected value
                const range = 0.3;
                handleAxisChange(
                  key,
                  Math.max(0, value - range),
                  Math.min(1, value + range)
                );
              }}
            />
          </div>
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
