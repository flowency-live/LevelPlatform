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

    it('renders progress ring with correct percentage', () => {
      render(<BenchmarkCard {...defaultProps} />);
      expect(screen.getByLabelText('75% complete')).toBeInTheDocument();
    });

    it('renders activity fraction', () => {
      render(<BenchmarkCard {...defaultProps} />);
      expect(screen.getByText('6 of 8')).toBeInTheDocument();
    });
  });

  describe('next activity', () => {
    it('displays next activity when provided', () => {
      render(
        <BenchmarkCard
          {...defaultProps}
          nextActivity="Attend careers assembly"
        />
      );
      expect(screen.getByText('Next:')).toBeInTheDocument();
      expect(screen.getByText('Attend careers assembly')).toBeInTheDocument();
    });

    it('does not display next section when no next activity', () => {
      render(<BenchmarkCard {...defaultProps} />);
      expect(screen.queryByText('Next:')).not.toBeInTheDocument();
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

    it('has shadow styling', () => {
      render(<BenchmarkCard {...defaultProps} data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('shadow-sm');
    });

    it('has rounded corners', () => {
      render(<BenchmarkCard {...defaultProps} data-testid="card" />);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('rounded-lg');
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
      expect(screen.getByText('0%')).toBeInTheDocument();
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
