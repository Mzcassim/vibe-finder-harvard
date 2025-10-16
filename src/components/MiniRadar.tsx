import React from "react";

interface MiniRadarProps {
  axes: Array<{ key: string; value: number; label: string }>;
  size?: number;
  className?: string;
}

/**
 * MiniRadar - compact radar chart for venue cards
 * Per PRD Section 3 - mini-radar for venue cards
 */
export const MiniRadar: React.FC<MiniRadarProps> = ({
  axes,
  size = 60,
  className = "",
}) => {
  if (axes.length === 0) {
    return null;
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  const numAxes = axes.length;

  // Calculate points for each axis
  const angleStep = (Math.PI * 2) / numAxes;
  const points = axes.map((axis, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const value = axis.value;
    const x = centerX + Math.cos(angle) * radius * value;
    const y = centerY + Math.sin(angle) * radius * value;
    return { x, y };
  });

  // Create polygon path
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Background circle
  const bgPoints = axes.map((_, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    return { x, y };
  });
  const bgPolygonPoints = bgPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      {/* Background */}
      <polygon
        points={bgPolygonPoints}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="opacity-20"
      />

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="hsl(var(--primary))"
        fillOpacity="0.3"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
      />
    </svg>
  );
};
