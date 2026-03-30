import { render, screen, fireEvent } from '@testing-library/react';
import { BenchmarkCard } from './BenchmarkCard';
import type { BenchmarkId } from '@/lib/types/student';

describe('BenchmarkCard', () => {
  const defaultProps = {
    benchmarkId: 'GB1' as BenchmarkId,
    title: 'A Stable Careers Programme',
    percentComplete: 75,
    activitiesComplete: 6,
    activitiesTotal: 8,
  };

  describe('rendering', () => {
    it('renders the benchmark title', () => {
      render(<BenchmarkCard {...defaultProps} />);
      expect(screen.getByText('A Stable Careers Programme')).toBeInTheDocument();
    });

    it('renders the benchmark ID badge', () => {
      render(<BenchmarkCard {...defaultProps} />);
      expect(screen.getByText('GB1')).toBeInTheDocument();
    });

    it('renders percentage in mini progress indicator', () => {
      render(<BenchmarkCard {...defaultProps} />);
      // Percentage shown in both mini indicator and progress section
      expect(screen.getAllByText('75%').length).toBeGreaterThanOrEqual(1);
    });

    it('renders activity fraction', () => {
      render(<BenchmarkCard {...defaultProps} />);
      expect(screen.getByText('6/8 activities')).toBeInTheDocument();
    });
  });

  describe('visual styling', () => {
    it('has Gatsby blue left border', () => {
      render(<BenchmarkCard {...defaultProps} data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-l-4', 'border-l-gatsby');
    });

    it('has white background', () => {
      render(<BenchmarkCard {...defaultProps} data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('bg-white');
    });

    it('has rounded corners', () => {
      render(<BenchmarkCard {...defaultProps} data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('rounded-2xl');
    });

    it('has progress bar', () => {
      render(<BenchmarkCard {...defaultProps} data-testid="card" />);
      const card = screen.getByTestId('card');
      const progressBar = card.querySelector('.h-1\\.5.bg-gray-100');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<BenchmarkCard {...defaultProps} onClick={handleClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders as button when onClick provided', () => {
      const handleClick = jest.fn();
      render(<BenchmarkCard {...defaultProps} onClick={handleClick} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders as div when onClick not provided', () => {
      render(<BenchmarkCard {...defaultProps} data-testid="card" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('has hover effect when interactive', () => {
      const handleClick = jest.fn();
      render(<BenchmarkCard {...defaultProps} onClick={handleClick} />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:shadow-md');
    });
  });

  describe('completion states', () => {
    it('shows complete state at 100%', () => {
      render(
        <BenchmarkCard
          {...defaultProps}
          percentComplete={100}
          activitiesComplete={8}
          data-testid="card"
        />
      );
      // At 100%, shows checkmark instead of percentage in mini indicator
      const card = screen.getByTestId('card');
      const checkmark = card.querySelector('svg path[d*="M5 13l4 4L19 7"]');
      expect(checkmark).toBeInTheDocument();
      // But percentage still shown in progress bar section
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('shows not started state at 0%', () => {
      render(
        <BenchmarkCard
          {...defaultProps}
          percentComplete={0}
          activitiesComplete={0}
          data-testid="card"
        />
      );
      expect(screen.getAllByText('0%').length).toBeGreaterThanOrEqual(1);
    });

    it('changes border color to success when complete', () => {
      render(
        <BenchmarkCard
          {...defaultProps}
          percentComplete={100}
          activitiesComplete={8}
          data-testid="card"
        />
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-l-status-success');
    });
  });

  describe('accessibility', () => {
    it('has accessible name including benchmark title', () => {
      const handleClick = jest.fn();
      render(<BenchmarkCard {...defaultProps} onClick={handleClick} />);
      expect(
        screen.getByRole('button', { name: /A Stable Careers Programme/i })
      ).toBeInTheDocument();
    });
  });
});
