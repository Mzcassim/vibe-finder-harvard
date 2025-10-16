import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating?: number;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "default" | "lg";
  showValue?: boolean;
}

/**
 * Star rating component - displays or allows rating selection
 */
export const RatingStars: React.FC<RatingStarsProps> = ({
  rating = 0,
  onRate,
  readonly = false,
  size = "default",
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "h-3 w-3",
    default: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const displayRating = hoverRating || rating;

  const handleClick = (value: number) => {
    if (!readonly && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => handleClick(value)}
          onMouseEnter={() => !readonly && setHoverRating(value)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          disabled={readonly}
          className={cn(
            "transition-all",
            !readonly && "cursor-pointer hover:scale-110",
            readonly && "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              "transition-colors",
              value <= displayRating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300"
            )}
          />
        </button>
      ))}
      {showValue && rating > 0 && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
