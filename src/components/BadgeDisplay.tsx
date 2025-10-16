import React from "react";
import { Card } from "@/components/ui/card";
import { Badge as BadgeType } from "@/types/user";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeDisplayProps {
  badge: BadgeType;
  earned?: boolean;
  progress?: number;
  size?: "sm" | "default" | "lg";
}

/**
 * Display a badge with optional progress indicator
 */
export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badge,
  earned = true,
  progress = 0,
  size = "default",
}) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-2xl",
    default: "w-16 h-16 text-3xl",
    lg: "w-20 h-20 text-4xl",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Card
              className={cn(
                "flex items-center justify-center transition-all",
                sizeClasses[size],
                earned
                  ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border-yellow-300 dark:border-yellow-700 shadow-lg"
                  : "bg-muted/50 border-dashed opacity-50 grayscale"
              )}
            >
              <span className="select-none">{badge.icon}</span>
            </Card>
            
            {/* Progress indicator for locked badges */}
            {!earned && progress > 0 && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full px-1">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{badge.icon} {badge.name}</p>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
            {!earned && (
              <p className="text-xs text-primary font-medium">
                {progress.toFixed(0)}% Complete
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
