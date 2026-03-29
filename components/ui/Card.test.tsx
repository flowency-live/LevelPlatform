import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('renders as div by default', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card').tagName).toBe('DIV');
    });
  });

  describe('styling', () => {
    it('has white background', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('bg-white');
    });

    it('has border', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('border');
    });

    it('has 12px border radius', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('rounded-lg');
    });

    it('has shadow-sm', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('shadow-sm');
    });
  });

  describe('padding variants', () => {
    it('applies default padding', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-6');
    });

    it('applies small padding', () => {
      render(<Card data-testid="card" padding="sm">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-4');
    });

    it('applies large padding', () => {
      render(<Card data-testid="card" padding="lg">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-8');
    });

    it('applies no padding when none', () => {
      render(<Card data-testid="card" padding="none">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('p-0');
    });
  });

  describe('interactive variant', () => {
    it('has hover state when interactive', () => {
      render(<Card data-testid="card" interactive>Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('hover:shadow-md');
    });

    it('has cursor-pointer when interactive', () => {
      render(<Card data-testid="card" interactive>Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('cursor-pointer');
    });

    it('has focus state when interactive', () => {
      render(<Card data-testid="card" interactive>Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('focus-visible:ring-2');
    });

    it('calls onClick when clicked (interactive)', () => {
      const handleClick = jest.fn();
      render(<Card interactive onClick={handleClick}>Content</Card>);
      fireEvent.click(screen.getByText('Content'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('custom className', () => {
    it('merges custom className', () => {
      render(<Card data-testid="card" className="custom-class">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
      expect(screen.getByTestId('card')).toHaveClass('bg-white');
    });
  });
});
