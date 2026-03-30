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
  sm: { wrapper: 'w-12 h-12', stroke: 3.5, radius: 20, fontSize: 'text-[11px]', fractionSize: 'text-[9px]' },
  md: { wrapper: 'w-16 h-16', stroke: 4, radius: 26, fontSize: 'text-[13px]', fractionSize: 'text-[10px]' },
  lg: { wrapper: 'w-20 h-20', stroke: 5, radius: 34, fontSize: 'text-[18px]', fractionSize: 'text-[11px]' },
};

export function ProgressRing({
  percent,
  size = 'md',
  showLabel = true,
  showFraction,
  color,
  className,
  ...props
}: ProgressRingProps) {
  const roundedPercent = Math.round(percent);
  const { wrapper, stroke, radius, fontSize, fractionSize } = sizes[size];
  const isComplete = percent >= 100;

  // Calculate SVG dimensions and circumference
  const viewBoxSize = (radius + stroke) * 2;
  const center = viewBoxSize / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  // Default to gatsby blue, or green if complete
  const strokeColor = color || (isComplete ? 'stroke-status-success' : 'stroke-gatsby');

  return (
    <div
      className={cn('relative inline-flex items-center justify-center flex-shrink-0', wrapper, className)}
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
          className="stroke-gray-100"
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
          className={cn('transition-all duration-500 ease-out', strokeColor)}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showLabel && (
          <span className={cn('font-semibold text-text-primary tracking-tight', fontSize)}>
            {roundedPercent}%
          </span>
        )}
        {showFraction && (
          <span className={cn('text-text-muted font-medium', fractionSize)}>{showFraction}</span>
        )}
      </div>
    </div>
  );
}
