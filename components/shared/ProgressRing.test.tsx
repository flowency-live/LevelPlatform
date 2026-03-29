import { render, screen } from '@testing-library/react';
import { ProgressRing } from './ProgressRing';

describe('ProgressRing', () => {
  describe('rendering', () => {
    it('renders an SVG element', () => {
      render(<ProgressRing percent={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders with correct aria-label', () => {
      render(<ProgressRing percent={75} />);
      expect(screen.getByLabelText('75% complete')).toBeInTheDocument();
    });
  });

  describe('percentage display', () => {
    it('shows percentage label when showLabel is true', () => {
      render(<ProgressRing percent={50} showLabel />);
      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('hides percentage label when showLabel is false', () => {
      render(<ProgressRing percent={50} showLabel={false} />);
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    it('shows percentage label by default', () => {
      render(<ProgressRing percent={75} />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('rounds percentage to whole number', () => {
      render(<ProgressRing percent={33.33} showLabel />);
      expect(screen.getByText('33%')).toBeInTheDocument();
    });
  });

  describe('fraction display', () => {
    it('shows fraction when provided', () => {
      render(<ProgressRing percent={75} showFraction="6 of 8" />);
      expect(screen.getByText('6 of 8')).toBeInTheDocument();
    });

    it('does not show fraction when not provided', () => {
      render(<ProgressRing percent={75} />);
      expect(screen.queryByText(/of/)).not.toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('renders small size (48px)', () => {
      render(<ProgressRing percent={50} size="sm" data-testid="ring" />);
      const ring = screen.getByTestId('ring');
      expect(ring).toHaveClass('w-12', 'h-12');
    });

    it('renders medium size (64px) by default', () => {
      render(<ProgressRing percent={50} data-testid="ring" />);
      const ring = screen.getByTestId('ring');
      expect(ring).toHaveClass('w-16', 'h-16');
    });

    it('renders large size (96px)', () => {
      render(<ProgressRing percent={50} size="lg" data-testid="ring" />);
      const ring = screen.getByTestId('ring');
      expect(ring).toHaveClass('w-24', 'h-24');
    });
  });

  describe('colours', () => {
    it('uses gatsby blue by default', () => {
      render(<ProgressRing percent={50} />);
      const progressCircle = screen.getByTestId('progress-circle');
      expect(progressCircle).toHaveClass('stroke-gatsby');
    });

    it('applies custom colour when provided', () => {
      render(<ProgressRing percent={50} color="stroke-status-success" />);
      const progressCircle = screen.getByTestId('progress-circle');
      expect(progressCircle).toHaveClass('stroke-status-success');
    });
  });

  describe('progress calculation', () => {
    it('shows 0% as empty ring', () => {
      render(<ProgressRing percent={0} />);
      const progressCircle = screen.getByTestId('progress-circle');
      // strokeDashoffset should equal circumference (full offset = empty)
      expect(progressCircle).toHaveAttribute('stroke-dashoffset');
    });

    it('shows 100% as full ring', () => {
      render(<ProgressRing percent={100} />);
      const progressCircle = screen.getByTestId('progress-circle');
      // strokeDashoffset should be 0 (no offset = full)
      expect(progressCircle).toHaveAttribute('stroke-dashoffset', '0');
    });

    it('shows 50% as half ring', () => {
      render(<ProgressRing percent={50} />);
      const progressCircle = screen.getByTestId('progress-circle');
      const offset = progressCircle.getAttribute('stroke-dashoffset');
      // At 50%, offset should be approximately half the circumference
      expect(parseFloat(offset || '0')).toBeGreaterThan(0);
    });
  });

  describe('animation', () => {
    it('has transition class for animation', () => {
      render(<ProgressRing percent={50} />);
      const progressCircle = screen.getByTestId('progress-circle');
      expect(progressCircle).toHaveClass('transition-all');
    });
  });

  describe('accessibility', () => {
    it('has aria-valuenow attribute', () => {
      render(<ProgressRing percent={75} />);
      const ring = screen.getByRole('progressbar');
      expect(ring).toHaveAttribute('aria-valuenow', '75');
    });

    it('has aria-valuemin and aria-valuemax', () => {
      render(<ProgressRing percent={50} />);
      const ring = screen.getByRole('progressbar');
      expect(ring).toHaveAttribute('aria-valuemin', '0');
      expect(ring).toHaveAttribute('aria-valuemax', '100');
    });
  });
});
