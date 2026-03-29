import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressRingProps extends HTMLAttributes<HTMLDivElement> {
  percent: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showFraction?: string;
  color?: string;
}

const sizes = {
  sm: { wrapper: 'w-12 h-12', stroke: 4, radius: 20, fontSize: 'text-xs' },
  md: { wrapper: 'w-16 h-16', stroke: 6, radius: 26, fontSize: 'text-sm' },
  lg: { wrapper: 'w-24 h-24', stroke: 8, radius: 40, fontSize: 'text-lg' },
};

export function ProgressRing({
  percent,
  size = 'md',
  showLabel = true,
  showFraction,
  color = 'stroke-gatsby',
  className,
  ...props
}: ProgressRingProps) {
  const roundedPercent = Math.round(percent);
  const { wrapper, stroke, radius, fontSize } = sizes[size];

  // Calculate SVG dimensions and circumference
  const viewBoxSize = (radius + stroke) * 2;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', wrapper, className)}
      {...props}
    >
      <svg
        role="progressbar"
        aria-label={`${roundedPercent}% complete`}
        aria-valuenow={roundedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-gray-200"
        />
        {/* Progress circle */}
        <circle
          data-testid="progress-circle"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={percent >= 100 ? 0 : offset}
          className={cn('transition-all duration-500 ease-out', color)}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showLabel && (
          <span className={cn('font-semibold text-text-primary', fontSize)}>
            {roundedPercent}%
          </span>
        )}
        {showFraction && (
          <span className="text-xs text-text-secondary">{showFraction}</span>
        )}
      </div>
    </div>
  );
}
