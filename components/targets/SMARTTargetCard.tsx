'use client';

import { useState, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { SMARTTarget } from '@/lib/types/student';

export interface SMARTTargetCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> {
  target: SMARTTarget;
  onEdit: (targetId: string) => void;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const statusConfig = {
  'not-started': {
    label: 'Not Started',
    className: 'bg-muted text-muted-foreground',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-status-warning-bg text-status-warning',
  },
  'complete': {
    label: 'Complete',
    className: 'bg-status-success text-white',
  },
};

export function SMARTTargetCard({
  target,
  onEdit,
  className,
  ...props
}: SMARTTargetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { label: statusLabel, className: statusClassName } = statusConfig[target.status];

  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-border-default p-4',
        className
      )}
      {...props}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text-primary">{target.description}</p>
          <p className="text-sm text-text-secondary mt-1">
            Due: {formatDate(target.timeBound)}
          </p>
        </div>
        <span
          className={cn(
            'inline-flex items-center px-2 py-1 text-xs font-medium rounded-full',
            statusClassName
          )}
        >
          {statusLabel}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-text-secondary">Progress</span>
          <span className="font-medium text-text-primary">{target.progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={target.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${target.progress}% complete`}
          className="h-2 bg-muted rounded-full overflow-hidden"
        >
          <div
            className={cn(
              'h-full transition-all duration-300',
              target.status === 'complete' ? 'bg-status-success' : 'bg-gatsby'
            )}
            style={{ width: `${target.progress}%` }}
          />
        </div>
      </div>

      {/* SMART criteria (expandable) */}
      {isExpanded && (
        <div className="border-t border-border-default pt-3 mt-3 space-y-2">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase">Specific</span>
            <p className="text-sm text-text-primary">{target.specific}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase">Measurable</span>
            <p className="text-sm text-text-primary">{target.measurable}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase">Achievable</span>
            <p className="text-sm text-text-primary">{target.achievable}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase">Relevant</span>
            <p className="text-sm text-text-primary">{target.relevant}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase">Time-bound</span>
            <p className="text-sm text-text-primary">{formatDate(target.timeBound)}</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-default">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          className="text-sm text-gatsby hover:text-gatsby-dark font-medium"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
        <button
          type="button"
          onClick={() => onEdit(target.id)}
          aria-label="Edit target"
          className="text-sm text-text-secondary hover:text-text-primary font-medium"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
