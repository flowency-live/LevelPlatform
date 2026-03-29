import { render, screen, fireEvent } from '@testing-library/react';
import { SMARTTargetCard } from './SMARTTargetCard';
import type { SMARTTarget, StudentId } from '@/lib/types/student';

describe('SMARTTargetCard', () => {
  const mockTarget: SMARTTarget = {
    id: 'TARGET-001',
    studentId: 'STUDENT-001' as StudentId,
    description: 'Finish work experience at local business',
    specific: 'Arrange and finish a 1-week work placement',
    measurable: 'Signed off by employer and school',
    achievable: 'Local businesses contacted, dates agreed',
    relevant: 'Supports GB6 benchmark completion',
    timeBound: '2026-06-30T00:00:00Z',
    progress: 50,
    status: 'in-progress',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-20T14:00:00Z',
  };

  const defaultProps = {
    target: mockTarget,
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('displays target description', () => {
      render(<SMARTTargetCard {...defaultProps} />);
      expect(screen.getByText(/finish work experience/i)).toBeInTheDocument();
    });

    it('shows progress percentage', () => {
      render(<SMARTTargetCard {...defaultProps} />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('displays progress bar', () => {
      render(<SMARTTargetCard {...defaultProps} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    });

    it('shows deadline date', () => {
      render(<SMARTTargetCard {...defaultProps} />);
      expect(screen.getByText(/30 jun/i)).toBeInTheDocument();
    });

    it('displays status badge for in-progress', () => {
      render(<SMARTTargetCard {...defaultProps} />);
      expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    });
  });

  describe('status variants', () => {
    it('shows not started status', () => {
      const notStartedTarget = { ...mockTarget, status: 'not-started' as const, progress: 0 };
      render(<SMARTTargetCard target={notStartedTarget} onEdit={jest.fn()} />);
      expect(screen.getByText(/not started/i)).toBeInTheDocument();
    });

    it('shows complete status', () => {
      const completeTarget = { ...mockTarget, status: 'complete' as const, progress: 100 };
      render(<SMARTTargetCard target={completeTarget} onEdit={jest.fn()} />);
      expect(screen.getByText(/complete/i)).toBeInTheDocument();
    });

    it('applies success colour for complete status', () => {
      const completeTarget = { ...mockTarget, status: 'complete' as const, progress: 100 };
      render(<SMARTTargetCard target={completeTarget} onEdit={jest.fn()} />);
      const badge = screen.getByText(/complete/i);
      expect(badge).toHaveClass('bg-status-success');
    });
  });

  describe('SMART criteria expansion', () => {
    it('has expand button', () => {
      render(<SMARTTargetCard {...defaultProps} />);
      expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument();
    });

    it('shows SMART criteria when expanded', () => {
      render(<SMARTTargetCard {...defaultProps} />);
      const expandButton = screen.getByRole('button', { name: /expand/i });
      fireEvent.click(expandButton);

      expect(screen.getByText(/specific/i)).toBeInTheDocument();
      expect(screen.getByText(/arrange and finish/i)).toBeInTheDocument();
      expect(screen.getByText(/measurable/i)).toBeInTheDocument();
      expect(screen.getByText(/achievable/i)).toBeInTheDocument();
      expect(screen.getByText(/relevant/i)).toBeInTheDocument();
      expect(screen.getByText(/time-bound/i)).toBeInTheDocument();
    });

    it('hides SMART criteria by default', () => {
      render(<SMARTTargetCard {...defaultProps} />);
      expect(screen.queryByText(/specific/i)).not.toBeInTheDocument();
    });

    it('toggles expansion on click', () => {
      render(<SMARTTargetCard {...defaultProps} />);
      const expandButton = screen.getByRole('button', { name: /expand/i });

      fireEvent.click(expandButton);
      expect(screen.getByText(/specific/i)).toBeInTheDocument();

      fireEvent.click(expandButton);
      expect(screen.queryByText(/specific/i)).not.toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('calls onEdit when edit button clicked', () => {
      const onEdit = jest.fn();
      render(<SMARTTargetCard target={mockTarget} onEdit={onEdit} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      expect(onEdit).toHaveBeenCalledWith(mockTarget.id);
    });
  });

  describe('layout', () => {
    it('renders as a card', () => {
      render(<SMARTTargetCard {...defaultProps} data-testid="target-card" />);
      const card = screen.getByTestId('target-card');
      expect(card).toHaveClass('rounded-lg', 'border');
    });
  });

  describe('accessibility', () => {
    it('has accessible progress bar', () => {
      render(<SMARTTargetCard {...defaultProps} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });
  });
});
