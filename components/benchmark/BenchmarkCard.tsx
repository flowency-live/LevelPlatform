import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
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
  onClick,
  className,
  ...props
}: BenchmarkCardProps) {
  const isInteractive = Boolean(onClick);
  const isComplete = percentComplete >= 100;

  const cardContent = (
    <>
      {/* Header with badge and progress ring */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-md",
          isComplete
            ? "bg-status-success-bg text-status-success"
            : "bg-gatsby-bg text-gatsby-dark"
        )}>
          {benchmarkId}
        </span>
        {/* Mini progress indicator */}
        <div className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center">
          {isComplete ? (
            <svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="text-[10px] font-semibold text-text-muted">{Math.round(percentComplete)}%</span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-semibold text-text-primary leading-snug mb-3 min-h-[2.5rem]">
        {title}
      </h3>

      {/* Progress section */}
      <div className="mt-auto">
        <div className="flex items-center justify-between text-[11px] text-text-muted mb-1.5">
          <span>{activitiesComplete}/{activitiesTotal} activities</span>
          <span>{Math.round(percentComplete)}%</span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isComplete ? "bg-status-success" : "bg-gatsby"
            )}
            style={{ width: `${Math.min(percentComplete, 100)}%` }}
          />
        </div>
      </div>
    </>
  );

  const baseClasses = cn(
    'flex flex-col w-full text-left p-4',
    'bg-white rounded-2xl',
    'border border-border-default border-l-4 border-l-gatsby',
    'transition-all duration-200 min-h-[140px]',
    isInteractive && 'hover:shadow-md hover:border-l-gatsby-dark cursor-pointer focus:outline-none focus:ring-2 focus:ring-gatsby/20 focus:ring-offset-2',
    isComplete && 'border-l-status-success',
    className
  );

  if (isInteractive) {
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
