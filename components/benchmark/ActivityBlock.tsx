import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { Activity, ActivityId } from '@/lib/types/student';

export interface ActivityBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  activity: Activity;
  isComplete: boolean;
  completedAt?: string;
  evidenceCount?: number;
  onToggle: (activityId: ActivityId) => void;
  onExpand?: () => void;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ActivityBlock({
  activity,
  isComplete,
  completedAt,
  evidenceCount,
  onToggle,
  onExpand,
  className,
  ...props
}: ActivityBlockProps) {
  const handleCheckboxChange = () => {
    onToggle(activity.id);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-lg border border-border-default bg-white',
        className
      )}
      {...props}
    >
      {/* Checkbox with 44px touch target */}
      <div
        data-testid="checkbox-wrapper"
        className="flex items-center justify-center min-w-[44px] min-h-[44px] -m-1"
      >
        <input
          type="checkbox"
          id={`activity-${activity.id}`}
          checked={isComplete}
          onChange={handleCheckboxChange}
          aria-label={activity.name}
          className={cn(
            'w-6 h-6 rounded border-2 cursor-pointer',
            'transition-colors duration-150',
            isComplete
              ? 'bg-status-success border-status-success text-white'
              : 'bg-white border-input hover:border-muted-foreground'
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <label
          htmlFor={`activity-${activity.id}`}
          className={cn(
            'block text-sm font-medium cursor-pointer',
            isComplete ? 'text-text-secondary line-through' : 'text-text-primary'
          )}
        >
          {activity.name}
        </label>

        {/* Metadata row */}
        <div className="flex items-center gap-2 mt-1">
          {isComplete && completedAt && (
            <span className="text-xs text-text-muted">
              {formatDate(completedAt)}
            </span>
          )}
          {evidenceCount && evidenceCount > 0 && (
            <span
              data-testid="evidence-badge"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium bg-gatsby-bg text-gatsby-dark rounded"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {evidenceCount}
            </span>
          )}
        </div>
      </div>

      {/* Expand button */}
      {onExpand && (
        <button
          type="button"
          data-testid="expand-button"
          onClick={onExpand}
          className="flex items-center justify-center w-8 h-8 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Expand activity details"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
