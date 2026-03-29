import { render, screen } from '@testing-library/react';
import Home from './page';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
  };
});

describe('Landing Page', () => {
  describe('header', () => {
    it('displays Elevate branding', () => {
      render(<Home />);
      expect(screen.getByText(/elevate/i)).toBeInTheDocument();
    });

    it('shows tagline about careers guidance', () => {
      render(<Home />);
      expect(screen.getAllByText(/gatsby/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('portal cards', () => {
    it('shows Student Portal card', () => {
      render(<Home />);
      expect(screen.getByText(/student portal/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /enter as student/i })).toHaveAttribute('href', '/student');
    });

    it('shows Teacher Dashboard card', () => {
      render(<Home />);
      expect(screen.getByText(/teacher dashboard/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /enter as teacher/i })).toHaveAttribute('href', '/teacher');
    });

    it('shows Admin/Management card', () => {
      render(<Home />);
      expect(screen.getByText(/school management/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /enter.*management/i })).toHaveAttribute('href', '/admin');
    });
  });

  describe('footer info', () => {
    it('mentions Gatsby Benchmarks', () => {
      render(<Home />);
      expect(screen.getByText(/8 benchmarks/i)).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies page background surface colour', () => {
      render(<Home />);
      const container = screen.getByTestId('portal-page');
      expect(container).toHaveClass('bg-surface-page');
    });

    it('portal cards have proper styling with shadow', () => {
      render(<Home />);
      const cards = screen.getAllByRole('article');
      expect(cards.length).toBe(3);
      cards.forEach((card) => {
        expect(card).toHaveClass('bg-white');
        expect(card).toHaveClass('shadow-sm');
      });
    });

    it('portal links use tenant primary colour', () => {
      render(<Home />);
      const studentLink = screen.getByRole('link', { name: /enter as student/i });
      expect(studentLink).toHaveClass('bg-tenant-primary');
    });
  });
});
