import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagChipsProps {
  tags: string[];
  selectedTags?: string[];
  onTagToggle?: (tag: string) => void;
  variant?: "default" | "outline" | "secondary";
  selectable?: boolean;
  className?: string;
}

/**
 * TagChips component for displaying and selecting vibe tags
 * Per PRD Section 3
 */
export const TagChips: React.FC<TagChipsProps> = ({
  tags,
  selectedTags = [],
  onTagToggle,
  variant = "secondary",
  selectable = false,
  className = "",
}) => {
  const handleClick = (tag: string) => {
    if (selectable && onTagToggle) {
      onTagToggle(tag);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        const displayVariant = selectable && isSelected ? "default" : variant;

        return (
          <Badge
            key={tag}
            variant={displayVariant}
            className={cn(
              selectable && "cursor-pointer transition-all hover:scale-105",
              isSelected && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => handleClick(tag)}
          >
            {tag.replace(/_/g, " ")}
          </Badge>
        );
      })}
    </div>
  );
};
