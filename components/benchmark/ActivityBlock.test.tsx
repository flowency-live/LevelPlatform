import { render, screen, fireEvent } from '@testing-library/react';
import { ActivityBlock } from './ActivityBlock';
import type { Activity, ActivityId, BenchmarkId } from '@/lib/types/student';

describe('ActivityBlock', () => {
  const mockActivity: Activity = {
    id: 'ACT-001' as ActivityId,
    benchmarkId: 'GB1' as BenchmarkId,
    name: 'Attend careers week',
    description: 'Participate in the annual careers week event',
    order: 1,
  };

  const defaultProps = {
    activity: mockActivity,
    isComplete: false,
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders activity name', () => {
      render(<ActivityBlock {...defaultProps} />);
      expect(screen.getByText('Attend careers week')).toBeInTheDocument();
    });

    it('renders checkbox', () => {
      render(<ActivityBlock {...defaultProps} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('checkbox is unchecked when not complete', () => {
      render(<ActivityBlock {...defaultProps} isComplete={false} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('checkbox is checked when complete', () => {
      render(<ActivityBlock {...defaultProps} isComplete={true} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('completion', () => {
    it('calls onToggle when checkbox clicked', () => {
      const handleToggle = jest.fn();
      render(<ActivityBlock {...defaultProps} onToggle={handleToggle} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(handleToggle).toHaveBeenCalledWith('ACT-001');
    });

    it('shows completion date when complete', () => {
      render(
        <ActivityBlock
          {...defaultProps}
          isComplete={true}
          completedAt="2026-03-15T10:30:00Z"
        />
      );
      expect(screen.getByText(/15 Mar 2026/)).toBeInTheDocument();
    });

    it('does not show completion date when not complete', () => {
      render(<ActivityBlock {...defaultProps} isComplete={false} />);
      expect(screen.queryByText(/Mar 2026/)).not.toBeInTheDocument();
    });
  });

  describe('evidence', () => {
    it('shows evidence count when present', () => {
      render(<ActivityBlock {...defaultProps} evidenceCount={3} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('does not show evidence badge when count is 0', () => {
      render(<ActivityBlock {...defaultProps} evidenceCount={0} />);
      expect(screen.queryByTestId('evidence-badge')).not.toBeInTheDocument();
    });

    it('does not show evidence badge when not provided', () => {
      render(<ActivityBlock {...defaultProps} />);
      expect(screen.queryByTestId('evidence-badge')).not.toBeInTheDocument();
    });
  });

  describe('expand/collapse', () => {
    it('renders expand button when onExpand provided', () => {
      render(<ActivityBlock {...defaultProps} onExpand={jest.fn()} />);
      expect(screen.getByTestId('expand-button')).toBeInTheDocument();
    });

    it('does not render expand button when onExpand not provided', () => {
      render(<ActivityBlock {...defaultProps} />);
      expect(screen.queryByTestId('expand-button')).not.toBeInTheDocument();
    });

    it('calls onExpand when expand button clicked', () => {
      const handleExpand = jest.fn();
      render(<ActivityBlock {...defaultProps} onExpand={handleExpand} />);
      fireEvent.click(screen.getByTestId('expand-button'));
      expect(handleExpand).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('checkbox has 44px minimum touch target', () => {
      render(<ActivityBlock {...defaultProps} />);
      const checkboxWrapper = screen.getByTestId('checkbox-wrapper');
      expect(checkboxWrapper).toHaveClass('min-w-[44px]', 'min-h-[44px]');
    });

    it('checkbox has accessible label', () => {
      render(<ActivityBlock {...defaultProps} />);
      expect(
        screen.getByRole('checkbox', { name: /Attend careers week/i })
      ).toBeInTheDocument();
    });
  });

  describe('visual states', () => {
    it('applies muted styling when not complete', () => {
      render(<ActivityBlock {...defaultProps} isComplete={false} data-testid="block" />);
      const block = screen.getByTestId('block');
      expect(block).not.toHaveClass('opacity-75');
    });

    it('applies completed styling when complete', () => {
      render(<ActivityBlock {...defaultProps} isComplete={true} data-testid="block" />);
      const activityName = screen.getByText('Attend careers week');
      expect(activityName).toHaveClass('line-through');
    });
  });
});
