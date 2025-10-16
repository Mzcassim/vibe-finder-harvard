import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getConfidenceLevel, ConfidenceLevel } from "@/types/venue";
import { HelpCircle } from "lucide-react";

interface UncertaintyPillProps {
  confidence?: number;
  className?: string;
}

const CONFIDENCE_CONFIG: Record<
  ConfidenceLevel,
  { label: string; tooltip: string; variant: "default" | "secondary" | "outline" }
> = {
  low: {
    label: "New Place",
    tooltip: "Limited data - help us calibrate this venue's vibe!",
    variant: "outline",
  },
  medium: {
    label: "Good Data",
    tooltip: "We have moderate confidence in this vibe rating",
    variant: "secondary",
  },
  high: {
    label: "High Confidence",
    tooltip: "Well-calibrated based on extensive data",
    variant: "default",
  },
};

/**
 * UncertaintyPill component to display confidence level
 * Per PRD Section 3
 */
export const UncertaintyPill: React.FC<UncertaintyPillProps> = ({
  confidence,
  className = "",
}) => {
  const level = getConfidenceLevel(confidence);
  const config = CONFIDENCE_CONFIG[level];

  if (level === "high") {
    // Don't show pill for high confidence venues
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={config.variant} className={`gap-1 ${className}`}>
            <HelpCircle className="h-3 w-3" />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-xs">{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
