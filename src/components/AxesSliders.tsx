import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface AxisConfig {
  key: string;
  label: string;
  lowLabel?: string;
  highLabel?: string;
}

interface AxesSlidersProps {
  axes: AxisConfig[];
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
  className?: string;
}

/**
 * AxesSliders component for configurable axis controls
 * Per PRD Section 3
 */
export const AxesSliders: React.FC<AxesSlidersProps> = ({
  axes,
  values,
  onChange,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {axes.map((axis) => {
        const value = values[axis.key] ?? 0.5;

        return (
          <div key={axis.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={axis.key} className="text-sm font-medium">
                {axis.label}
              </Label>
              <span className="text-sm text-muted-foreground">
                {Math.round(value * 100)}%
              </span>
            </div>
            <Slider
              id={axis.key}
              min={0}
              max={1}
              step={0.01}
              value={[value]}
              onValueChange={(vals) => onChange(axis.key, vals[0])}
              className="w-full"
            />
            {(axis.lowLabel || axis.highLabel) && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{axis.lowLabel || ""}</span>
                <span>{axis.highLabel || ""}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Default axis configurations - 5 core vibe metrics
export const DEFAULT_VIBE_AXES: AxisConfig[] = [
  {
    key: "casualness",
    label: "Casualness",
    lowLabel: "Formal",
    highLabel: "Casual",
  },
  {
    key: "comfort",
    label: "Comfort",
    lowLabel: "Minimal",
    highLabel: "Cozy",
  },
  {
    key: "energy",
    label: "Energy",
    lowLabel: "Calm",
    highLabel: "Lively",
  },
  {
    key: "elegance",
    label: "Elegance",
    lowLabel: "Simple",
    highLabel: "Refined",
  },
  {
    key: "authenticity",
    label: "Authenticity",
    lowLabel: "Generic",
    highLabel: "Unique",
  },
];
