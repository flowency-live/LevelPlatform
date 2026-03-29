import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ProgressRing } from '@/components/shared/ProgressRing';
import type { BenchmarkId } from '@/lib/types/student';

export interface BenchmarkCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle' | 'onBeforeToggle'> {
  benchmarkId: BenchmarkId;
  title: string;
  percentComplete: number;
  activitiesComplete: number;
  activitiesTotal: number;
  nextActivity?: string;
  onClick?: () => void;
}

export function BenchmarkCard({
  benchmarkId,
  title,
  percentComplete,
  activitiesComplete,
  activitiesTotal,
  nextActivity,
  onClick,
  className,
  ...props
}: BenchmarkCardProps) {
  const isInteractive = Boolean(onClick);
  const Component = isInteractive ? 'button' : 'div';

  const cardContent = (
    <>
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Benchmark ID badge */}
          <span className="inline-block px-2 py-0.5 mb-2 text-xs font-semibold text-gatsby-dark bg-gatsby-bg rounded">
            {benchmarkId}
          </span>
          {/* Title */}
          <h3 className="text-base font-semibold text-text-primary truncate">
            {title}
          </h3>
        </div>

        {/* Progress ring */}
        <ProgressRing
          percent={percentComplete}
          size="sm"
          showLabel
          showFraction={`${activitiesComplete} of ${activitiesTotal}`}
        />
      </div>

      {/* Next activity prompt */}
      {nextActivity && (
        <div className="mt-4 pt-3 border-t border-border-default">
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">Next:</span>{' '}
            {nextActivity}
          </p>
        </div>
      )}
    </>
  );

  const baseClasses = cn(
    'block w-full text-left p-4',
    'bg-white rounded-lg shadow-sm',
    'border border-border-default border-l-4 border-l-gatsby',
    'transition-shadow duration-200',
    isInteractive && 'hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-gatsby focus:ring-offset-2',
    className
  );

  if (isInteractive) {
    // Only pass safe attributes to button
    const dataTestId = (props as Record<string, unknown>)['data-testid'] as string | undefined;
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${title}, ${percentComplete}% complete`}
        className={baseClasses}
        data-testid={dataTestId}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {cardContent}
    </div>
  );
}
