import React from "react";

interface RadarChartProps {
  axes: Array<{ key: string; value: number; label: string }>;
  size?: number;
  className?: string;
}

/**
 * RadarChart component for displaying venue vibe axes
 * Per PRD Section 3 - responsive SVG radar chart
 */
export const RadarChart: React.FC<RadarChartProps> = ({
  axes,
  size = 200,
  className = "",
}) => {
  if (axes.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Add padding for labels (20% of size on each side)
  const padding = size * 0.2;
  const viewBoxSize = size + padding * 2;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const radius = size * 0.35;
  const numAxes = axes.length;

  // Calculate points for each axis
  const angleStep = (Math.PI * 2) / numAxes;
  const points = axes.map((axis, i) => {
    const angle = angleStep * i - Math.PI / 2; // Start from top
    const value = axis.value; // Already 0..1 normalized
    const x = centerX + Math.cos(angle) * radius * value;
    const y = centerY + Math.sin(angle) * radius * value;
    return { x, y, angle, axis };
  });

  // Create polygon path
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Create background grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridCircles = gridLevels.map((level) => {
    const r = radius * level;
    const gridPoints = axes.map((_, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      return { x, y };
    });
    return gridPoints;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      className={className}
    >
      {/* Background grid */}
      <g className="opacity-20">
        {gridCircles.map((circle, idx) => (
          <polygon
            key={idx}
            points={circle.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
        {/* Axis lines */}
        {points.map((point, i) => (
          <line
            key={`axis-${i}`}
            x1={centerX}
            y1={centerY}
            x2={centerX + Math.cos(point.angle) * radius}
            y2={centerY + Math.sin(point.angle) * radius}
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="hsl(var(--primary))"
        fillOpacity="0.2"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
      />

      {/* Data points */}
      {points.map((point, i) => (
        <circle
          key={`point-${i}`}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="hsl(var(--primary))"
        />
      ))}

      {/* Labels */}
      {points.map((point, i) => {
        const labelRadius = radius * 1.3;
        const labelX = centerX + Math.cos(point.angle) * labelRadius;
        const labelY = centerY + Math.sin(point.angle) * labelRadius;

        // Adjust text anchor based on position
        let textAnchor: "start" | "middle" | "end" = "middle";
        if (labelX < centerX - 5) textAnchor = "end";
        else if (labelX > centerX + 5) textAnchor = "start";

        return (
          <text
            key={`label-${i}`}
            x={labelX}
            y={labelY}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            className="text-xs fill-current font-medium"
            style={{ fontSize: Math.max(10, size / 18) }}
          >
            {point.axis.label}
          </text>
        );
      })}
    </svg>
  );
};
